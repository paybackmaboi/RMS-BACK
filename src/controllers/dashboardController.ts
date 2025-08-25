import { Request, Response, NextFunction } from 'express';
import { UserModel, StudentModel, CourseModel, RequestModel, StudentRegistrationModel, sequelize } from '../database';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📊 Fetching dashboard statistics...');

        // Get total students (users with student role)
        const totalStudents = await UserModel.count({
            where: { role: 'student' }
        });

        // Get total courses
        const totalCourses = await CourseModel.count();

        // Get request statistics
        const totalRequests = await RequestModel.count();
        const pendingRequests = await RequestModel.count({
            where: { status: 'Pending' }
        });
        const approvedRequests = await RequestModel.count({
            where: { status: 'Approved' }
        });
        const rejectedRequests = await RequestModel.count({
            where: { status: 'Rejected' }
        });

        // Get student status statistics
        const newStudents = await StudentRegistrationModel.count({
            where: { registrationStatus: 'Pending' }
        });

        const activeStudents = await StudentRegistrationModel.count({
            where: { registrationStatus: 'Approved' }
        });

        const inactiveStudents = await StudentRegistrationModel.count({
            where: { registrationStatus: 'Rejected' }
        });

        // Get BSIT students count
        const bsitStudents = await StudentRegistrationModel.count({
            where: { course: 'Bachelor of Science in Information Technology' }
        });

        // Get gender distribution for all students (simplified approach)
        const maleCount = await StudentRegistrationModel.count({
            where: { gender: 'Male' }
        });
        const femaleCount = await StudentRegistrationModel.count({
            where: { gender: 'Female' }
        });

        // Get year level distribution (more flexible approach)
        const firstYearCount = await StudentRegistrationModel.count({
            where: { 
                yearLevel: {
                    [Op.or]: ['1st Year', '1st', 'First Year', 'First', '1']
                }
            }
        });
        const secondYearCount = await StudentRegistrationModel.count({
            where: { 
                yearLevel: {
                    [Op.or]: ['2nd Year', '2nd', 'Second Year', 'Second', '2']
                }
            }
        });
        const thirdYearCount = await StudentRegistrationModel.count({
            where: { 
                yearLevel: {
                    [Op.or]: ['3rd Year', '3rd', 'Third Year', 'Third', '3']
                }
            }
        });
        const fourthYearCount = await StudentRegistrationModel.count({
            where: { 
                yearLevel: {
                    [Op.or]: ['4th Year', '4th', 'Fourth Year', 'Fourth', '4']
                }
            }
        });

        // Debug: Check what year levels actually exist in the database
        const allYearLevels = await StudentRegistrationModel.findAll({
            attributes: ['yearLevel', 'course'],
            where: {
                yearLevel: { [Op.not]: '' }
            },
            raw: true
        });
        console.log('🔍 Available year levels in database:', allYearLevels.map(item => ({ yearLevel: item.yearLevel, course: item.course })));
        
        // Debug: Check BSIT students specifically
        const bsitStudentsDebug = await StudentRegistrationModel.findAll({
            attributes: ['yearLevel', 'course'],
            where: { 
                course: 'Bachelor of Science in Information Technology',
                yearLevel: { [Op.not]: '' }
            },
            raw: true
        });
        console.log('🔍 BSIT students with year levels:', bsitStudentsDebug.map(item => ({ yearLevel: item.yearLevel, course: item.course })));

        // Get semester distribution (simplified approach)
        const firstSemesterCount = await StudentRegistrationModel.count({
            where: { semester: '1st Semester' }
        });
        const secondSemesterCount = await StudentRegistrationModel.count({
            where: { semester: '2nd Semester' }
        });
        const summerCount = await StudentRegistrationModel.count({
            where: { semester: 'Summer' }
        });

        // Get course distribution (simplified for now)
        const courseDistribution = await CourseModel.findAll({
            attributes: ['id', 'name']
        });

        // Get monthly enrollment data (simplified for now)
        const monthlyEnrollments = await StudentRegistrationModel.findAll({
            attributes: ['id', 'createdAt'],
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
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

    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        next(error);
    }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📋 Fetching recent activity...');

        // Get recent student registrations (simplified without associations for now)
        const recentRegistrations = await StudentRegistrationModel.findAll({
            attributes: ['id', 'registrationStatus', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 10,
            raw: true
        });

        // Get recent requests (simplified without associations for now)
        const recentRequests = await RequestModel.findAll({
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

    } catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        next(error);
    }
};
