import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { Request as RequestModel, User } from '../database';
import path from 'path';

// This is necessary for extending the Express Request type with a 'user' property.
// The empty export at the end of the file ensures this is treated as a module.
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: 'student' | 'admin';
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

        // Store only the filename in the database, not the full system path.
        const filePath = req.file ? req.file.filename : undefined;

        const newRequest = await RequestModel.create({
            studentId,
            documentType,
            purpose,
            status: 'pending',
            filePath,
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
            include: [{ model: User, attributes: ['idNumber'] }],
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

        // Ensure the new status is one of the allowed values.
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
        res.json(request);
    } catch (error) {
        next(error);
    }
};


export const getRequestDocument = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const request = await RequestModel.findByPk(id);

        if (!request || !request.filePath) {
            res.status(404).json({ message: 'Document not found for this request.' });
            return;
        }

        // Construct the absolute path to the file at runtime.
        const absoluteFilePath = path.resolve(process.cwd(), 'uploads', request.filePath);

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

// This empty export ensures the file is treated as a module.
export {};
