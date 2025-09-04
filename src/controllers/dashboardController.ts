import { Request, Response, NextFunction } from 'express';
import { UserModel, StudentRegistrationModel, sequelize } from '../database';
import { Op } from 'sequelize';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📊 Fetching dashboard statistics...');

        // Get total students (users with student role)
        const totalStudents = await UserModel.count({
            where: { role: 'student' }
        });

        // Get total courses (temporarily set to 0 since CourseModel is not available)
        const totalCourses = 0;

        // Get request statistics (temporarily set to 0 since RequestModel is not available)
        const totalRequests = 0;
        const pendingRequests = 0;
        const approvedRequests = 0;
        const rejectedRequests = 0;

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

        // Get monthly enrollment data (actual data from database)
        const monthlyEnrollments = await StudentRegistrationModel.findAll({
            attributes: ['id', 'createdAt'],
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                }
            }
        });

        // Get actual course distribution (BSIT only for now)
        const courseDistribution = [{
            name: 'Bachelor of Science in Information Technology',
            studentCount: bsitStudents
        }];

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
            courseDistribution: courseDistribution,
            monthlyEnrollments: monthlyEnrollments.map(enrollment => ({
                month: enrollment.createdAt.toISOString().slice(0, 7),
                count: 1 // Each enrollment represents 1 student
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

        // Get recent student registrations with actual student names
        const recentRegistrations = await StudentRegistrationModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'middleName', 'registrationStatus', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 10,
            raw: true
        });

        // Since RequestModel is not available, we'll only show registrations for now
        const recentActivity = {
            registrations: recentRegistrations.map(reg => ({
                id: reg.id,
                studentName: `${reg.lastName}, ${reg.firstName} ${reg.middleName || ''}`.trim(),
                idNumber: `REG-${reg.id}`,
                status: reg.registrationStatus,
                date: reg.createdAt
            })),
            requests: [] // No requests available since RequestModel is disabled
        };

        console.log('✅ Recent activity fetched successfully');
        res.json(recentActivity);

    } catch (error) {
        console.error('❌ Error fetching recent activity:', error);
        next(error);
    }
};
