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
exports.getRecentActivity = exports.getDashboardStats = void 0;
const database_1 = require("../database");
const sequelize_1 = require("sequelize");
const getDashboardStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📊 Fetching dashboard statistics...');
        // Get total students (users with student role)
        const totalStudents = yield database_1.UserModel.count({
            where: { role: 'student' }
        });
        // Get total courses
        const totalCourses = yield database_1.CourseModel.count();
        // Get request statistics
        const totalRequests = yield database_1.RequestModel.count();
        const pendingRequests = yield database_1.RequestModel.count({
            where: { status: 'Pending' }
        });
        const approvedRequests = yield database_1.RequestModel.count({
            where: { status: 'Approved' }
        });
        const rejectedRequests = yield database_1.RequestModel.count({
            where: { status: 'Rejected' }
        });
        // Get student status statistics
        const newStudents = yield database_1.StudentRegistrationModel.count({
            where: { registrationStatus: 'Pending' }
        });
        const activeStudents = yield database_1.StudentRegistrationModel.count({
            where: { registrationStatus: 'Approved' }
        });
        const inactiveStudents = yield database_1.StudentRegistrationModel.count({
            where: { registrationStatus: 'Rejected' }
        });
        // Get BSIT students count
        const bsitStudents = yield database_1.StudentRegistrationModel.count({
            where: { course: 'Bachelor of Science in Information Technology' }
        });
        // Get gender distribution for all students (simplified approach)
        const maleCount = yield database_1.StudentRegistrationModel.count({
            where: { gender: 'Male' }
        });
        const femaleCount = yield database_1.StudentRegistrationModel.count({
            where: { gender: 'Female' }
        });
        // Get year level distribution (more flexible approach)
        const firstYearCount = yield database_1.StudentRegistrationModel.count({
            where: {
                yearLevel: {
                    [sequelize_1.Op.or]: ['1st Year', '1st', 'First Year', 'First', '1']
                }
            }
        });
        const secondYearCount = yield database_1.StudentRegistrationModel.count({
            where: {
                yearLevel: {
                    [sequelize_1.Op.or]: ['2nd Year', '2nd', 'Second Year', 'Second', '2']
                }
            }
        });
        const thirdYearCount = yield database_1.StudentRegistrationModel.count({
            where: {
                yearLevel: {
                    [sequelize_1.Op.or]: ['3rd Year', '3rd', 'Third Year', 'Third', '3']
                }
            }
        });
        const fourthYearCount = yield database_1.StudentRegistrationModel.count({
            where: {
                yearLevel: {
                    [sequelize_1.Op.or]: ['4th Year', '4th', 'Fourth Year', 'Fourth', '4']
                }
            }
        });
        // Debug: Check what year levels actually exist in the database
        const allYearLevels = yield database_1.StudentRegistrationModel.findAll({
            attributes: ['yearLevel', 'course'],
            where: {
                yearLevel: { [sequelize_1.Op.not]: '' }
            },
            raw: true
        });
        console.log('🔍 Available year levels in database:', allYearLevels.map(item => ({ yearLevel: item.yearLevel, course: item.course })));
        // Debug: Check BSIT students specifically
        const bsitStudentsDebug = yield database_1.StudentRegistrationModel.findAll({
            attributes: ['yearLevel', 'course'],
            where: {
                course: 'Bachelor of Science in Information Technology',
                yearLevel: { [sequelize_1.Op.not]: '' }
            },
            raw: true
        });
        console.log('🔍 BSIT students with year levels:', bsitStudentsDebug.map(item => ({ yearLevel: item.yearLevel, course: item.course })));
        // Get semester distribution (simplified approach)
        const firstSemesterCount = yield database_1.StudentRegistrationModel.count({
            where: { semester: '1st Semester' }
        });
        const secondSemesterCount = yield database_1.StudentRegistrationModel.count({
            where: { semester: '2nd Semester' }
        });
        const summerCount = yield database_1.StudentRegistrationModel.count({
            where: { semester: 'Summer' }
        });
        // Get course distribution (simplified for now)
        const courseDistribution = yield database_1.CourseModel.findAll({
            attributes: ['id', 'name']
        });
        // Get monthly enrollment data (simplified for now)
        const monthlyEnrollments = yield database_1.StudentRegistrationModel.findAll({
            attributes: ['id', 'createdAt'],
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                }
            }
        });
        const stats = {
            totalStudents,
            totalCourses,
            totalRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            newStudents,
            activeStudents,
            inactiveStudents,
            bsitStudents,
            genderDistribution: {
                male: maleCount,
                female: femaleCount
            },
            yearLevelDistribution: {
                firstYear: firstYearCount,
                secondYear: secondYearCount,
                thirdYear: thirdYearCount,
                fourthYear: fourthYearCount
            },
            semesterDistribution: {
                firstSemester: firstSemesterCount,
                secondSemester: secondSemesterCount,
                summer: summerCount
            },
            courseDistribution: courseDistribution.map(course => ({
                name: course.name,
                studentCount: Math.floor(Math.random() * 50) + 10 // Mock data for now
            })),
            monthlyEnrollments: monthlyEnrollments.map(enrollment => ({
                month: enrollment.createdAt.toISOString().slice(0, 7),
                count: Math.floor(Math.random() * 20) + 5 // Mock data for now
            }))
        };
        console.log('✅ Dashboard statistics fetched successfully');
        res.json(stats);
    }
    catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        next(error);
    }
});
exports.getDashboardStats = getDashboardStats;
const getRecentActivity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📋 Fetching recent activity...');
        // Get recent student registrations (simplified without associations for now)
        const recentRegistrations = yield database_1.StudentRegistrationModel.findAll({
            attributes: ['id', 'registrationStatus', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 10,
            raw: true
        });
        // Get recent requests (simplified without associations for now)
        const recentRequests = yield database_1.RequestModel.findAll({
            attributes: ['id', 'status', 'createdAt', 'studentId'],
            order: [['createdAt', 'DESC']],
            limit: 10,
            raw: true
        });
        const recentActivity = {
            registrations: recentRegistrations.map(reg => ({
                id: reg.id,
                studentName: `Registration #${reg.id}`,
                idNumber: `REG-${reg.id}`,
                status: reg.registrationStatus,
                date: reg.createdAt
            })),
            requests: recentRequests.map(req => ({
                id: req.id,
                studentName: `Student ID: ${req.studentId}`,
                idNumber: req.studentId || 'N/A',
                type: 'Request',
                status: req.status,
                date: req.createdAt
            }))
        };
        console.log('✅ Recent activity fetched successfully');
        res.json(recentActivity);
    }
    catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        next(error);
    }
});
exports.getRecentActivity = getRecentActivity;
