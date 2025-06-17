import { Request, Response, NextFunction } from 'express';
import { Request as RequestModel, User } from '../database';
import path from 'path';

export const createRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { documentType, purpose } = req.body;
        const studentId = req.user?.id;
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized: Student ID not found.' });
            return;
        }
        const filePath = req.file ? req.file.path : undefined;
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

export const getRequestDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const request = await RequestModel.findByPk(id);
        if (!request || !(request as any).filePath) {
            res.status(404).json({ message: 'Document not found.' });
            return;
        }
        const filePath = path.resolve((request as any).filePath);
        res.download(filePath, (err) => {
            if (err && !res.headersSent) {
                next(err);
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getStudentRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const studentId = req.user?.id;
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const requests = await RequestModel.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']],
        });
        res.json(requests);
    } catch (error) {
        next(error);
    }
};

export const getAllRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const updateRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
       if (!['pending', 'approved', 'rejected', 'ready for pick-up'].includes(status)) {
            res.status(400).json({ message: 'Invalid status.' });
            return;
        }
        const request = await RequestModel.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }
        (request as any).status = status;
        (request as any).notes = notes || null;
        await request.save();
        res.json(request);
    } catch (error) {
        next(error);
    }
};