import User from '../models/User.model.js';
import Enrollment from '../models/Enrollment.model.js';
import Course from '../models/Course.model.js';

// @desc    Get dashboard statistics
// @route   GET /api/users/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({ isActive: true });
    
    const enrollments = await Enrollment.find({ paymentStatus: 'paid' });
    const totalRevenue = enrollments.reduce((sum, e) => sum + e.amount, 0);
    
    const approvedEnrollments = await Enrollment.countDocuments({ approvalStatus: 'approved' });
    const pendingEnrollments = await Enrollment.countDocuments({ approvalStatus: 'pending' });

    // Most selling course
    const courseSales = await Enrollment.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$course', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let mostSellingCourse = null;
    if (courseSales.length > 0) {
      mostSellingCourse = await Course.findById(courseSales[0]._id).select('title thumbnail');
      mostSellingCourse = {
        ...mostSellingCourse.toObject(),
        sales: courseSales[0].count,
        revenue: courseSales[0].revenue
      };
    }

    // Monthly sales chart data
    const monthlySales = await Enrollment.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Course views
    const courseViews = await Course.find({ isActive: true })
      .select('title thumbnail totalViews')
      .sort({ totalViews: -1 })
      .limit(5);

    res.json({
      totalStudents,
      totalCourses,
      totalRevenue,
      approvedEnrollments,
      pendingEnrollments,
      mostSellingCourse,
      monthlySales,
      courseViews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public statistics
// @route   GET /api/users/stats
// @access  Public
export const getPublicStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments({ isActive: true });
    
    // Count total video lessons from all active courses
    const courses = await Course.find({ isActive: true }).select('lessons category');
    const totalVideoLessons = courses.reduce((total, course) => {
      return total + (course.lessons?.length || 0);
    }, 0);

    // Count videos per category (Physics, Chemistry, Mathematics)
    const categoryStats = {
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0
    };

    courses.forEach(course => {
      const category = course.category;
      const lessonCount = course.lessons?.length || 0;
      
      if (category === 'Physics' || category?.toLowerCase().includes('physics')) {
        categoryStats.Physics += lessonCount;
      } else if (category === 'Chemistry' || category?.toLowerCase().includes('chemistry')) {
        categoryStats.Chemistry += lessonCount;
      } else if (category === 'Mathematics' || category?.toLowerCase().includes('mathematics') || category?.toLowerCase().includes('math')) {
        categoryStats.Mathematics += lessonCount;
      }
    });

    res.json({
      totalStudents,
      totalCourses,
      totalVideoLessons,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

