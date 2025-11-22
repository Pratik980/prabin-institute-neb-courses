import express from 'express';
import {
  createEnrollment,
  getMyEnrollments,
  getAllEnrollments,
  approveEnrollment,
  rejectEnrollment,
  updateProgress,
  deleteEnrollment
} from '../controllers/enrollment.controller.js';
import { protect, admin, student } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes
router.post('/', protect, student, createEnrollment);
router.get('/my-courses', protect, student, getMyEnrollments);
router.put('/progress/:id', protect, student, updateProgress);

// Admin routes
router.get('/all', protect, admin, getAllEnrollments);
router.put('/approve/:id', protect, admin, approveEnrollment);
router.put('/reject/:id', protect, admin, rejectEnrollment);
router.delete('/:id', protect, admin, deleteEnrollment);

export default router;

