import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Notification as NotificationModel } from '../database';

// Get all notifications for the logged-in user
export const getMyNotifications = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const notifications = await NotificationModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20 // Limit to the last 20 notifications for performance
        });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read for the logged-in user
export const markAllAsRead = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await NotificationModel.update({ isRead: true }, {
            where: { userId, isRead: false }
        });
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        next(error);
    }
};