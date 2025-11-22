import Course from '../models/Course.model.js';
import Enrollment from '../models/Enrollment.model.js';
import axios from 'axios';

// @desc    Get AI course recommendations
// @route   GET /api/ai/recommendations
// @access  Private
export const getCourseRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's enrolled courses and their categories
    const enrollments = await Enrollment.find({
      student: userId,
      approvalStatus: 'approved'
    }).populate('course');

    const enrolledCategories = [...new Set(
      enrollments.map(e => e.course?.category).filter(Boolean)
    )];

    // Simple recommendation algorithm
    // 1. Recommend courses in similar categories
    // 2. Recommend courses with high ratings
    // 3. Exclude already enrolled courses

    const enrolledCourseIds = enrollments.map(e => e.course._id);

    let recommendations = await Course.find({
      _id: { $nin: enrolledCourseIds },
      isActive: true
    });

    // Sort by relevance (category match, then rating)
    recommendations = recommendations
      .map(course => ({
        course,
        score: (enrolledCategories.includes(course.category) ? 10 : 0) + course.rating
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.course);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI video summary
// @route   POST /api/ai/summary
// @access  Private
export const generateVideoSummary = async (req, res) => {
  try {
    const { videoTitle, videoDescription, courseTitle } = req.body;

    // Simple summary generation (can be enhanced with OpenAI API)
    const summary = {
      shortSummary: `${videoTitle} covers essential concepts in ${courseTitle}. This lesson provides practical insights and hands-on examples.`,
      learningOutcomes: [
        'Understand key concepts',
        'Apply knowledge practically',
        'Complete exercises'
      ],
      notes: `Key points from ${videoTitle}:\n- Important concepts explained\n- Practical examples demonstrated\n- Best practices shared`
    };

    // In production, integrate with OpenAI API:
    // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: `Generate summary for: ${videoTitle}` }]
    // });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate AI certificate
// @route   POST /api/ai/certificate
// @access  Private
export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if course is completed
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
      approvalStatus: 'approved'
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.progress.completionPercentage < 100) {
      return res.status(400).json({ message: 'Course not completed yet' });
    }

    const certificate = {
      studentName: req.user.name,
      courseName: enrollment.course.title,
      completionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      certificateId: `CERT-${Date.now()}-${userId.toString().slice(-6)}`
    };

    // In production, generate PDF using libraries like pdfkit or puppeteer
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI-powered search
// @route   POST /api/ai/search
// @access  Private
export const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    // Enhanced search with semantic matching
    const courses = await Course.find({
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    // In production, use vector embeddings for semantic search
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

