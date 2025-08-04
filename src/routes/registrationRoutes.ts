import express from 'express';
import { registerStudent } from '../controllers/registrationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// This route will handle the student registration form submission
router.post('/student', authMiddleware, registerStudent);

export default router;