import mongoose from 'mongoose';

/**
 * Helper function to generate a unique, beginner-friendly Course ID.
 * Generates an ID in the format: CRS-XXXX (e.g. CRS-4821)
 */
export const generateCourseId = () => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CRS-${randomSuffix}`;
};

const feedbackSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
      default: generateCourseId,
      trim: true,
      uppercase: true,
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      minlength: [2, 'Course name must have at least 2 characters'],
    },
    courseDuration: {
      type: String,
      required: [true, 'Course duration is required (e.g., 6 Months, 12 Weeks)'],
      trim: true,
    },
    feedbackComments: {
      type: String,
      required: [true, 'Feedback comment is required'],
      trim: true,
      minlength: [3, 'Feedback comment must have at least 3 characters'],
    },
    feedbackRating: {
      type: Number,
      required: [true, 'Feedback rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Ensure that even if an empty string is provided, courseId is generated
feedbackSchema.pre('validate', function (next) {
  if (!this.courseId || this.courseId.trim() === '') {
    this.courseId = generateCourseId();
  }
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
