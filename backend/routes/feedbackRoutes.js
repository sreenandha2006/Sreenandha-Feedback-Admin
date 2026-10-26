import express from 'express';
import mongoose from 'mongoose';
import Feedback, { generateCourseId } from '../models/Feedback.js';

const router = express.Router();

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback entries (sorted newest first)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    console.error('Error fetching feedback entries:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback entries',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/feedback/:id
 * @desc    Get a single feedback entry by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID format',
      });
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error fetching single feedback:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/feedback
 * @desc    Create a new feedback entry (Course ID is automatically generated if not provided)
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { courseName, courseDuration, feedbackComments, feedbackRating, courseId } = req.body;

    // Field validations
    if (!courseName || !courseName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course Name is required',
      });
    }

    if (!courseDuration || !courseDuration.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course Duration is required',
      });
    }

    if (!feedbackComments || !feedbackComments.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Feedback Comments are required',
      });
    }

    const numericRating = Number(feedbackRating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Feedback Rating must be a number between 1 and 5',
      });
    }

    // Create new feedback document
    const newFeedback = new Feedback({
      courseId: courseId && courseId.trim() ? courseId.trim().toUpperCase() : generateCourseId(),
      courseName: courseName.trim(),
      courseDuration: courseDuration.trim(),
      feedbackComments: feedbackComments.trim(),
      feedbackRating: numericRating,
    });

    const savedFeedback = await newFeedback.save();

    return res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: savedFeedback,
    });
  } catch (error) {
    console.error('Error creating feedback entry:', error.message);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create feedback entry',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/feedback/:id
 * @desc    Update an existing feedback entry by ID
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID format',
      });
    }

    const { courseName, courseDuration, feedbackComments, feedbackRating, courseId } = req.body;

    // Prepare updates
    const updates = {};
    if (courseName !== undefined) updates.courseName = courseName.trim();
    if (courseDuration !== undefined) updates.courseDuration = courseDuration.trim();
    if (feedbackComments !== undefined) updates.feedbackComments = feedbackComments.trim();
    if (courseId !== undefined && courseId.trim()) updates.courseId = courseId.trim().toUpperCase();

    if (feedbackRating !== undefined) {
      const numericRating = Number(feedbackRating);
      if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Feedback Rating must be a number between 1 and 5',
        });
      }
      updates.feedbackRating = numericRating;
    }

    // Update document and return updated version
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      data: updatedFeedback,
    });
  } catch (error) {
    console.error('Error updating feedback entry:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update feedback entry',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete a feedback entry by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID format',
      });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback entry deleted successfully',
      data: deletedFeedback,
    });
  } catch (error) {
    console.error('Error deleting feedback entry:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete feedback entry',
      error: error.message,
    });
  }
});

export default router;
