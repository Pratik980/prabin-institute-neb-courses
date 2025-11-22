import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  duration: {
    type: Number, // total duration in minutes
    default: 0
  },
  lessons: [lessonSchema],
  learningOutcomes: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total duration from lessons
courseSchema.methods.calculateDuration = function() {
  this.duration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  return this.duration;
};

export default mongoose.model('Course', courseSchema);

