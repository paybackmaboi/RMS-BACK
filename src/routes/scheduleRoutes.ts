import express from 'express';
import { getStudentSchedule, getAllSchedules, getScheduleEnrolledStudents, checkDatabaseStructure } from '../controllers/scheduleController';
import { adminSessionAuthMiddleware, studentSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Get student's personal schedule (requires student authentication)
router.get('/student/:userId', studentSessionAuthMiddleware, getStudentSchedule);

// Get all schedules for admin view (requires admin authentication)
router.get('/admin/all', adminSessionAuthMiddleware, getAllSchedules);

// Get enrolled students for a specific schedule (requires admin authentication)
router.get('/admin/enrolled-students/:scheduleId', adminSessionAuthMiddleware, getScheduleEnrolledStudents);

// Diagnostic route to check database structure (requires admin authentication)
router.get('/admin/diagnostic', adminSessionAuthMiddleware, checkDatabaseStructure);

export default router; 