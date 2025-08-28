import express from 'express';
import { getMyNotifications, markAllAsRead, clearAllNotifications, getNotificationsByStudentId } from '../controllers/notificationController';
import { studentSessionAuthMiddleware, adminSessionAuthMiddleware } from '../middleware/sessionAuthMiddleware';

const router = express.Router();

// Route to get a user's notifications
router.get('/', studentSessionAuthMiddleware, getMyNotifications);

// Route to get notifications by student ID (admin only)
router.get('/student/:studentId', adminSessionAuthMiddleware, getNotificationsByStudentId);

// Route to mark all notifications as read
router.patch('/read', studentSessionAuthMiddleware, markAllAsRead);
router.delete('/', studentSessionAuthMiddleware, clearAllNotifications);

export default router;