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
exports.getRequestDocument = exports.updateRequestStatus = exports.getAllRequests = exports.getStudentRequests = exports.createRequest = void 0;
const database_1 = require("../database");
const path_1 = __importDefault(require("path"));
const createRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { documentType, purpose } = req.body;
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized: Student ID not found.' });
            return;
        }
        const files = req.files;
        const filePaths = files ? files.map(file => file.filename) : undefined;
        const newRequest = yield database_1.Request.create({
            studentId,
            documentType,
            purpose,
            status: 'pending',
            filePath: filePaths,
        });
        res.status(201).json(newRequest);
    }
    catch (error) {
        next(error);
    }
});
exports.createRequest = createRequest;
const getStudentRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const requests = yield database_1.Request.findAll({ where: { studentId }, order: [['createdAt', 'DESC']] });
        res.json(requests);
    }
    catch (error) {
        next(error);
    }
});
exports.getStudentRequests = getStudentRequests;
const getAllRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield database_1.Request.findAll({
            include: [{
                    model: database_1.User,
                    // THIS IS THE FIX: Add the name fields to the attributes list
                    attributes: ['idNumber', 'firstName', 'lastName', 'middleName', 'course']
                }],
            order: [['createdAt', 'DESC']],
        });
        res.json(requests);
    }
    catch (error) {
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
        const request = yield database_1.Request.findByPk(id);
        if (!request) {
            res.status(404).json({ message: 'Request not found.' });
            return;
        }
        request.status = status;
        if (notes !== undefined) {
            request.notes = notes;
        }
        yield request.save();
        res.json(request);
    }
    catch (error) {
        next(error);
    }
});
exports.updateRequestStatus = updateRequestStatus;
const getRequestDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, docIndex } = req.params;
        const request = yield database_1.Request.findByPk(id);
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
        const absoluteFilePath = path_1.default.resolve(process.cwd(), 'uploads', singleFilePath);
        res.download(absoluteFilePath, (err) => {
            if (err) {
                console.error("File download error:", err);
                if (!res.headersSent) {
                    res.status(404).json({ message: "File not found on server." });
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRequestDocument = getRequestDocument;
