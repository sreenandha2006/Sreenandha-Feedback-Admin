import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/feedback';

const AddFeedback = () => {
  const { id } = useParams(); // If present, component is in Edit/Update mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    courseName: '',
    courseDuration: '',
    feedbackComments: '',
    feedbackRating: 5,
    courseId: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // If in edit mode, fetch existing record to populate the form
  useEffect(() => {
    if (isEditMode) {
      const fetchExistingFeedback = async () => {
        setIsLoadingRecord(true);
        setServerError(null);
        try {
          const res = await fetch(`${API_URL}/${id}`);
          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.message || 'Could not fetch feedback record for editing.');
          }

          if (result.data) {
            setFormData({
              courseName: result.data.courseName || '',
              courseDuration: result.data.courseDuration || '',
              feedbackComments: result.data.feedbackComments || '',
              feedbackRating: Number(result.data.feedbackRating) || 5,
              courseId: result.data.courseId || '',
            });
          }
        } catch (err) {
          console.error('Error fetching record:', err);
          setServerError(err.message || 'Failed to load existing feedback.');
        } finally {
          setIsLoadingRecord(false);
        }
      };

      fetchExistingFeedback();
    }
  }, [id, isEditMode]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'feedbackRating' ? Number(value) : value,
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    if (!formData.courseName.trim()) {
      errors.courseName = 'Course name is required.';
    } else if (formData.courseName.trim().length < 2) {
      errors.courseName = 'Course name must have at least 2 characters.';
    }

    if (!formData.courseDuration.trim()) {
      errors.courseDuration = 'Course duration is required (e.g., 6 Months, 12 Weeks).';
    }

    if (!formData.feedbackComments.trim()) {
      errors.feedbackComments = 'Feedback comments cannot be empty.';
    } else if (formData.feedbackComments.trim().length < 3) {
      errors.feedbackComments = 'Feedback comments must be at least 3 characters.';
    }

    const rating = Number(formData.feedbackRating);
    if (!rating || rating < 1 || rating > 5) {
      errors.feedbackRating = 'Rating must be between 1 and 5.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isEditMode ? `${API_URL}/${id}` : API_URL;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Server rejected the request.');
      }

      setSuccessMessage(
        isEditMode
          ? 'Feedback updated successfully! Redirecting to Dashboard...'
          : `Feedback created successfully with Course ID ${result.data?.courseId}! Redirecting...`
      );

      // Redirect back to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setServerError(err.message || 'An error occurred while saving the feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-house-door-fill"></i> Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {isEditMode ? 'Update Feedback' : 'Add Feedback'}
          </li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {/* Card Container */}
          <div className="card form-card p-4 p-md-5">
            {/* Header */}
            <div className="border-bottom pb-3 mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                    <i className={`bi ${isEditMode ? 'bi-pencil-square text-warning' : 'bi-plus-circle-fill text-primary'}`}></i>
                    {isEditMode ? 'Update Course Feedback' : 'Add New Course Feedback'}
                  </h3>
                  <p className="text-muted mb-0 small">
                    {isEditMode
                      ? 'Modify the existing course feedback details below and save changes.'
                      : 'Submit fresh course evaluation feedback for ICT Academy courses. Course ID will be automatically generated.'}
                  </p>
                </div>

                {isEditMode && formData.courseId && (
                  <div className="text-end">
                    <span className="small text-muted d-block">Course ID</span>
                    <span className="course-id-badge">{formData.courseId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="alert alert-success d-flex align-items-center gap-2 shadow-sm" role="alert">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <div>{successMessage}</div>
              </div>
            )}

            {/* Server Error Banner */}
            {serverError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 shadow-sm" role="alert">
                <i className="bi bi-exclamation-octagon-fill fs-5"></i>
                <div className="flex-grow-1">{serverError}</div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setServerError(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Loading existing record spinner in Edit Mode */}
            {isLoadingRecord ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading feedback details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Automatic Course ID indicator for new additions */}
                {!isEditMode && (
                  <div className="alert alert-light border d-flex align-items-center gap-2 mb-4 py-2">
                    <i className="bi bi-magic text-primary fs-5"></i>
                    <div className="small text-muted">
                      <strong>Course ID:</strong> Automatically generated upon creation (e.g., <code>CRS-4821</code>).
                    </div>
                  </div>
                )}

                {/* 1. Course Name */}
                <div className="mb-4">
                  <label htmlFor="courseName" className="form-label">
                    Course Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    className={`form-control ${validationErrors.courseName ? 'is-invalid' : ''}`}
                    placeholder="e.g. Certified Specialist in Full Stack Development (MERN)"
                    value={formData.courseName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {validationErrors.courseName && (
                    <div className="invalid-feedback">{validationErrors.courseName}</div>
                  )}
                  <small className="form-text text-muted">
                    Enter the official course or program title.
                  </small>
                </div>

                {/* 2. Course Duration */}
                <div className="mb-4">
                  <label htmlFor="courseDuration" className="form-label">
                    Course Duration <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted">
                      <i className="bi bi-clock-history"></i>
                    </span>
                    <input
                      type="text"
                      id="courseDuration"
                      name="courseDuration"
                      className={`form-control ${validationErrors.courseDuration ? 'is-invalid' : ''}`}
                      placeholder="e.g. 6 Months / 12 Weeks / 40 Hours"
                      value={formData.courseDuration}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {validationErrors.courseDuration && (
                      <div className="invalid-feedback">{validationErrors.courseDuration}</div>
                    )}
                  </div>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    <span className="small text-muted">Quick presets:</span>
                    {['3 Months', '6 Months', '12 Weeks', '40 Hours'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0 px-2 small"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, courseDuration: preset }));
                          if (validationErrors.courseDuration) {
                            setValidationErrors((prev) => ({ ...prev, courseDuration: null }));
                          }
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Feedback Rating */}
                <div className="mb-4">
                  <label htmlFor="feedbackRating" className="form-label d-flex justify-content-between">
                    <span>
                      Overall Feedback Rating (1 to 5) <span className="text-danger">*</span>
                    </span>
                    <span className="badge bg-warning text-dark fw-bold">
                      {formData.feedbackRating} / 5 Stars
                    </span>
                  </label>

                  {/* Visual Star Rating Buttons */}
                  <div className="star-rating-box mb-2">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        key={starValue}
                        className={`star-btn ${starValue <= formData.feedbackRating ? 'active' : ''}`}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, feedbackRating: starValue }));
                          if (validationErrors.feedbackRating) {
                            setValidationErrors((prev) => ({ ...prev, feedbackRating: null }));
                          }
                        }}
                        title={`Rate ${starValue} of 5`}
                        disabled={isSubmitting}
                      >
                        <i className={`bi ${starValue <= formData.feedbackRating ? 'bi-star-fill' : 'bi-star'}`}></i>
                      </button>
                    ))}
                  </div>

                  <select
                    id="feedbackRating"
                    name="feedbackRating"
                    className={`form-select ${validationErrors.feedbackRating ? 'is-invalid' : ''}`}
                    value={formData.feedbackRating}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value={5}>5 - Excellent ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 - Very Good ⭐⭐⭐⭐</option>
                    <option value={3}>3 - Good ⭐⭐⭐</option>
                    <option value={2}>2 - Fair ⭐⭐</option>
                    <option value={1}>1 - Poor ⭐</option>
                  </select>
                  {validationErrors.feedbackRating && (
                    <div className="invalid-feedback">{validationErrors.feedbackRating}</div>
                  )}
                </div>

                {/* 4. Feedback Comments */}
                <div className="mb-4">
                  <label htmlFor="feedbackComments" className="form-label">
                    Feedback Comments <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="feedbackComments"
                    name="feedbackComments"
                    rows="4"
                    className={`form-control ${validationErrors.feedbackComments ? 'is-invalid' : ''}`}
                    placeholder="Describe your learning experience, trainer effectiveness, curriculum coverage, and project guidance..."
                    value={formData.feedbackComments}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  ></textarea>
                  {validationErrors.feedbackComments && (
                    <div className="invalid-feedback">{validationErrors.feedbackComments}</div>
                  )}
                  <small className="form-text text-muted">
                    Min 3 characters. Provide constructive comments on the course experience.
                  </small>
                </div>

                {/* Form Buttons */}
                <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-light px-4 py-2 border"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-x-circle me-1"></i> Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className={`bi ${isEditMode ? 'bi-check2-circle' : 'bi-send-check'}`}></i>
                        {isEditMode ? 'Update Feedback' : 'Submit Feedback'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeedback;
