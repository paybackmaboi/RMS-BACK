import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request as RequestModel, User, Notification as NotificationModel } from '../database';
import path from 'path';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'student' | 'admin'| 'accounting';
            };
        }
    }
}

export const createRequest = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { documentType, purpose } = req.body;
        const studentId = req.user?.id;

        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized: Student ID not found.' });
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
                // THIS IS THE FIX: Add the name fields to the attributes list
                attributes: ['idNumber', 'firstName', 'lastName', 'middleName', 'course'] 
            }],
            order: [['createdAt', 'DESC']],
        });
        res.json(requests);
    } catch (error) {
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


export const getRequestDocument = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id, docIndex } = req.params;
        const request = await RequestModel.findByPk(id);

        if (!request || !request.filePath || !Array.isArray(request.filePath) || request.filePath.length === 0) {
            res.status(404).json({ message: 'Document not found for this request.' });
            return;
        }
        
        const index = parseInt(docIndex, 10);
        if (isNaN(index) || index < 0 || index >= request.filePath.length) {
            // FIX: Removed the 'return' from res.status().json() to match the Promise<void> return type.
            res.status(400).json({ message: 'Invalid document index.' });
            return;
        }
        
        const singleFilePath = request.filePath[index];

        const absoluteFilePath = path.resolve(process.cwd(), 'uploads', singleFilePath);

        res.download(absoluteFilePath, (err) => {
            if (err) {
                console.error("File download error:", err);
                if (!res.headersSent) {
                    res.status(404).json({ message: "File not found on server." });
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


export {};