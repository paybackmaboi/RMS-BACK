import express from 'express';
import {
    createAndEnrollStudent,
    getRegistrationStatus,
    getAllStudents,
    getStudentDetails,
    updateStudent,
    deleteStudent,
    registerStudent,
    debugStudentRegistration,
    completeStudentRegistration,
    getCurrentStudentProfile,
    getStudentRegistrationData,
    getStudentEnrolledSubjects,
    searchUserByIdNumber,
    updateStudentRegistration
} from '../controllers/studentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { studentSessionAuthMiddleware, adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Student registration (no auth required - this creates the account)
router.post('/register', registerStudent);

// Debug endpoint
router.get('/debug', authMiddleware, debugStudentRegistration);

// Admin routes for student management
router.get('/', adminSessionAuthMiddleware, getAllStudents);
router.get('/:id', adminSessionAuthMiddleware, getStudentDetails);
router.put('/:id', adminSessionAuthMiddleware, updateStudent);
router.delete('/:id', adminSessionAuthMiddleware, deleteStudent);

// Create and enroll student (admin only)
router.post('/create-and-enroll', adminSessionAuthMiddleware, createAndEnrollStudent);

// Complete student registration with permanent data (requires session authentication)
router.post('/complete-registration', studentSessionAuthMiddleware, completeStudentRegistration);

// Get current student profile (requires session authentication)
router.get('/profile', studentSessionAuthMiddleware, getCurrentStudentProfile);

// Get student registration data by user ID (admin only)
router.get('/registration/:userId', getStudentRegistrationData);

// Get student enrolled subjects by year level and semester
router.get('/enrolled-subjects/:userId', getStudentEnrolledSubjects);

// Search user by ID number (admin only)
router.get('/search/:idNumber', adminSessionAuthMiddleware, searchUserByIdNumber);

// Update student registration data (admin only)
router.put('/registration/:userId', adminSessionAuthMiddleware, updateStudentRegistration);

export default router;
