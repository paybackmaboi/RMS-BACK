import express from 'express';
import {
    loginAndCreateSession,
    logoutAndDestroySession,
    getCurrentSession,
    refreshSession
} from '../controllers/sessionController';
import { sessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Login and create session
router.post('/login', loginAndCreateSession);

// Logout and destroy session
router.post('/logout', sessionAuthMiddleware, logoutAndDestroySession);

// Get current session info
router.get('/me', sessionAuthMiddleware, getCurrentSession);

// Refresh session (no auth required - just need valid session token)
router.post('/refresh', refreshSession);

export default router;
