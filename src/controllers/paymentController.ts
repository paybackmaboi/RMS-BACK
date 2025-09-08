import { Request, Response, NextFunction } from 'express';
import { PaymentModel, RequestModel, UserModel, NotificationModel } from '../database';

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
 * Get all payments for accounting view
 */
export const getAllPayments = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const payments = await PaymentModel.findAll({
            include: [
                {
                    model: RequestModel,
                    as: 'request',
                    include: [
                        {
                            model: UserModel,
                            as: 'student',
                            attributes: ['id', 'firstName', 'lastName', 'idNumber']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments'
        });
    }
};

/**
 * Get payments by student ID
 */
export const getPaymentsByStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { studentId } = req.params;

        const payments = await PaymentModel.findAll({
            where: { studentId },
            include: [
                {
                    model: RequestModel,
                    as: 'request',
                    attributes: ['id', 'documentType', 'purpose', 'status', 'amount']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Error fetching student payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student payments'
        });
    }
};

/**
 * Process payment (Accounting function)
 */
export const processPayment = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { requestId, amount, paymentMethod, receiptNumber, remarks } = req.body;
        const accountingStaff = req.user?.idNumber || 'Unknown';

        // Find the request
        const request = await RequestModel.findByPk(requestId);

        if (!request) {
            res.status(404).json({
                success: false,
                message: 'Request not found'
            });
            return;
        }

        // Get student info
        const student = await UserModel.findByPk(request.studentId);
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found'
            });
            return;
        }

        // Check if payment already exists
        let payment = await PaymentModel.findOne({
            where: { requestId }
        });

        if (payment) {
            // Update existing payment
            payment.amount = amount;
            payment.paymentMethod = paymentMethod;
            payment.paymentStatus = 'paid';
            payment.paidAt = new Date();
            payment.receivedBy = accountingStaff;
            payment.receiptNumber = receiptNumber;
            payment.remarks = remarks;
            await payment.save();
        } else {
            // Create new payment
            payment = await PaymentModel.create({
                requestId,
                studentId: student.idNumber || request.studentId.toString(),
                amount,
                paymentMethod,
                paymentStatus: 'paid',
                paidAt: new Date(),
                receivedBy: accountingStaff,
                receiptNumber,
                remarks
            });
        }

        // Update request status
        request.status = 'payment_approved';
        request.amount = amount;
        await request.save();

        // Create notification for registrar
        await NotificationModel.create({
            userId: 1, // Assuming admin/registrar user ID is 1
            type: 'payment_approved',
            message: `Payment received for ${student.firstName} ${student.lastName}'s ${request.documentType} request. Amount: ₱${amount}`,
            requestId: requestId,
            isRead: false
        });

        // Create notification for student
        await NotificationModel.create({
            userId: request.studentId,
            type: 'payment_confirmed',
            message: `Your payment of ₱${amount} for ${request.documentType} has been confirmed. Your request is now being processed.`,
            requestId: requestId,
            isRead: false
        });

        res.json({
            success: true,
            message: 'Payment processed successfully',
            data: payment
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process payment'
        });
    }
};

/**
 * Get payment status for a request
 */
export const getPaymentStatus = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { requestId } = req.params;

        const payment = await PaymentModel.findOne({
            where: { requestId },
            include: [
                {
                    model: RequestModel,
                    as: 'request',
                    attributes: ['id', 'documentType', 'status', 'amount']
                }
            ]
        });

        if (!payment) {
            res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
            return;
        }

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment status'
        });
    }
};

/**
 * Get pending payments (for accounting dashboard)
 */
export const getPendingPayments = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Fetching pending payments...');
        
        const pendingRequests = await RequestModel.findAll({
            where: { 
                status: 'payment_required' 
            },
            order: [['createdAt', 'DESC']]
        });

        console.log('📋 Found pending requests:', pendingRequests.length);

        // Get student info for each request
        const requestsWithStudents = await Promise.all(
            pendingRequests.map(async (request) => {
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

        res.json({
            success: true,
            data: requestsWithStudents
        });
    } catch (error) {
        console.error('Error fetching pending payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending payments'
        });
    }
};
