import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson
} from '../controllers/course.controller.js';
import { protect, admin, optionalProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (optional auth to check if admin)
router.get('/', optionalProtect, getAllCourses);
router.get('/:id', getCourseById);

// Admin only routes
router.post('/', protect, admin, createCourse);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);
router.post('/:id/lessons', protect, admin, addLesson);
router.put('/:id/lessons/:lessonId', protect, admin, updateLesson);
router.delete('/:id/lessons/:lessonId', protect, admin, deleteLesson);

export default router;

