import express from 'express';
import {
  getAvailableExams,
  startExam,
  submitExam,
  releaseResults,
  getMyResults,
  getExamResults
} from '../controllers/examController.js';
import { protect, studentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes - protected and student only
router.get('/my-results', protect, studentOnly, getMyResults);
router.post('/start', protect, studentOnly, startExam);
router.post('/submit', protect, studentOnly, submitExam);

// Institute routes
router.get('/results/:examId', protect, getExamResults);
router.post('/release/:examId', protect, releaseResults);

export default router; 