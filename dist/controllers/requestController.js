"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentBilling = exports.markAsPrinted = exports.approveRequest = exports.requestDocumentFromAccounting = exports.deleteRequest = exports.getRequestById = exports.getRequestDocument = exports.getRequestsByStudentId = exports.updateRequestStatus = exports.getAllRequests = exports.getStudentRequests = exports.createRequest = void 0;
const database_1 = require("../database");
const path_1 = __importDefault(require("path"));
/**
 * Create a new document request
 * @route POST /api/requests
 * @access Student only
 */
const createRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('🔍 Creating request - User info:', req.user);
        console.log('🔍 Request body:', req.body);
        console.log('🔍 Request files:', req.files);
        const { documentType, purpose, studentId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const newRequest = yield database_1.RequestModel.create({
            studentId: targetStudentId,
            documentType,
            purpose,
            status: 'pending',
            notes: '',
            filePath: req.files ? req.files.map(file => file.filename) : []
        });
        // Create notification for admin
        yield database_1.NotificationModel.create({
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
    }
    catch (error) {
        console.error('❌ Error creating request:', error);
        next(error);
    }
});
exports.createRequest = createRequest;
const getStudentRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('🔍 Getting student requests - User info:', req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const requests = yield database_1.RequestModel.findAll({
            where: { studentId: userId },
            order: [['createdAt', 'DESC']]
        });
        console.log('🔍 Found requests:', requests.length);
        res.json(requests);
    }
    catch (error) {
        console.error('❌ Error in getStudentRequests:', error);
        next(error);
    }
});
exports.getStudentRequests = getStudentRequests;
const getAllRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔍 Getting all requests - User info:', req.user);
        const requests = yield database_1.RequestModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        console.log('🔍 Found requests:', requests.length);
        // Get student info for each request
        const requestsWithStudents = yield Promise.all(requests.map((request) => __awaiter(void 0, void 0, void 0, function* () {
            const student = yield database_1.UserModel.findByPk(request.studentId);
            return Object.assign(Object.assign({}, request.toJSON()), { student: student ? {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    idNumber: student.idNumber
                } : null });
        })));
        console.log('✅ Requests with student data:', requestsWithStudents.length);
        res.json(requestsWithStudents);
    }
    catch (error) {
        console.error('❌ Error fetching requests:', error);
        next(error);
    }
});
exports.getAllRequests = getAllRequests;
const updateRequestStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        if (!status || !['pending', 'approved', 'rejected', 'ready for pick-up'].includes(status)) {
            res.status(400).json({ message: 'Invalid status provided.' });
            return;
        }
        const request = yield database_1.RequestModel.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }
        request.status = status;
        if (notes !== undefined) {
            request.notes = notes;
        }
        yield request.save();
        yield database_1.NotificationModel.create({
            userId: request.studentId,
            requestId: request.id,
            message: `Your request for ${request.documentType} has been ${status.replace(/-/g, ' ')}.`,
            isRead: false,
        });
        res.json(request);
    }
    catch (error) {
        next(error);
    }
});
exports.updateRequestStatus = updateRequestStatus;
const getRequestsByStudentId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const requests = yield database_1.RequestModel.findAll({
            where: { studentId: parseInt(studentId, 10) },
            order: [['createdAt', 'DESC']]
        });
        res.json(requests);
    }
    catch (error) {
        next(error);
    }
});
exports.getRequestsByStudentId = getRequestsByStudentId;
const getRequestDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, docIndex } = req.params;
        const request = yield database_1.RequestModel.findByPk(id);
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
        const filePath = path_1.default.join(process.cwd(), 'uploads', fileName);
        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found on server.' });
            return;
        }
        // Set appropriate headers for file download/viewing
        const ext = path_1.default.extname(fileName).toLowerCase();
        if (ext === '.pdf') {
            res.setHeader('Content-Type', 'application/pdf');
        }
        else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            res.setHeader('Content-Type', `image/${ext.slice(1)}`);
        }
        else {
            res.setHeader('Content-Type', 'application/octet-stream');
        }
        res.sendFile(filePath);
    }
    catch (error) {
        console.error('Error serving document:', error);
        res.status(500).json({ message: 'Error serving document.' });
    }
});
exports.getRequestDocument = getRequestDocument;
const getRequestById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const request = yield database_1.RequestModel.findByPk(id, {
            include: [{
                    model: database_1.UserModel,
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
    }
    catch (error) {
        next(error);
    }
});
exports.getRequestById = getRequestById;
const deleteRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const request = yield database_1.RequestModel.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }
        yield request.destroy();
        res.json({ message: 'Request deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRequest = deleteRequest;
/**
 * Registrar requests document from accounting
 * @route POST /api/requests/:id/request-document
 * @access Admin only
 */
const requestDocumentFromAccounting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const registrarId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.idNumber) || 'Unknown';
        const request = yield database_1.RequestModel.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }
        // Get student info
        const student = yield database_1.UserModel.findByPk(request.studentId);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }
        // Update request status to payment_required
        request.status = 'payment_required';
        request.amount = amount;
        request.requestedBy = registrarId;
        request.requestedAt = new Date();
        yield request.save();
        // Create notification for accounting
        yield database_1.NotificationModel.create({
            userId: 2, // Assuming accounting user ID is 2
            type: 'document_request',
            message: `New document request from Registrar: ${request.documentType} for ${student.firstName} ${student.lastName} (${student.idNumber}). Amount: ₱${amount}`,
            requestId: request.id,
            isRead: false
        });
        // Create notification for student
        yield database_1.NotificationModel.create({
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
    }
    catch (error) {
        console.error('Error requesting document from accounting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to request document from accounting'
        });
    }
});
exports.requestDocumentFromAccounting = requestDocumentFromAccounting;
/**
 * Registrar approves request after payment confirmation
 * @route POST /api/requests/:id/approve
 * @access Admin only
 */
const approveRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const registrarId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.idNumber) || 'Unknown';
        const request = yield database_1.RequestModel.findByPk(id, {
            include: [
                {
                    model: database_1.UserModel,
                    as: 'student',
                    attributes: ['id', 'firstName', 'lastName', 'idNumber']
                },
                {
                    model: database_1.PaymentModel,
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
        yield request.save();
        // Create notification for student
        yield database_1.NotificationModel.create({
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
    }
    catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve request'
        });
    }
});
exports.approveRequest = approveRequest;
/**
 * Mark request as printed
 * @route POST /api/requests/:id/print
 * @access Admin only
 */
const markAsPrinted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const request = yield database_1.RequestModel.findByPk(id, {
            include: [
                {
                    model: database_1.UserModel,
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
        yield request.save();
        // Create notification for student
        yield database_1.NotificationModel.create({
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
    }
    catch (error) {
        console.error('Error marking request as printed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark request as printed'
        });
    }
});
exports.markAsPrinted = markAsPrinted;
/**
 * Get student's billing information
 * @route GET /api/requests/student/:studentId/billing
 * @access Student only
 */
const getStudentBilling = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const requests = yield database_1.RequestModel.findAll({
            where: { studentId: parseInt(studentId) },
            order: [['createdAt', 'DESC']]
        });
        // Get payments for each request
        const requestsWithPayments = yield Promise.all(requests.map((req) => __awaiter(void 0, void 0, void 0, function* () {
            const payment = yield database_1.PaymentModel.findOne({
                where: { requestId: req.id }
            });
            return Object.assign(Object.assign({}, req.toJSON()), { payment });
        })));
        // Calculate billing summary
        const totalAmount = requestsWithPayments.reduce((sum, req) => sum + (req.amount || 0), 0);
        const paidAmount = requestsWithPayments
            .filter(req => { var _a; return ((_a = req.payment) === null || _a === void 0 ? void 0 : _a.paymentStatus) === 'paid'; })
            .reduce((sum, req) => sum + (req.amount || 0), 0);
        const pendingAmount = totalAmount - paidAmount;
        const billingSummary = {
            totalAmount,
            paidAmount,
            pendingAmount,
            requests: requestsWithPayments.map(req => {
                var _a, _b;
                return ({
                    id: req.id,
                    documentType: req.documentType,
                    amount: req.amount,
                    status: req.status,
                    paymentStatus: ((_a = req.payment) === null || _a === void 0 ? void 0 : _a.paymentStatus) || 'pending',
                    createdAt: req.createdAt,
                    paidAt: (_b = req.payment) === null || _b === void 0 ? void 0 : _b.paidAt
                });
            })
        };
        res.json({
            success: true,
            data: billingSummary
        });
    }
    catch (error) {
        console.error('Error fetching student billing:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student billing'
        });
    }
});
exports.getStudentBilling = getStudentBilling;
