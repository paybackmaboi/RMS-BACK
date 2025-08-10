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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getStudentEnrollments = exports.getEnrollments = exports.createEnrollment = void 0;
const database_1 = require("../database");
const createEnrollment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { studentId, scheduleId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!studentId || !scheduleId) {
            res.status(400).json({ message: 'Student ID and Schedule ID are required.' });
            return;
        }
        // Check if enrollment already exists
        const existingEnrollment = yield database_1.Enrollment.findOne({
            where: { studentId, scheduleId }
        });
        if (existingEnrollment) {
            res.status(400).json({ message: 'Student is already enrolled in this schedule.' });
            return;
        }
        const enrollment = yield database_1.Enrollment.create({
            studentId,
            scheduleId,
            status: 'enrolled',
            enrollmentDate: new Date()
        });
        res.status(201).json(enrollment);
    }
    catch (error) {
        next(error);
    }
});
exports.createEnrollment = createEnrollment;
const getEnrollments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollments = yield database_1.Enrollment.findAll({
            include: [
                {
                    model: database_1.User,
                    as: 'student',
                    attributes: ['idNumber', 'firstName', 'lastName', 'middleName', 'course']
                },
                {
                    model: database_1.Schedule,
                    as: 'schedule',
                    include: [{
                            model: database_1.Subject,
                            as: 'subject'
                        }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(enrollments);
    }
    catch (error) {
        next(error);
    }
});
exports.getEnrollments = getEnrollments;
const getStudentEnrollments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const enrollments = yield database_1.Enrollment.findAll({
            where: { studentId: userId },
            include: [
                {
                    model: database_1.Schedule,
                    as: 'schedule',
                    include: [{
                            model: database_1.Subject,
                            as: 'subject'
                        }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(enrollments);
    }
    catch (error) {
        next(error);
    }
});
exports.getStudentEnrollments = getStudentEnrollments;
const getEnrollmentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const enrollment = yield database_1.Enrollment.findByPk(id, {
            include: [
                {
                    model: database_1.User,
                    as: 'student',
                    attributes: ['idNumber', 'firstName', 'lastName', 'middleName', 'course']
                },
                {
                    model: database_1.Schedule,
                    as: 'schedule',
                    include: [{
                            model: database_1.Subject,
                            as: 'subject'
                        }]
                }
            ]
        });
        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found.' });
            return;
        }
        // Students can only view their own enrollments
        if (userRole === 'student' && enrollment.studentId !== userId) {
            res.status(403).json({ message: 'Access denied.' });
            return;
        }
        res.json(enrollment);
    }
    catch (error) {
        next(error);
    }
});
exports.getEnrollmentById = getEnrollmentById;
const updateEnrollment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const enrollment = yield database_1.Enrollment.findByPk(id);
        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found.' });
            return;
        }
        yield enrollment.update({ status });
        res.json({ message: 'Enrollment updated successfully.', enrollment });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEnrollment = updateEnrollment;
const deleteEnrollment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const enrollment = yield database_1.Enrollment.findByPk(id);
        if (!enrollment) {
            res.status(404).json({ message: 'Enrollment not found.' });
            return;
        }
        yield enrollment.destroy();
        res.json({ message: 'Enrollment deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteEnrollment = deleteEnrollment;
