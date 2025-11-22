import express from 'express';
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  createStripePayment,
  verifyStripePayment
} from '../controllers/payment.controller.js';
import { protect, student } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/esewa/initiate', protect, student, initiateEsewaPayment);
router.post('/esewa/verify', protect, student, verifyEsewaPayment);
router.post('/khalti/initiate', protect, student, initiateKhaltiPayment);
router.post('/khalti/verify', protect, student, verifyKhaltiPayment);
router.post('/stripe/create', protect, student, createStripePayment);
router.post('/stripe/verify', protect, student, verifyStripePayment);

export default router;

