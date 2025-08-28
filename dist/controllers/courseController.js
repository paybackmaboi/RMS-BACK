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
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCoursesByDepartment = exports.getCourseById = exports.getAllCourses = void 0;
const database_1 = require("../database");
const getAllCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield database_1.CourseModel.findAll({
            where: { isActive: true },
            include: [
                {
                    model: database_1.DepartmentModel,
                    as: 'department'
                }
            ],
            order: [['name', 'ASC']]
        });
        res.json(courses);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCourses = getAllCourses;
const getCourseById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield database_1.CourseModel.findByPk(id, {
            include: [
                {
                    model: database_1.DepartmentModel,
                    as: 'department'
                }
            ]
        });
        if (!course) {
            res.status(404).json({ message: 'Course not found.' });
            return;
        }
        res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.getCourseById = getCourseById;
const getCoursesByDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departmentId } = req.params;
        const courses = yield database_1.CourseModel.findAll({
            where: {
                departmentId: parseInt(departmentId),
                isActive: true
            },
            include: [
                {
                    model: database_1.DepartmentModel,
                    as: 'department'
                }
            ],
            order: [['name', 'ASC']]
        });
        res.json(courses);
    }
    catch (error) {
        next(error);
    }
});
exports.getCoursesByDepartment = getCoursesByDepartment;
const createCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, name, description, departmentId, totalUnits, duration, level } = req.body;
        const course = yield database_1.CourseModel.create({
            code,
            name,
            description,
            departmentId: parseInt(departmentId),
            totalUnits: parseInt(totalUnits),
            duration: parseInt(duration),
            level,
            isActive: true
        });
        res.status(201).json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const course = yield database_1.CourseModel.findByPk(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found.' });
            return;
        }
        yield course.update(updateData);
        res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield database_1.CourseModel.findByPk(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found.' });
            return;
        }
        // Soft delete
        yield course.update({ isActive: false });
        res.json({ message: 'Course deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCourse = deleteCourse;
