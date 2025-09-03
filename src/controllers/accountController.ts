import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { 
    UserModel, 
    StudentModel, 
    StudentRegistrationModel,
    BsitCurriculumModel,
    StudentEnrollmentModel
} from '../database';
import { Op } from 'sequelize';

// Helper function to generate a new random password
const generatePassword = (length: number = 6): string => {
    return Math.random().toString().substring(2, 2 + length);
};

// Enhanced function to fetch all students with registration and enrollment data
export const getAllStudentAccounts = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('Fetching students from database...');
        
        // Get query parameters for filtering
        const { schoolYear, semester } = req.query;
        console.log('Filter parameters:', { schoolYear, semester });
        
        // Only fetch students who have completed their registration form
        const students = await UserModel.findAll({
            where: { role: 'student', isActive: true },
            include: [
                {
                    model: StudentModel
                    // No alias needed - uses default model name
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Filter to only include students who have submitted registration form
        const studentsWithRegistrations = await Promise.all(
            students.map(async (student) => {
                // Build where clause for registration filtering
                const registrationWhere: any = { userId: student.id };
                
                // Add school year and semester filters if provided
                if (schoolYear) {
                    registrationWhere.schoolYear = schoolYear;
                }
                if (semester) {
                    registrationWhere.semester = semester;
                }
                
                const registration = await StudentRegistrationModel.findOne({
                    where: registrationWhere,
                    order: [['createdAt', 'DESC']]
                });
                return { student, registration };
            })
        );

        // Filter students based on registration criteria
        let filteredStudents;
        if (schoolYear || semester) {
            // If filters are applied, only show students with matching registrations
            filteredStudents = studentsWithRegistrations
                .filter(item => item.registration !== null)
                .map(item => item.student);
            console.log('Filtered students with matching registrations:', filteredStudents.length);
        } else {
            // If no filters, show all students
            filteredStudents = studentsWithRegistrations.map(item => item.student);
            console.log('All students (no filters):', filteredStudents.length);
        }
        
        console.log('Found students:', students.length);
        console.log('Students with registrations:', studentsWithRegistrations.filter(item => item.registration !== null).length);

        // Get registration and enrollment data for filtered students
        const studentsWithDetails = await Promise.all(filteredStudents.map(async (student) => {
            const studentDetails = student.get('Student') as any;
            
            // Find the corresponding registration data for this student
            const studentWithRegistration = studentsWithRegistrations.find(item => item.student.id === student.id);
            const registration = studentWithRegistration?.registration;

            // Get student enrollment count
            const enrollmentCount = await StudentEnrollmentModel.count({
                where: { studentId: student.id }
            });

            // Get current year level and semester from registration
            let currentYearLevel = 'Not registered';
            let currentSemester = 'Not registered';
            let totalUnits = 0;
            let registrationStatus = 'Not registered';
            let registrationDate = null;

            if (registration) {
                currentYearLevel = registration.yearLevel;
                currentSemester = registration.semester;
                registrationStatus = registration.registrationStatus;
                registrationDate = new Date(registration.createdAt).toISOString().split('T')[0];
                
                // Calculate total units from curriculum
                const curriculum = await BsitCurriculumModel.findAll({
                    where: {
                        yearLevel: registration.yearLevel,
                        semester: registration.semester,
                        isActive: true
                    }
                });
                totalUnits = curriculum.reduce((sum, course) => sum + course.units, 0);
            }

            // 1. Create a 'name' field in the desired "Last, First M." format.
            const name = `${student.lastName}, ${student.firstName} ${student.middleName || ''}`.trim();

            // 2. Format the 'createdAt' date into a 'YYYY-MM-DD' string to prevent "Invalid Date".
            const formattedDate = new Date(student.createdAt).toISOString().split('T')[0];

            return {
                id: student.id,
                idNumber: student.idNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName,
                gender: studentDetails?.gender || 'N/A',
                email: student.email,
                phoneNumber: student.phoneNumber,
                profilePhoto: student.profilePhoto, // Add profile photo field
                isRegistered: !!studentDetails,
                course: 'Bachelor of Science in Information Technology', // BSIT is the course
                studentNumber: studentDetails?.studentNumber || student.idNumber,
                fullName: studentDetails?.fullName || `${student.firstName} ${student.lastName}`,
                academicStatus: studentDetails?.academicStatus || 'Not registered',
                createdAt: formattedDate,
                // New fields for registration and enrollment
                registrationStatus: registrationStatus,
                registrationDate: registrationDate,
                currentYearLevel: currentYearLevel,
                currentSemester: currentSemester,
                totalUnits: totalUnits,
                enrollmentCount: enrollmentCount,
                isFullyEnrolled: enrollmentCount > 0
            };
        }));

        console.log('Fetched students:', studentsWithDetails.length);
        console.log('Sample student data:', studentsWithDetails[0]);
        res.json(studentsWithDetails);
    } catch (error) {
        console.error('Error fetching all students:', error);
        next(error);
    }
};

// --- START: Add this new function ---
export const resetStudentPassword = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByPk(id);

        if (!user || user.role !== 'student') {
            res.status(404).json({ message: 'Student account not found.' });
            return;
        }

        const newPassword = generatePassword();
        
        // The beforeUpdate hook in your User model will automatically hash this new password
        user.password = newPassword;
        await user.save();

        // Return the new, un-hashed password to the admin
        res.json({
            message: 'Password reset successfully.',
            idNumber: user.idNumber,
            newPassword: newPassword,
        });

    } catch (error) {
        next(error);
    }
};
// --- END: Add this new function ---