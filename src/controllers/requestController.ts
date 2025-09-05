import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { UserModel } from '../database';
import path from 'path';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'student' | 'admin' | 'accounting';
                idNumber?: string;
                firstName?: string;
                lastName?: string;
            };
        }
    }
}

export const createRequest = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Creating request - User info:', req.user);
        console.log('🔍 Request body:', req.body);
        console.log('🔍 Request files:', req.files);
        
        // Temporarily disabled since RequestModel is not available
        res.status(503).json({ message: 'Request functionality temporarily unavailable. Please try again later.' });
        return;
    } catch (error) {
        next(error);
    }
};

export const getStudentRequests = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Getting student requests - User info:', req.user);
        
        // Temporarily disabled since RequestModel is not available
        res.status(503).json({ message: 'Request functionality temporarily unavailable. Please try again later.' });
        return;
        console.log('🔍 Found requests:', requests.length);
        res.json(requests);
    } catch (error) {
        console.error('❌ Error in getStudentRequests:', error);
        next(error);
    }
};

export const getAllRequests = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Temporarily disabled since RequestModel is not available
        res.status(503).json({ message: 'Request functionality temporarily unavailable. Please try again later.' });
        return;
    } catch (error) {
        console.error('Error fetching requests:', error);
        next(error);
    }
};

export const updateRequestStatus = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!status || !['pending', 'approved', 'rejected', 'ready for pick-up'].includes(status)) {
            res.status(400).json({ message: 'Invalid status provided.' });
            return;
        }

        const request = await RequestModel.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        request.status = status;
        if (notes !== undefined) {
            request.notes = notes;
        }       
        await request.save();

        await NotificationModel.create({
            userId: request.studentId,
            requestId: request.id,
            message: `Your request for ${request.documentType} has been ${status.replace(/-/g, ' ')}.`,
            isRead: false,
        });
        res.json(request);
    } catch (error) {
        next(error);
    }
};

export const getRequestsByStudentId = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;
        const requests = await RequestModel.findAll({
            where: { studentId: parseInt(studentId, 10) },
            order: [['createdAt', 'DESC']]
        });
        res.json(requests);
    } catch (error) {
        next(error);
    }
};


export const getRequestDocument = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id, docIndex } = req.params;
        const request = await RequestModel.findByPk(id);
        
        if (!request || !request.filePath) {
            res.status(404).json({ message: 'Document not found.' });
            return;
        }

        const filePaths = Array.isArray(request.filePath) ? request.filePath : [request.filePath];
        const docIndexNum = parseInt(docIndex, 10);

        if (docIndexNum < 0 || docIndexNum >= filePaths.length) {
            res.status(404).json({ message: 'Document index out of range.' });
            return;
        }

        const fileName = filePaths[docIndexNum];
        const filePath = path.join(process.cwd(), 'uploads', fileName);
        
        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found on server.' });
            return;
        }

        // Set appropriate headers for file download/viewing
        const ext = path.extname(fileName).toLowerCase();
        if (ext === '.pdf') {
            res.setHeader('Content-Type', 'application/pdf');
        } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            res.setHeader('Content-Type', `image/${ext.slice(1)}`);
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving document:', error);
        res.status(500).json({ message: 'Error serving document.' });
    }
};

export const getRequestById = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        const request = await RequestModel.findByPk(id, {
            include: [{ 
                model: UserModel, 
                as: 'student',
                attributes: ['idNumber', 'firstName', 'lastName', 'middleName'] 
            }]
        });

        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        // Students can only view their own requests
        if (userRole === 'student' && request.studentId !== userId) {
            res.status(403).json({ message: 'Access denied.' });
            return;
        }

        res.json(request);
    } catch (error) {
        next(error);
    }
};

export const deleteRequest = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await RequestModel.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        await request.destroy();
        res.json({ message: 'Request deleted successfully.' });
    } catch (error) {
        next(error);
    }
};


export {};