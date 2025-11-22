import express from 'express';
import {
  getCourseRecommendations,
  generateVideoSummary,
  generateCertificate,
  aiSearch
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/recommendations', protect, getCourseRecommendations);
router.post('/summary', protect, generateVideoSummary);
router.post('/certificate', protect, generateCertificate);
router.post('/search', protect, aiSearch);

export default router;

