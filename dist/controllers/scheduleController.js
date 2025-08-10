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
exports.deleteSchedule = exports.updateSchedule = exports.createSchedule = exports.getSchedulesBySubject = exports.getScheduleById = exports.getAllSchedules = void 0;
const database_1 = require("../database");
const getAllSchedules = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedules = yield database_1.Schedule.findAll({
            include: [
                { model: database_1.Subject, as: 'subject' },
                { model: database_1.SchoolYear, as: 'schoolYear' },
                { model: database_1.Semester, as: 'semester' }
            ],
            where: { isActive: true }
        });
        res.json(schedules);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSchedules = getAllSchedules;
const getScheduleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const schedule = yield database_1.Schedule.findByPk(id, {
            include: [
                { model: database_1.Subject, as: 'subject' },
                { model: database_1.SchoolYear, as: 'schoolYear' },
                { model: database_1.Semester, as: 'semester' }
            ]
        });
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found.' });
            return;
        }
        res.json(schedule);
    }
    catch (error) {
        next(error);
    }
});
exports.getScheduleById = getScheduleById;
const getSchedulesBySubject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId } = req.params;
        const schedules = yield database_1.Schedule.findAll({
            where: { subjectId, isActive: true },
            include: [
                { model: database_1.Subject, as: 'subject' },
                { model: database_1.SchoolYear, as: 'schoolYear' },
                { model: database_1.Semester, as: 'semester' }
            ]
        });
        res.json(schedules);
    }
    catch (error) {
        next(error);
    }
});
exports.getSchedulesBySubject = getSchedulesBySubject;
const createSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId, schoolYearId, semesterId, dayOfWeek, startTime, endTime, room, maxStudents } = req.body;
        // Validate required fields
        if (!subjectId || !schoolYearId || !semesterId || !dayOfWeek || !startTime || !endTime) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }
        const schedule = yield database_1.Schedule.create({
            subjectId,
            schoolYearId,
            semesterId,
            dayOfWeek,
            startTime,
            endTime,
            room,
            maxStudents: maxStudents || 50,
            currentEnrolled: 0,
            isActive: true
        });
        res.status(201).json(schedule);
    }
    catch (error) {
        next(error);
    }
});
exports.createSchedule = createSchedule;
const updateSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const schedule = yield database_1.Schedule.findByPk(id);
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found.' });
            return;
        }
        yield schedule.update(updateData);
        res.json(schedule);
    }
    catch (error) {
        next(error);
    }
});
exports.updateSchedule = updateSchedule;
const deleteSchedule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const schedule = yield database_1.Schedule.findByPk(id);
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found.' });
            return;
        }
        yield schedule.update({ isActive: false });
        res.json({ message: 'Schedule deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSchedule = deleteSchedule;
