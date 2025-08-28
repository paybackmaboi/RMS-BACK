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
exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubjectsByCourse = exports.getSubjectById = exports.getAllSubjects = void 0;
const database_1 = require("../database");
const getAllSubjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield database_1.SubjectModel.findAll({
            include: [
                {
                    model: database_1.CourseModel,
                    as: 'course'
                }
            ],
            where: { isActive: true }
        });
        res.json(subjects);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSubjects = getAllSubjects;
const getSubjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subject = yield database_1.SubjectModel.findByPk(id, {
            include: [
                {
                    model: database_1.CourseModel,
                    as: 'course'
                }
            ]
        });
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }
        res.json(subject);
    }
    catch (error) {
        next(error);
    }
});
exports.getSubjectById = getSubjectById;
const getSubjectsByCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course } = req.params;
        const subjects = yield database_1.SubjectModel.findAll({
            include: [
                {
                    model: database_1.CourseModel,
                    as: 'course',
                    where: { code: course }
                }
            ],
            where: { isActive: true }
        });
        res.json(subjects);
    }
    catch (error) {
        next(error);
    }
});
exports.getSubjectsByCourse = getSubjectsByCourse;
const createSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, name, description, units, courseId, yearLevel, semester, subjectType } = req.body;
        if (!code || !name || !units || !courseId || !yearLevel || !semester) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }
        const subject = yield database_1.SubjectModel.create({
            code,
            name,
            description,
            units,
            courseId,
            yearLevel,
            semester,
            subjectType: subjectType || 'Core',
            isActive: true
        });
        res.status(201).json(subject);
    }
    catch (error) {
        next(error);
    }
});
exports.createSubject = createSubject;
const updateSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const subject = yield database_1.SubjectModel.findByPk(id);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }
        yield subject.update(updateData);
        res.json(subject);
    }
    catch (error) {
        next(error);
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subject = yield database_1.SubjectModel.findByPk(id);
        if (!subject) {
            res.status(404).json({ message: 'Subject not found.' });
            return;
        }
        yield subject.update({ isActive: false });
        res.json({ message: 'Subject deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSubject = deleteSubject;
