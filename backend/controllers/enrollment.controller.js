import Enrollment from '../models/Enrollment.model.js';
import Course from '../models/Course.model.js';
import User from '../models/User.model.js';
import { 
  sendWhatsAppNotification, 
  sendApprovalNotification, 
  sendRejectionNotification,
  sendAdminActionNotification 
} from '../utils/whatsapp.js';

// @desc    Create enrollment (after payment)
// @route   POST /api/enrollments
// @access  Private/Student
export const createEnrollment = async (req, res) => {
  try {
    const { courseId, paymentMethod, transactionId, amount, paymentScreenshot, studentName, contactNumber } = req.body;

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if already enrolled (approved or pending)
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      approvalStatus: { $in: ['approved', 'pending'] }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Check if there's a rejected enrollment - if so, update it instead of creating new
    const rejectedEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      approvalStatus: 'rejected'
    });

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let enrollment;

    if (rejectedEnrollment) {
      // Update rejected enrollment to pending with new payment info
      rejectedEnrollment.paymentStatus = 'paid';
      rejectedEnrollment.approvalStatus = 'pending';
      rejectedEnrollment.paymentMethod = paymentMethod;
      rejectedEnrollment.transactionId = transactionId;
      rejectedEnrollment.amount = amount || course.price;
      rejectedEnrollment.paymentScreenshot = paymentScreenshot || rejectedEnrollment.paymentScreenshot;
      rejectedEnrollment.studentName = studentName || rejectedEnrollment.studentName;
      rejectedEnrollment.contactNumber = contactNumber || rejectedEnrollment.contactNumber;
      rejectedEnrollment.createdAt = new Date(); // Update timestamp
      enrollment = await rejectedEnrollment.save();
    } else {
      // Get student info for default values
      const studentUser = await User.findById(req.user._id);
      
      // Create new enrollment
      enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId,
        paymentStatus: 'paid',
        approvalStatus: 'pending',
        paymentMethod,
        transactionId,
        amount: amount || course.price,
        paymentScreenshot,
        studentName: studentName || studentUser?.name || '',
        contactNumber: contactNumber || studentUser?.phone || ''
      });

      // Update course enrollment count only for new enrollments
      course.totalEnrollments += 1;
      await course.save();
    }

    // Send WhatsApp notification to admin
    const studentUser = await User.findById(req.user._id);
    await sendWhatsAppNotification({
      studentName: enrollment.studentName || studentUser?.name || 'Student',
      courseName: course.title,
      amount: enrollment.amount,
      transactionId: enrollment.transactionId || 'N/A',
      studentPhone: enrollment.contactNumber || studentUser?.phone || ''
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
export const getMyEnrollments = async (req, res) => {
  try {
    // Exclude rejected enrollments - only show approved and pending
    const enrollments = await Enrollment.find({ 
      student: req.user._id,
      approvalStatus: { $ne: 'rejected' } // Exclude rejected enrollments
    })
      .populate('course')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/enrollments/all
// @access  Private/Admin
export const getAllEnrollments = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.approvalStatus = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email phone')
      .populate('course', 'title price thumbnail')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve enrollment
// @route   PUT /api/enrollments/approve/:id
// @access  Private/Admin
export const approveEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course', 'title')
      .populate('student', 'name phone');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.approvalStatus = 'approved';
    enrollment.approvedAt = new Date();
    await enrollment.save();

    // Add course to student's enrolled courses
    const student = await User.findById(enrollment.student);
    if (student && !student.enrolledCourses.includes(enrollment.course)) {
      student.enrolledCourses.push(enrollment.course);
      await student.save();
    }

    // Send WhatsApp notification to student
    if (enrollment.student && enrollment.student.phone) {
      await sendApprovalNotification({
        studentName: enrollment.student.name,
        studentPhone: enrollment.student.phone,
        courseName: enrollment.course.title
      });
    }

    // Send notification to admin (for logging)
    const admin = await User.findById(req.user._id);
    if (admin && admin.phone) {
      await sendAdminActionNotification({
        action: 'approved',
        studentName: enrollment.student.name,
        courseName: enrollment.course.title,
        adminPhone: admin.phone
      });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject enrollment
// @route   PUT /api/enrollments/reject/:id
// @access  Private/Admin
export const rejectEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course', 'title')
      .populate('student', 'name phone');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.approvalStatus = 'rejected';
    await enrollment.save();

    // Send WhatsApp notification to student
    if (enrollment.student && enrollment.student.phone) {
      await sendRejectionNotification({
        studentName: enrollment.student.name,
        studentPhone: enrollment.student.phone,
        courseName: enrollment.course.title
      });
    }

    // Send notification to admin (for logging)
    const admin = await User.findById(req.user._id);
    if (admin && admin.phone) {
      await sendAdminActionNotification({
        action: 'rejected',
        studentName: enrollment.student.name,
        courseName: enrollment.course.title,
        adminPhone: admin.phone
      });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update learning progress
// @route   PUT /api/enrollments/progress/:id
// @access  Private/Student
export const updateProgress = async (req, res) => {
  try {
    const { lessonId, completed } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if student owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (completed) {
      if (!enrollment.progress.completedLessons.includes(lessonId)) {
        enrollment.progress.completedLessons.push(lessonId);
      }
    } else {
      enrollment.progress.completedLessons = enrollment.progress.completedLessons.filter(
        id => id.toString() !== lessonId
      );
    }

    // Update last watched lesson
    enrollment.progress.lastWatchedLesson = lessonId;

    // Calculate completion percentage
    const course = await Course.findById(enrollment.course);
    const totalLessons = course.lessons.length;
    enrollment.progress.completionPercentage = totalLessons > 0
      ? Math.round((enrollment.progress.completedLessons.length / totalLessons) * 100)
      : 0;

    await enrollment.save();

    // Update course views
    course.totalViews += 1;
    await course.save();

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const courseId = enrollment.course;

    // Remove course from student's enrolled courses if approved
    if (enrollment.approvalStatus === 'approved') {
      const student = await User.findById(enrollment.student);
      if (student) {
        student.enrolledCourses = student.enrolledCourses.filter(
          courseId => courseId.toString() !== enrollment.course.toString()
        );
        await student.save();
      }
    }

    // Decrease course enrollment count
    const course = await Course.findById(courseId);
    if (course && course.totalEnrollments > 0) {
      course.totalEnrollments -= 1;
      await course.save();
    }

    // Delete the enrollment
    await Enrollment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

