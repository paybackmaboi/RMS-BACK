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
const getDashboardStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📊 Fetching dashboard statistics...');
        // Get total students (users with student role) - use this as the primary count
        const totalStudents = yield database_1.UserModel.count({
            where: { role: 'student' }
        });
        // Get total courses from courses table
        const [courseCount] = yield database_1.sequelize.query('SELECT COUNT(*) as count FROM courses');
        const totalCourses = courseCount[0].count;
        // Get request statistics from requests table
        const [requestStats] = yield database_1.sequelize.query(`
            SELECT 
                COUNT(*) as totalRequests,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingRequests,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approvedRequests,
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejectedRequests
            FROM requests
        `);
        const totalRequests = requestStats[0].totalRequests;
        const pendingRequests = requestStats[0].pendingRequests;
        const approvedRequests = requestStats[0].approvedRequests;
        const rejectedRequests = requestStats[0].rejectedRequests;
        // Get student status statistics - use users table for consistency
        // Count students who have corresponding records in students table as "enrolled"
        const [enrolledStats] = yield database_1.sequelize.query(`
            SELECT 
                COUNT(DISTINCT u.id) as totalEnrolledStudents,
                SUM(CASE WHEN s.academicStatus = 'Active' THEN 1 ELSE 0 END) as activeStudents,
                SUM(CASE WHEN s.academicStatus = 'Inactive' THEN 1 ELSE 0 END) as inactiveStudents,
                SUM(CASE WHEN s.academicStatus = 'Suspended' THEN 1 ELSE 0 END) as suspendedStudents,
                SUM(CASE WHEN s.academicStatus = 'Graduated' THEN 1 ELSE 0 END) as graduatedStudents
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const totalEnrolledStudents = enrolledStats[0].totalEnrolledStudents;
        const activeStudents = enrolledStats[0].activeStudents;
        const inactiveStudents = enrolledStats[0].inactiveStudents;
        const suspendedStudents = enrolledStats[0].suspendedStudents;
        const graduatedStudents = enrolledStats[0].graduatedStudents;
        // Get new students (pending registrations)
        const newStudents = yield database_1.StudentRegistrationModel.count({
            where: { registrationStatus: 'Pending' }
        });
        // Get BSIT students count from students table
        const [bsitStats] = yield database_1.sequelize.query(`
            SELECT COUNT(*) as bsitStudents
            FROM students s
            JOIN courses c ON s.courseId = c.id
            WHERE c.courseCode = 'BSIT'
        `);
        const bsitStudents = bsitStats[0].bsitStudents;
        // Get gender distribution - use users table with students table for gender data
        const [genderStats] = yield database_1.sequelize.query(`
            SELECT 
                SUM(CASE WHEN s.gender = 'Male' THEN 1 ELSE 0 END) as maleCount,
                SUM(CASE WHEN s.gender = 'Female' THEN 1 ELSE 0 END) as femaleCount,
                SUM(CASE WHEN s.gender = 'Other' THEN 1 ELSE 0 END) as otherCount
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const maleCount = genderStats[0].maleCount;
        const femaleCount = genderStats[0].femaleCount;
        const otherCount = genderStats[0].otherCount;
        // Get year level distribution - use users table with students table for year level data
        const [yearLevelStats] = yield database_1.sequelize.query(`
            SELECT 
                SUM(CASE WHEN s.currentYearLevel = '1st' OR s.currentYearLevel = '1st Year' OR s.currentYearLevel = 'First Year' THEN 1 ELSE 0 END) as firstYearCount,
                SUM(CASE WHEN s.currentYearLevel = '2nd' OR s.currentYearLevel = '2nd Year' OR s.currentYearLevel = 'Second Year' THEN 1 ELSE 0 END) as secondYearCount,
                SUM(CASE WHEN s.currentYearLevel = '3rd' OR s.currentYearLevel = '3rd Year' OR s.currentYearLevel = 'Third Year' THEN 1 ELSE 0 END) as thirdYearCount,
                SUM(CASE WHEN s.currentYearLevel = '4th' OR s.currentYearLevel = '4th Year' OR s.currentYearLevel = 'Fourth Year' THEN 1 ELSE 0 END) as fourthYearCount
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const firstYearCount = yearLevelStats[0].firstYearCount;
        const secondYearCount = yearLevelStats[0].secondYearCount;
        const thirdYearCount = yearLevelStats[0].thirdYearCount;
        const fourthYearCount = yearLevelStats[0].fourthYearCount;
        // Get semester distribution - use users table with students table for semester data
        const [semesterStats] = yield database_1.sequelize.query(`
            SELECT 
                SUM(CASE WHEN s.currentSemester = '1st' OR s.currentSemester = '1st Semester' THEN 1 ELSE 0 END) as firstSemesterCount,
                SUM(CASE WHEN s.currentSemester = '2nd' OR s.currentSemester = '2nd Semester' THEN 1 ELSE 0 END) as secondSemesterCount,
                SUM(CASE WHEN s.currentSemester = 'Summer' THEN 1 ELSE 0 END) as summerCount
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const firstSemesterCount = semesterStats[0].firstSemesterCount;
        const secondSemesterCount = semesterStats[0].secondSemesterCount;
        const summerCount = semesterStats[0].summerCount;
        // Get monthly enrollment data from students table
        const [monthlyEnrollments] = yield database_1.sequelize.query(`
            SELECT 
                DATE_FORMAT(createdAt, '%Y-%m') as month,
                COUNT(*) as count
            FROM students
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
            ORDER BY month
        `);
        // Get course distribution from students and courses tables
        const [courseDistribution] = yield database_1.sequelize.query(`
            SELECT 
                c.courseName as name,
                COUNT(s.id) as studentCount
            FROM courses c
            LEFT JOIN students s ON c.id = s.courseId
            GROUP BY c.id, c.courseName
            ORDER BY studentCount DESC
        `);
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
            suspendedStudents,
            graduatedStudents,
            totalEnrolledStudents,
            bsitStudents,
            genderDistribution: {
                male: maleCount,
                female: femaleCount,
                other: otherCount
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
            courseDistribution: courseDistribution,
            monthlyEnrollments: monthlyEnrollments
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
        // Get recent student registrations with actual student names
        const recentRegistrations = yield database_1.StudentRegistrationModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'middleName', 'registrationStatus', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 5,
            raw: true
        });
        // Get recent requests from requests table
        const [recentRequests] = yield database_1.sequelize.query(`
            SELECT 
                r.id,
                r.documentType,
                r.purpose,
                r.status,
                r.createdAt,
                u.firstName,
                u.lastName,
                u.middleName
            FROM requests r
            JOIN users u ON r.studentId = u.id
            ORDER BY r.createdAt DESC
            LIMIT 5
        `);
        // Get recent enrolled students
        const [recentStudents] = yield database_1.sequelize.query(`
            SELECT 
                s.id,
                s.studentNumber,
                s.fullName,
                s.academicStatus,
                s.createdAt,
                c.courseName
            FROM students s
            JOIN courses c ON s.courseId = c.id
            ORDER BY s.createdAt DESC
            LIMIT 5
        `);
        const recentActivity = {
            registrations: recentRegistrations.map(reg => ({
                id: reg.id,
                studentName: `${reg.lastName}, ${reg.firstName} ${reg.middleName || ''}`.trim(),
                idNumber: `REG-${reg.id}`,
                status: reg.registrationStatus,
                date: reg.createdAt
            })),
            requests: recentRequests.map((req) => ({
                id: req.id,
                studentName: `${req.lastName}, ${req.firstName} ${req.middleName || ''}`.trim(),
                documentType: req.documentType,
                purpose: req.purpose,
                status: req.status,
                date: req.createdAt
            })),
            students: recentStudents.map((student) => ({
                id: student.id,
                studentName: student.fullName,
                studentNumber: student.studentNumber,
                course: student.courseName,
                status: student.academicStatus,
                date: student.createdAt
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
