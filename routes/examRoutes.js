import express from 'express';
import { protect, studentOnly } from '../middleware/authMiddleware.js';
import {
  getAvailableExams,
  startExam,
  submitExam,
  releaseResults,
  getMyResults,
  getExamResults
} from '../controllers/examController.js';

const router = express.Router();

// Apply protect middleware first, then studentOnly
router.use(protect); // This will protect all routes below

// Student-only routes
router.get('/my-results', studentOnly, getMyResults);
router.post('/start', studentOnly, startExam);
router.post('/submit', studentOnly, submitExam);

// Institute routes
router.get('/results/:examId', getExamResults);
router.post('/release/:examId', releaseResults);

export default router; 