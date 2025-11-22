import express from 'express';
import { getDashboardStats, getAllUsers, deleteUser, getPublicStats } from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/stats', getPublicStats);

// Protected routes
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/all', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;

