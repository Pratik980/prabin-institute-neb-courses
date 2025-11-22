import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['esewa', 'khalti', 'stripe', 'cash'],
    default: 'esewa'
  },
  transactionId: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    required: true
  },
  paymentScreenshot: {
    type: String,
    default: ''
  },
  studentName: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    default: ''
  },
  progress: {
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    lastWatchedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);

