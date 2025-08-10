import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request as RequestModel, User, Student, Course, Notification as NotificationModel } from '../database';
import path from 'path';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'student' | 'admin' | 'accounting';
            };
        }
    }
}

export const createRequest = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const documentType = req.body.documentType;
        const purpose = req.body.purpose;
        const studentId = req.user?.id;

        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized: Student ID not found.' });
            return;
        }

        if (!documentType || !purpose) {
            res.status(400).json({ message: 'Document type and purpose are required.' });
            return;
        }

        const files = req.files as Express.Multer.File[];
        const filePaths = files ? files.map(file => file.filename) : undefined;

        const newRequest = await RequestModel.create({
            studentId,
            documentType,
            purpose,
            status: 'pending',
            filePath: filePaths,
        });

        await NotificationModel.create({
            userId: studentId,
            requestId: newRequest.id,
            message: `You have submitted your request for ${documentType}.`,
            isRead: false,
        });

        res.status(201).json(newRequest);
    } catch (error) {
        next(error);
    }
};

export const getStudentRequests = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const studentId = req.user?.id;
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const requests = await RequestModel.findAll({ where: { studentId }, order: [['createdAt', 'DESC']] });
        res.json(requests);
    } catch (error) {
        next(error);
    }
};

export const getAllRequests = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const requests = await RequestModel.findAll({
            include: [{
                model: User,
                as: 'student',
                attributes: ['idNumber', 'firstName', 'lastName', 'middleName'],
                include: [{
                    model: Student,
                    as: 'studentDetails',
                    attributes: ['courseId'], 
                    include: [{
                        model: Course,
                        as: 'course',
                        attributes: ['name'] 
                    }]
                }]
            }],
            order: [['createdAt', 'DESC']],
        });
        res.json(requests);
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
                model: User, 
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