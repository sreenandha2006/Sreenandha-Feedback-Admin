import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/feedback';

const Dashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch all feedback on component mount
  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch feedback records');
      }

      setFeedbackList(result.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Could not connect to the backend server. Make sure MongoDB and backend are running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Handle opening delete confirmation
  const initiateDelete = (item) => {
    setItemToDelete(item);
  };

  // Confirm and execute delete operation
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete._id);
    try {
      const response = await fetch(`${API_URL}/${itemToDelete._id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete feedback');
      }

      // Update state without needing full refetch
      setFeedbackList((prev) => prev.filter((item) => item._id !== itemToDelete._id));
      setSuccessMessage(`Feedback for "${itemToDelete.courseName}" (ID: ${itemToDelete.courseId}) was deleted successfully.`);
      
      // Auto-hide success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete the feedback entry.');
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  // Filter feedback records based on search input
  const filteredList = feedbackList.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.courseName?.toLowerCase().includes(term) ||
      item.courseId?.toLowerCase().includes(term) ||
      item.courseDuration?.toLowerCase().includes(term) ||
      item.feedbackComments?.toLowerCase().includes(term)
    );
  });

  // Calculate statistics
  const totalCount = feedbackList.length;
  const averageRating = totalCount > 0
    ? (feedbackList.reduce((sum, item) => sum + Number(item.feedbackRating || 0), 0) / totalCount).toFixed(1)
    : '0.0';

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}`}
          style={{ fontSize: '0.9rem', marginRight: '2px' }}
        ></i>
      );
    }
    return stars;
  };

  const getRatingBadgeClass = (rating) => {
    if (rating >= 4) return 'rating-high';
    if (rating >= 3) return 'rating-medium';
    return 'rating-low';
  };

  return (
    <div className="container py-4">
      {/* Top Banner / Hero Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-mortarboard-fill text-primary me-2"></i>
            Feedback Management Dashboard
          </h2>
          <p className="text-muted mb-0">
            Monitor, update, and manage student course evaluations for ICT Academy of Kerala.
          </p>
        </div>
        <div>
          <Link to="/add" className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold">
            <i className="bi bi-plus-circle-fill"></i> Add Feedback
          </Link>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-chat-square-quote-fill"></i>
            </div>
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Total Feedbacks</div>
              <h3 className="fw-bold mb-0 text-dark">{totalCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <i className="bi bi-star-fill"></i>
            </div>
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Average Rating</div>
              <h3 className="fw-bold mb-0 text-dark">
                {averageRating} <span className="fs-6 text-muted fw-normal">/ 5.0</span>
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-12 col-lg-4">
          <div className="stat-card">
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <i className="bi bi-database-check"></i>
            </div>
            <div>
              <div className="text-muted small fw-semibold text-uppercase">System Status</div>
              <h4 className="fw-bold mb-0 text-success fs-5">
                <i className="bi bi-circle-fill fs-6 text-success me-1"></i>
                {isLoading ? 'Fetching Data...' : 'Connected & Ready'}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{successMessage}</div>
          <button
            type="button"
            className="btn-close ms-auto"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Error Alert Banner */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div className="flex-grow-1">
            <strong>Error:</strong> {error}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={fetchFeedback}
          >
            <i className="bi bi-arrow-clockwise"></i> Retry
          </button>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Dashboard Main Card */}
      <div className="dashboard-card">
        {/* Card Controls Header */}
        <div className="p-3 border-bottom bg-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
            <i className="bi bi-list-columns-reverse text-primary"></i> Course Feedback Records
          </h5>

          {/* Search Box */}
          <div className="input-group" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search course or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3 mb-0 fw-medium">Loading feedback records from MongoDB...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && feedbackList.length === 0 && (
          <div className="text-center py-5 px-3">
            <div className="mb-3 text-muted display-4">
              <i className="bi bi-inbox"></i>
            </div>
            <h5 className="fw-bold text-dark">No Feedback Entries Found</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: '450px' }}>
              There are currently no course feedback entries in the database. Click the button below to add your first entry!
            </p>
            <Link to="/add" className="btn btn-primary mt-2">
              <i className="bi bi-plus-circle me-1"></i> Add First Feedback
            </Link>
          </div>
        )}

        {/* Filtered Empty State (No search results) */}
        {!isLoading && feedbackList.length > 0 && filteredList.length === 0 && (
          <div className="text-center py-5 px-3">
            <div className="mb-2 text-warning display-6">
              <i className="bi bi-search"></i>
            </div>
            <h6 className="fw-bold text-dark">No matching results for "{searchTerm}"</h6>
            <p className="text-muted mb-3">Try adjusting your search query or clear the filter.</p>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSearchTerm('')}>
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Feedback Table */}
        {!isLoading && filteredList.length > 0 && (
          <div className="table-responsive">
            <table className="table feedback-table mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '130px' }}>Course ID</th>
                  <th scope="col">Course Name</th>
                  <th scope="col" style={{ width: '150px' }}>Course Duration</th>
                  <th scope="col" style={{ width: '170px' }}>Overall Rating</th>
                  <th scope="col">Feedback Comments</th>
                  <th scope="col" className="text-end" style={{ width: '190px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="course-id-badge">
                        {item.courseId || 'CRS-N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{item.courseName}</div>
                      <small className="text-muted d-block d-md-none">
                        Duration: {item.courseDuration}
                      </small>
                    </td>
                    <td>
                      <span className="duration-badge">
                        <i className="bi bi-clock me-1"></i>
                        {item.courseDuration}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <div>{renderStars(item.feedbackRating)}</div>
                        <span className={`rating-badge ${getRatingBadgeClass(item.feedbackRating)}`}>
                          Rating: {item.feedbackRating} / 5
                        </span>
                      </div>
                    </td>
                    <td>
                      <p className="mb-0 text-secondary text-truncate-2" style={{ maxWidth: '320px', whiteSpace: 'normal' }}>
                        {item.feedbackComments}
                      </p>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {/* Update Button */}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-action"
                          onClick={() => navigate(`/edit/${item._id}`)}
                          title="Edit this feedback"
                        >
                          <i className="bi bi-pencil-square"></i>
                          <span>Update</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-action"
                          onClick={() => initiateDelete(item)}
                          disabled={deletingId === item._id}
                          title="Delete this feedback"
                        >
                          {deletingId === item._id ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <i className="bi bi-trash3-fill"></i>
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer with Count */}
        {!isLoading && filteredList.length > 0 && (
          <div className="p-3 bg-light border-top text-muted small d-flex justify-content-between align-items-center">
            <span>
              Showing <strong>{filteredList.length}</strong> of <strong>{feedbackList.length}</strong> records
            </span>
            <button
              className="btn btn-sm btn-link text-decoration-none text-muted"
              onClick={fetchFeedback}
            >
              <i className="bi bi-arrow-repeat me-1"></i> Refresh List
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill"></i> Confirm Feedback Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setItemToDelete(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="text-secondary mb-2">
                  Are you sure you want to permanently delete this course feedback entry? This action cannot be undone.
                </p>
                <div className="p-3 bg-light rounded-3 border">
                  <div><strong>Course ID:</strong> <span className="badge bg-secondary">{itemToDelete.courseId}</span></div>
                  <div className="mt-1"><strong>Course Name:</strong> {itemToDelete.courseName}</div>
                  <div className="mt-1"><strong>Duration:</strong> {itemToDelete.courseDuration}</div>
                  <div className="mt-1"><strong>Rating:</strong> {itemToDelete.feedbackRating} / 5 ⭐</div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light px-3"
                  onClick={() => setItemToDelete(null)}
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-3 d-flex align-items-center gap-2"
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                >
                  {deletingId ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash3-fill"></i> Yes, Delete Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
