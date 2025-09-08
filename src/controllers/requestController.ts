import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { UserModel, RequestModel, NotificationModel, PaymentModel } from '../database';
import path from 'path';

/**
 * Global type declaration for Express Request with user information
 */
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

/**
 * Create a new document request
 * @route POST /api/requests
 * @access Student only
 */
export const createRequest = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Creating request - User info:', req.user);
        console.log('🔍 Request body:', req.body);
        console.log('🔍 Request files:', req.files);
        
        const { documentType, purpose, studentId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (!documentType || !purpose) {
            res.status(400).json({ message: 'Document type and purpose are required' });
            return;
        }

        // Use studentId from request body if provided (for admin/registrar creating requests for students)
        // Otherwise use the authenticated user's ID (for students creating their own requests)
        const targetStudentId = studentId || userId;

        // Create the request
        const newRequest = await RequestModel.create({
            studentId: targetStudentId,
            documentType,
            purpose,
            status: 'pending',
            notes: '',
            filePath: req.files ? (req.files as Express.Multer.File[]).map(file => file.filename) : []
        });

        // Create notification for admin
        await NotificationModel.create({
            userId: userId,
            requestId: newRequest.id,
            message: `New ${documentType} request submitted`,
            isRead: false,
            type: 'request'
        });

        console.log('✅ Request created successfully:', newRequest.id);
        res.status(201).json({
            message: 'Request submitted successfully',
            id: newRequest.id,
            request: newRequest
        });
    } catch (error) {
        console.error('❌ Error creating request:', error);
        next(error);
    }
};

export const getStudentRequests = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Getting student requests - User info:', req.user);
        
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const requests = await RequestModel.findAll({
            where: { studentId: userId },
            order: [['createdAt', 'DESC']]
        });
        
        console.log('🔍 Found requests:', requests.length);
        res.json(requests);
    } catch (error) {
        console.error('❌ Error in getStudentRequests:', error);
        next(error);
    }
};

export const getAllRequests = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Getting all requests - User info:', req.user);
        
        const requests = await RequestModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        console.log('🔍 Found requests:', requests.length);

        // Get student info for each request
        const requestsWithStudents = await Promise.all(
            requests.map(async (request) => {
                const student = await UserModel.findByPk(request.studentId);
                return {
                    ...request.toJSON(),
                    student: student ? {
                        id: student.id,
                        firstName: student.firstName,
                        lastName: student.lastName,
                        idNumber: student.idNumber
                    } : null
                };
            })
        );

        console.log('✅ Requests with student data:', requestsWithStudents.length);
        res.json(requestsWithStudents);
    } catch (error) {
        console.error('❌ Error fetching requests:', error);
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

/**
 * Registrar requests document from accounting
 * @route POST /api/requests/:id/request-document
 * @access Admin only
 */
export const requestDocumentFromAccounting = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const registrarId = req.user?.idNumber || 'Unknown';

        const request = await RequestModel.findByPk(id);

        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        // Get student info
        const student = await UserModel.findByPk(request.studentId);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // Update request status to payment_required
        request.status = 'payment_required';
        request.amount = amount;
        request.requestedBy = registrarId;
        request.requestedAt = new Date();
        await request.save();

        // Create notification for accounting
        await NotificationModel.create({
            userId: 2, // Assuming accounting user ID is 2
            type: 'document_request',
            message: `New document request from Registrar: ${request.documentType} for ${student.firstName} ${student.lastName} (${student.idNumber}). Amount: ₱${amount}`,
            requestId: request.id,
            isRead: false
        });

        // Create notification for student
        await NotificationModel.create({
            userId: request.studentId,
            type: 'payment_required',
            message: `Your ${request.documentType} request requires payment of ₱${amount}. Please proceed to the accounting office.`,
            requestId: request.id,
            isRead: false
        });

        res.json({
            success: true,
            message: 'Document request sent to accounting successfully',
            data: request
        });
    } catch (error) {
        console.error('Error requesting document from accounting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to request document from accounting'
        });
    }
};

/**
 * Registrar approves request after payment confirmation
 * @route POST /api/requests/:id/approve
 * @access Admin only
 */
export const approveRequest = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const registrarId = req.user?.idNumber || 'Unknown';

        const request = await RequestModel.findByPk(id, {
            include: [
                {
                    model: UserModel,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName', 'idNumber']
                },
                {
                    model: PaymentModel,
                    as: 'payment'
                }
            ]
        });

        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        if (request.status !== 'payment_approved') {
            res.status(400).json({ 
                message: 'Request must be payment approved before final approval.' 
            });
            return;
        }

        // Update request status
        request.status = 'approved';
        request.approvedBy = registrarId;
        request.approvedAt = new Date();
        if (notes) {
            request.notes = notes;
        }
        await request.save();

        // Create notification for student
        await NotificationModel.create({
            userId: request.studentId,
            type: 'request_approved',
            message: `Your ${request.documentType} request has been approved and is ready for printing.`,
            requestId: request.id,
            isRead: false
        });

        res.json({
            success: true,
            message: 'Request approved successfully',
            data: request
        });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve request'
        });
    }
};

/**
 * Mark request as printed
 * @route POST /api/requests/:id/print
 * @access Admin only
 */
export const markAsPrinted = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const request = await RequestModel.findByPk(id, {
            include: [
                {
                    model: UserModel,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName', 'idNumber']
                }
            ]
        });

        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }

        if (request.status !== 'approved') {
            res.status(400).json({ 
                message: 'Request must be approved before marking as printed.' 
            });
            return;
        }

        // Update request status
        request.status = 'ready for pick-up';
        request.printedAt = new Date();
        await request.save();

        // Create notification for student
        await NotificationModel.create({
            userId: request.studentId,
            type: 'document_ready',
            message: `Your ${request.documentType} is ready for pick-up at the registrar's office.`,
            requestId: request.id,
            isRead: false
        });

        res.json({
            success: true,
            message: 'Request marked as printed successfully',
            data: request
        });
    } catch (error) {
        console.error('Error marking request as printed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark request as printed'
        });
    }
};

/**
 * Get student's billing information
 * @route GET /api/requests/student/:studentId/billing
 * @access Student only
 */
export const getStudentBilling = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;

        const requests = await RequestModel.findAll({
            where: { studentId: parseInt(studentId) },
            order: [['createdAt', 'DESC']]
        });

        // Get payments for each request
        const requestsWithPayments = await Promise.all(
            requests.map(async (req) => {
                const payment = await PaymentModel.findOne({
                    where: { requestId: req.id }
                });
                return {
                    ...req.toJSON(),
                    payment
                };
            })
        );

        // Calculate billing summary
        const totalAmount = requestsWithPayments.reduce((sum, req) => sum + (req.amount || 0), 0);
        const paidAmount = requestsWithPayments
            .filter(req => req.payment?.paymentStatus === 'paid')
            .reduce((sum, req) => sum + (req.amount || 0), 0);
        const pendingAmount = totalAmount - paidAmount;

        const billingSummary = {
            totalAmount,
            paidAmount,
            pendingAmount,
            requests: requestsWithPayments.map(req => ({
                id: req.id,
                documentType: req.documentType,
                amount: req.amount,
                status: req.status,
                paymentStatus: req.payment?.paymentStatus || 'pending',
                createdAt: req.createdAt,
                paidAt: req.payment?.paidAt
            }))
        };

        res.json({
            success: true,
            data: billingSummary
        });
    } catch (error) {
        console.error('Error fetching student billing:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student billing'
        });
    }
};


export {};