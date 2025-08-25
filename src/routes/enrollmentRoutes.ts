import express from 'express';
import { getStudentEnrollmentStatus, getStudentEnrollmentHistory } from '../controllers/enrollmentController';

const router = express.Router();

// Get student enrollment status (current semester)
router.get('/enrollment-status/:userId', getStudentEnrollmentStatus);

// Get student enrollment history (all semesters)
router.get('/enrollment-history/:userId', getStudentEnrollmentHistory);

export default router; 