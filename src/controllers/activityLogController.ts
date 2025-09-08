import { Request, Response, NextFunction } from 'express';
import { ActivityLogModel, UserModel } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
        idNumber?: string;
        firstName?: string;
        lastName?: string;
    };
}

/**
 * Log user activity
 */
export const logActivity = async (
    userId: number, 
    action: string, 
    description?: string,
    req?: Request,
    metadata?: any
): Promise<void> => {
    try {
        const ipAddress = req?.ip || req?.socket?.remoteAddress || 'unknown';
        const userAgent = req?.get('User-Agent') || 'unknown';

        await ActivityLogModel.create({
            userId,
            action,
            description,
            ipAddress,
            userAgent,
            metadata: metadata ? JSON.stringify(metadata) : undefined
        });
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't throw error to prevent disrupting main functionality
    }
};

/**
 * Get activity logs for a specific user
 */
export const getUserActivityLogs = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const { limit = 50, offset = 0, action } = req.query;

        let whereClause: any = { userId: parseInt(userId) };
        
        if (action) {
            whereClause.action = action;
        }

        const logs = await ActivityLogModel.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'idNumber', 'role']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
        });

        res.json({
            success: true,
            data: {
                logs: logs.rows,
                total: logs.count,
                hasMore: (parseInt(offset as string) + parseInt(limit as string)) < logs.count
            }
        });
    } catch (error) {
        console.error('Error fetching user activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity logs'
        });
    }
};

/**
 * Get all activity logs (admin only)
 */
export const getAllActivityLogs = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { limit = 100, offset = 0, action, userId } = req.query;

        let whereClause: any = {};
        
        if (action) {
            whereClause.action = action;
        }
        
        if (userId) {
            whereClause.userId = parseInt(userId as string);
        }

        const logs = await ActivityLogModel.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'idNumber', 'role']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
        });

        res.json({
            success: true,
            data: {
                logs: logs.rows,
                total: logs.count,
                hasMore: (parseInt(offset as string) + parseInt(limit as string)) < logs.count
            }
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity logs'
        });
    }
};

/**
 * Get activity summary for a user
 */
export const getUserActivitySummary = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;

        // Get last login
        const lastLogin = await ActivityLogModel.findOne({
            where: { 
                userId: parseInt(userId),
                action: 'login'
            },
            order: [['createdAt', 'DESC']]
        });

        // Get login count in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentLoginCount = await ActivityLogModel.count({
            where: {
                userId: parseInt(userId),
                action: 'login',
                createdAt: {
                    [require('sequelize').Op.gte]: thirtyDaysAgo
                }
            }
        });

        // Get most common actions
        const actionStats = await ActivityLogModel.findAll({
            where: { userId: parseInt(userId) },
            attributes: [
                'action',
                [require('sequelize').fn('COUNT', require('sequelize').col('action')), 'count']
            ],
            group: ['action'],
            order: [[require('sequelize').fn('COUNT', require('sequelize').col('action')), 'DESC']],
            limit: 5,
            raw: true
        });

        res.json({
            success: true,
            data: {
                lastLogin: lastLogin ? {
                    timestamp: lastLogin.createdAt,
                    ipAddress: lastLogin.ipAddress,
                    userAgent: lastLogin.userAgent
                } : null,
                recentLoginCount,
                actionStats
            }
        });
    } catch (error) {
        console.error('Error fetching activity summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity summary'
        });
    }
};
