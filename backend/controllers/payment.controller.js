import axios from 'axios';
import Stripe from 'stripe';
import Enrollment from '../models/Enrollment.model.js';
import Course from '../models/Course.model.js';
import User from '../models/User.model.js';
import { sendWhatsAppNotification } from '../utils/whatsapp.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// @desc    Initiate eSewa payment
// @route   POST /api/payments/esewa/initiate
// @access  Private/Student
export const initiateEsewaPayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // eSewa payment initiation logic
    const paymentData = {
      amount: course.price,
      tax_amount: 0,
      total_amount: course.price,
      transaction_uuid: `ESEWA-${Date.now()}`,
      product_code: 'EPAYTEST',
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.FRONTEND_URL}/payment/success?method=esewa`,
      failure_url: `${process.env.FRONTEND_URL}/payment/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: '' // Generate signature with secret key
    };

    res.json({ paymentData, courseId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify eSewa payment
// @route   POST /api/payments/esewa/verify
// @access  Private/Student
export const verifyEsewaPayment = async (req, res) => {
  try {
    const { courseId, transactionId, amount } = req.body;

    // Get course and student details
    const course = await Course.findById(courseId);
    const student = await User.findById(req.user._id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify payment with eSewa API
    // Then create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      paymentStatus: 'paid',
      approvalStatus: 'pending',
      paymentMethod: 'esewa',
      transactionId,
      amount
    });

    // Update course enrollment count
    course.totalEnrollments += 1;
    await course.save();

    // Send WhatsApp notification to admin
    await sendWhatsAppNotification({
      studentName: student.name,
      courseName: course.title,
      amount: enrollment.amount,
      transactionId: enrollment.transactionId || 'N/A',
      studentPhone: student.phone
    });

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate Khalti payment
// @route   POST /api/payments/khalti/initiate
// @access  Private/Student
export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Khalti payment initiation
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/initiate/',
      {
        return_url: `${process.env.FRONTEND_URL}/payment/success?method=khalti`,
        website_url: process.env.FRONTEND_URL,
        amount: course.price * 100, // Khalti uses paisa
        purchase_order_id: `KHALTI-${Date.now()}`,
        purchase_order_name: course.title,
        customer_info: {
          name: req.user.name,
          email: req.user.email
        }
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`
        }
      }
    );

    res.json({ paymentData: response.data, courseId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Khalti payment
// @route   POST /api/payments/khalti/verify
// @access  Private/Student
export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { courseId, pidx, amount } = req.body;

    // Verify with Khalti
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`
        }
      }
    );

    if (response.data.status === 'Completed') {
      // Get course and student details
      const course = await Course.findById(courseId);
      const student = await User.findById(req.user._id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId,
        paymentStatus: 'paid',
        approvalStatus: 'pending',
        paymentMethod: 'khalti',
        transactionId: pidx,
        amount: amount / 100
      });

      // Update course enrollment count
      course.totalEnrollments += 1;
      await course.save();

      // Send WhatsApp notification to admin
      await sendWhatsAppNotification({
        studentName: student.name,
        courseName: course.title,
        amount: enrollment.amount,
        transactionId: enrollment.transactionId || 'N/A',
        studentPhone: student.phone
      });

      res.json({ success: true, enrollment });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create
// @access  Private/Student
export const createStripePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        courseId: courseId.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret, courseId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Stripe payment
// @route   POST /api/payments/stripe/verify
// @access  Private/Student
export const verifyStripePayment = async (req, res) => {
  try {
    const { courseId, paymentIntentId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Get course and student details
      const course = await Course.findById(courseId);
      const student = await User.findById(req.user._id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId,
        paymentStatus: 'paid',
        approvalStatus: 'pending',
        paymentMethod: 'stripe',
        transactionId: paymentIntentId,
        amount: amount / 100
      });

      // Update course enrollment count
      course.totalEnrollments += 1;
      await course.save();

      // Send WhatsApp notification to admin
      await sendWhatsAppNotification({
        studentName: student.name,
        courseName: course.title,
        amount: enrollment.amount,
        transactionId: enrollment.transactionId || 'N/A',
        studentPhone: student.phone
      });

      res.json({ success: true, enrollment });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

