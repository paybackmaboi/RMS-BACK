import { Request, Response, NextFunction } from 'express';
import { UserModel, StudentRegistrationModel, sequelize } from '../database';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📊 Fetching dashboard statistics...');

        // Get total students (users with student role) - use this as the primary count
        const totalStudents = await UserModel.count({
            where: { role: 'student' }
        });

        // Get total courses from courses table
        const [courseCount] = await sequelize.query('SELECT COUNT(*) as count FROM courses');
        const totalCourses = (courseCount[0] as any).count;

        // Get request statistics from requests table
        const [requestStats] = await sequelize.query(`
            SELECT 
                COUNT(*) as totalRequests,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingRequests,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approvedRequests,
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejectedRequests
            FROM requests
        `);
        const totalRequests = (requestStats[0] as any).totalRequests;
        const pendingRequests = (requestStats[0] as any).pendingRequests;
        const approvedRequests = (requestStats[0] as any).approvedRequests;
        const rejectedRequests = (requestStats[0] as any).rejectedRequests;

        // Get student status statistics - use users table for consistency
        // Count students who have corresponding records in students table as "enrolled"
        const [enrolledStats] = await sequelize.query(`
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

        const totalEnrolledStudents = (enrolledStats[0] as any).totalEnrolledStudents;
        const activeStudents = (enrolledStats[0] as any).activeStudents;
        const inactiveStudents = (enrolledStats[0] as any).inactiveStudents;
        const suspendedStudents = (enrolledStats[0] as any).suspendedStudents;
        const graduatedStudents = (enrolledStats[0] as any).graduatedStudents;

        // Get new students (pending registrations)
        const newStudents = await StudentRegistrationModel.count({
            where: { registrationStatus: 'Pending' }
        });

        // Get BSIT students count from students table
        const [bsitStats] = await sequelize.query(`
            SELECT COUNT(*) as bsitStudents
            FROM students s
            JOIN courses c ON s.courseId = c.id
            WHERE c.courseCode = 'BSIT'
        `);
        const bsitStudents = (bsitStats[0] as any).bsitStudents;

        // Get gender distribution - use users table with students table for gender data
        const [genderStats] = await sequelize.query(`
            SELECT 
                SUM(CASE WHEN s.gender = 'Male' THEN 1 ELSE 0 END) as maleCount,
                SUM(CASE WHEN s.gender = 'Female' THEN 1 ELSE 0 END) as femaleCount,
                SUM(CASE WHEN s.gender = 'Other' THEN 1 ELSE 0 END) as otherCount
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const maleCount = (genderStats[0] as any).maleCount;
        const femaleCount = (genderStats[0] as any).femaleCount;
        const otherCount = (genderStats[0] as any).otherCount;

        // Get year level distribution - use users table with students table for year level data
        const [yearLevelStats] = await sequelize.query(`
            SELECT 
                SUM(CASE WHEN s.currentYearLevel = '1st' OR s.currentYearLevel = '1st Year' OR s.currentYearLevel = 'First Year' THEN 1 ELSE 0 END) as firstYearCount,
                SUM(CASE WHEN s.currentYearLevel = '2nd' OR s.currentYearLevel = '2nd Year' OR s.currentYearLevel = 'Second Year' THEN 1 ELSE 0 END) as secondYearCount,
                SUM(CASE WHEN s.currentYearLevel = '3rd' OR s.currentYearLevel = '3rd Year' OR s.currentYearLevel = 'Third Year' THEN 1 ELSE 0 END) as thirdYearCount,
                SUM(CASE WHEN s.currentYearLevel = '4th' OR s.currentYearLevel = '4th Year' OR s.currentYearLevel = 'Fourth Year' THEN 1 ELSE 0 END) as fourthYearCount
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const firstYearCount = (yearLevelStats[0] as any).firstYearCount;
        const secondYearCount = (yearLevelStats[0] as any).secondYearCount;
        const thirdYearCount = (yearLevelStats[0] as any).thirdYearCount;
        const fourthYearCount = (yearLevelStats[0] as any).fourthYearCount;


        // Get semester distribution - use users table with students table for semester data
        const [semesterStats] = await sequelize.query(`
            SELECT 
                SUM(CASE WHEN s.currentSemester = '1st' OR s.currentSemester = '1st Semester' THEN 1 ELSE 0 END) as firstSemesterCount,
                SUM(CASE WHEN s.currentSemester = '2nd' OR s.currentSemester = '2nd Semester' THEN 1 ELSE 0 END) as secondSemesterCount,
                SUM(CASE WHEN s.currentSemester = 'Summer' THEN 1 ELSE 0 END) as summerCount
            FROM users u
            LEFT JOIN students s ON u.id = s.userId
            WHERE u.role = 'student'
        `);
        const firstSemesterCount = (semesterStats[0] as any).firstSemesterCount;
        const secondSemesterCount = (semesterStats[0] as any).secondSemesterCount;
        const summerCount = (semesterStats[0] as any).summerCount;

        // Get monthly enrollment data from students table
        const [monthlyEnrollments] = await sequelize.query(`
            SELECT 
                DATE_FORMAT(createdAt, '%Y-%m') as month,
                COUNT(*) as count
            FROM students
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
            ORDER BY month
        `);

        // Get course distribution from students and courses tables
        const [courseDistribution] = await sequelize.query(`
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

    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        next(error);
    }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📋 Fetching recent activity...');

        // Get recent student registrations with actual student names
        const recentRegistrations = await StudentRegistrationModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'middleName', 'registrationStatus', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 5,
            raw: true
        });

        // Get recent requests from requests table
        const [recentRequests] = await sequelize.query(`
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
        const [recentStudents] = await sequelize.query(`
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
            requests: recentRequests.map((req: any) => ({
                id: req.id,
                studentName: `${req.lastName}, ${req.firstName} ${req.middleName || ''}`.trim(),
                documentType: req.documentType,
                purpose: req.purpose,
                status: req.status,
                date: req.createdAt
            })),
            students: recentStudents.map((student: any) => ({
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

    } catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        next(error);
    }
};
