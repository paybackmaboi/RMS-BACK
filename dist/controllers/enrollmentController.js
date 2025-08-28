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
exports.getStudentEnrollmentHistory = exports.getStudentEnrollmentStatus = void 0;
const database_1 = require("../database");
const sequelize_1 = require("sequelize");
const getStudentEnrollmentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        console.log('🔍 User ID being queried:', userId);
        // Step 1: Check if the user exists
        let user = null;
        try {
            const userResult = yield database_1.sequelize.query(`
                SELECT id, idNumber, firstName, lastName, middleName
                FROM users 
                WHERE id = ?
            `, {
                replacements: [userId],
                type: sequelize_1.QueryTypes.SELECT
            });
            console.log('🔍 Raw user query result:', userResult);
            if (!userResult || userResult.length === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            user = userResult[0];
            console.log('🔍 User found:', user);
            // Validate user object
            if (!user || typeof user !== 'object') {
                console.error('🔍 Invalid user object:', user);
                res.status(500).json({ message: 'Invalid user data structure' });
                return;
            }
        }
        catch (error) {
            console.error('Error checking user:', error);
            res.status(500).json({ message: 'Error checking user information' });
            return;
        }
        // Step 2: Try to find registration data in multiple possible tables
        let registrationData = null;
        let registrationSource = '';
        // Try student_registrations table first
        try {
            const [regResult] = yield database_1.sequelize.query(`
                SELECT id, yearLevel, semester, schoolYear, applicationType, studentType
                FROM student_registrations 
                WHERE userId = ?
                ORDER BY createdAt DESC
                LIMIT 1
            `, {
                replacements: [userId],
                type: sequelize_1.QueryTypes.SELECT
            });
            if (regResult && regResult.length > 0) {
                registrationData = regResult[0];
                registrationSource = 'student_registrations';
                console.log('🔍 Registration found in student_registrations:', registrationData);
            }
        }
        catch (error) {
            console.log('🔍 student_registrations table not accessible or empty');
        }
        // If no registration found, try students table
        if (!registrationData) {
            try {
                const [studentResult] = yield database_1.sequelize.query(`
                    SELECT id, currentYearLevel, currentSemester, yearOfEntry, studentType, semesterEntry
                    FROM students 
                    WHERE userId = ?
                    LIMIT 1
                `, {
                    replacements: [userId],
                    type: sequelize_1.QueryTypes.SELECT
                });
                if (studentResult && studentResult.length > 0) {
                    const student = studentResult[0];
                    registrationData = {
                        yearLevel: student.currentYearLevel ? `${student.currentYearLevel}st` : '1st',
                        semester: student.currentSemester ? `${student.currentSemester}st` : '1st',
                        schoolYear: `${student.yearOfEntry}-${student.yearOfEntry + 1}`,
                        applicationType: 'Registered Student',
                        studentType: student.studentType || 'First'
                    };
                    registrationSource = 'students';
                    console.log('🔍 Student data found in students table:', registrationData);
                }
            }
            catch (error) {
                console.log('🔍 students table not accessible or empty');
            }
        }
        // Step 3: Check for enrollment data
        let enrollmentCount = 0;
        try {
            // Try student_enrollments table
            const [enrollmentResult] = yield database_1.sequelize.query(`
                SELECT COUNT(*) as count
                FROM student_enrollments 
                WHERE studentId = ?
            `, {
                replacements: [userId],
                type: sequelize_1.QueryTypes.SELECT
            });
            if (enrollmentResult && enrollmentResult.length > 0) {
                enrollmentCount = enrollmentResult[0].count || 0;
                console.log('🔍 Enrollment count from student_enrollments:', enrollmentCount);
            }
        }
        catch (error) {
            console.log('🔍 student_enrollments table not accessible');
        }
        // Step 4: Return appropriate response based on what we found
        if (registrationData) {
            console.log('🔍 Returning registration data with source:', registrationSource);
            // Safely build the response with fallbacks
            const response = {
                studentId: parseInt(userId),
                idNumber: (user === null || user === void 0 ? void 0 : user.idNumber) || 'N/A',
                fullName: `${(user === null || user === void 0 ? void 0 : user.firstName) || ''} ${(user === null || user === void 0 ? void 0 : user.middleName) || ''} ${(user === null || user === void 0 ? void 0 : user.lastName) || ''}`.trim() || 'N/A',
                yearLevel: registrationData.yearLevel || '1st',
                semester: registrationData.semester || '1st',
                schoolYear: registrationData.schoolYear || '2025-2026',
                subjects: [],
                startDate: 'August 2025',
                endDate: 'December 2025',
                finalExamDate: 'December 15-20, 2025',
                message: `Registration found in ${registrationSource} for ${registrationData.yearLevel} Year, ${registrationData.semester} Semester (${registrationData.schoolYear}). You are registered but not yet enrolled in specific subjects. Please wait for the registrar to process your enrollment.`,
                registrationSource: registrationSource
            };
            console.log('🔍 Sending response:', response);
            res.json(response);
            return;
        }
        // If no registration data found anywhere
        console.log('🔍 No registration data found in any table');
        // Safely build the response with fallbacks
        const response = {
            studentId: parseInt(userId),
            idNumber: (user === null || user === void 0 ? void 0 : user.idNumber) || 'N/A',
            fullName: `${(user === null || user === void 0 ? void 0 : user.firstName) || ''} ${(user === null || user === void 0 ? void 0 : user.middleName) || ''} ${(user === null || user === void 0 ? void 0 : user.lastName) || ''}`.trim() || 'N/A',
            yearLevel: '1st',
            semester: '1st',
            schoolYear: '2025-2026',
            subjects: [],
            startDate: 'August 2025',
            endDate: 'December 2025',
            finalExamDate: 'December 15-20, 2025',
            message: 'No registration data found. Please complete your registration first or contact the registrar\'s office.',
            registrationSource: 'none'
        };
        console.log('🔍 Sending response:', response);
        res.json(response);
    }
    catch (error) {
        console.error('Error in getStudentEnrollmentStatus:', error);
        res.status(500).json({
            message: 'Internal server error occurred while fetching enrollment status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Contact administrator'
        });
    }
});
exports.getStudentEnrollmentStatus = getStudentEnrollmentStatus;
const getStudentEnrollmentHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        // Use raw SQL query to get enrollment history
        const enrollments = yield database_1.sequelize.query(`
            SELECT 
                se.id,
                se.studentId,
                se.enrollmentStatus,
                se.grade,
                bs.schoolYear,
                bs.semester,
                bs.yearLevel,
                bs.day,
                bs.startTime,
                bs.endTime,
                bs.room,
                bc.courseCode,
                bc.courseDescription,
                bc.units
            FROM student_enrollments se
            JOIN bsit_schedules bs ON se.scheduleId = bs.id
            JOIN bsit_curriculum bc ON bs.curriculumId = bc.id
            WHERE se.studentId = ?
            ORDER BY bs.schoolYear DESC, bs.semester ASC
        `, {
            replacements: [userId],
            type: sequelize_1.QueryTypes.SELECT
        });
        // Group by school year and semester
        const enrollmentHistory = enrollments.reduce((acc, enrollment) => {
            const schoolYear = enrollment.schoolYear || 'Unknown';
            const semester = enrollment.semester || 'Unknown';
            const key = `${schoolYear}-${semester}`;
            if (!acc[key]) {
                acc[key] = {
                    schoolYear,
                    semester,
                    yearLevel: enrollment.yearLevel || 'Unknown',
                    subjects: []
                };
            }
            acc[key].subjects.push({
                courseCode: enrollment.courseCode || 'N/A',
                courseTitle: enrollment.courseDescription || 'N/A',
                units: enrollment.units || 0,
                status: enrollment.enrollmentStatus || 'Unknown',
                grade: enrollment.grade || 'N/A',
                schedule: {
                    day: enrollment.day || 'TBA',
                    startTime: enrollment.startTime || null,
                    endTime: enrollment.endTime || null,
                    room: enrollment.room || 'TBA'
                }
            });
            return acc;
        }, {});
        res.json({
            studentId: parseInt(userId),
            enrollmentHistory: Object.values(enrollmentHistory)
        });
    }
    catch (error) {
        console.error('Error fetching student enrollment history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getStudentEnrollmentHistory = getStudentEnrollmentHistory;
