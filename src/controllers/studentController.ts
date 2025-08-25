import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { 
    UserModel, 
    StudentModel, 
    CourseModel, 
    sequelize,
    StudentRegistrationModel,
    BsitCurriculumModel,
    BsitScheduleModel,
    StudentEnrollmentModel
} from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

// Helper function to generate a unique ID Number
const generateIdNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const lastUser = await UserModel.findOne({
        where: { idNumber: { [Op.like]: `${currentYear}-%` } },
        order: [['idNumber', 'DESC']],
    });
    
    if (lastUser) {
        const lastNumber = parseInt(lastUser.idNumber.split('-')[1]);
        return `${currentYear}-${String(lastNumber + 1).padStart(4, '0')}`;
    }
    
    return `${currentYear}-0001`;
};

// Helper function to generate a random password
const generatePassword = (length: number = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const createAndEnrollStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, middleName, gender, courseId } = req.body;
        
        const idNumber = await generateIdNumber();
        const password = generatePassword();
        
        const newUser = await UserModel.create({
            idNumber,
            password,
            role: 'student',
            firstName,      
            lastName,       
            middleName,
            isActive: true
        });
        
        res.status(201).json({
            message: 'Student account created successfully!',
            user: {
                id: newUser.id,
                idNumber: newUser.idNumber,
                password: password,
                name: `${lastName}, ${firstName} ${middleName || ''}`,
                gender
            },
        });

    } catch (error) {
        next(error);
    }
};

export const getRegistrationStatus = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const student = await StudentModel.findOne({ where: { userId } });
        res.json({ isRegistered: !!student });

    } catch (error) {
        next(error);
    }
};

export const getAllStudents = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const students = await UserModel.findAll({
            where: { role: 'student', isActive: true },
            include: [
                {
                    model: StudentModel,
                    as: 'studentDetails',
                    include: [
                        {
                            model: CourseModel,
                            as: 'course'
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Get registration and enrollment data for all students
        const studentsWithDetails = await Promise.all(students.map(async (student) => {
            const studentDetails = student.get('studentDetails') as any;
            
            // Get student registration data
            const registration = await StudentRegistrationModel.findOne({
                where: { userId: student.id },
                order: [['createdAt', 'DESC']]
            });

            // Get student enrollment count
            const enrollmentCount = await sequelize.models.StudentEnrollment.count({
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

        res.json(studentsWithDetails);
    } catch (error) {
        console.error('Error fetching all students:', error);
        next(error);
    }
};

export const getStudentDetails = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        // First, get the user without includes to avoid association errors
        const student = await UserModel.findByPk(id);

        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // Get student registration data for detailed information
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: id },
            order: [['createdAt', 'DESC']]
        });

        // Try to get student details if they exist
        let studentDetails = null;
        try {
            studentDetails = await StudentModel.findOne({
                where: { userId: id },
                include: [
                    {
                        model: CourseModel,
                        as: 'course'
                    }
                ]
            });
        } catch (detailError) {
            console.log(`Student details not found for user ${id}, continuing without them`);
        }

        // Combine user, student, and registration data
        const studentData = {
            ...student.toJSON(),
            studentDetails: studentDetails ? studentDetails.toJSON() : null,
            registration: studentRegistration ? {
                yearLevel: studentRegistration.yearLevel,
                semester: studentRegistration.semester,
                email: studentRegistration.email,
                contactNumber: studentRegistration.contactNumber,
                gender: studentRegistration.gender,
                dateOfBirth: studentRegistration.dateOfBirth,
                placeOfBirth: studentRegistration.placeOfBirth,
                religion: studentRegistration.religion,
                nationality: studentRegistration.nationality,
                cityAddress: studentRegistration.cityAddress,
                provincialAddress: studentRegistration.provincialAddress,
                fatherName: studentRegistration.fatherName,
                fatherOccupation: studentRegistration.fatherOccupation,
                motherName: studentRegistration.motherName,
                motherOccupation: studentRegistration.motherOccupation,
                guardianName: studentRegistration.guardianName,
                registrationStatus: studentRegistration.registrationStatus,
                registrationDate: studentRegistration.createdAt
            } : null
        };

        res.json(studentData);
    } catch (error) {
        console.error('Error in getStudentDetails:', error);
        next(error);
    }
};

export const updateStudentDetails = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params; // The User ID
        const updateData = req.body;

        const user = await UserModel.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Update the User model (for name changes, etc.)
        await user.update({
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            middleName: updateData.middleName,
        });

        // Find and update the associated Student model for detailed info
        const studentDetails = await StudentModel.findOne({ where: { userId: id } });
        if (studentDetails) {
            await studentDetails.update(updateData);
        }

        res.json({ message: 'Student details updated successfully.' });
    } catch (error) {
        console.error('Error updating student details:', error);
        next(error);
    }
};

export const updateStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    // FIX: This function is now wrapped in a transaction to ensure data integrity.
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const updateData = req.body;

        const user = await UserModel.findByPk(id);
        if (!user) {
            await t.rollback();
            res.status(404).json({ message: 'Student user account not found.' });
            return;
        }

        // FIX: Explicitly separate the data for the User and Student models.
        // This prevents errors from trying to update a model with fields it doesn't have.

        // 1. Data for the User table
        const userDataToUpdate = {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            middleName: updateData.middleName,
            email: updateData.email,
        };

        // 2. Data for the Student table (all other fields)
        const studentDetailsDataToUpdate = {
            // Personal
            gender: updateData.gender,
            maritalStatus: updateData.maritalStatus,
            dateOfBirth: updateData.dateOfBirth,
            placeOfBirth: updateData.placeOfBirth,
            religion: updateData.religion,
            citizenship: updateData.citizenship,
            contactNumber: updateData.contactNumber,
            cityAddress: updateData.cityAddress,
            provincialAddress: updateData.provincialAddress,
            // Family
            fatherName: updateData.fatherName,
            fatherOccupation: updateData.fatherOccupation,
            fatherContactNumber: updateData.fatherContactNumber,
            motherName: updateData.motherName,
            motherOccupation: updateData.motherOccupation,
            motherContactNumber: updateData.motherContactNumber,
            guardianName: updateData.guardianName,
            guardianOccupation: updateData.guardianOccupation,
            guardianContactNumber: updateData.guardianContactNumber,
            // Academic Background
            courseId: updateData.courseId ? parseInt(updateData.courseId, 10) : null,
            major: updateData.major,
            yearOfEntry: updateData.yearOfEntry,
            academicStatus: updateData.academicStatus,
            currentYearLevel: updateData.currentYearLevel,
            // Academic History
            elementarySchool: updateData.elementarySchool,
            elementaryYearGraduated: updateData.elementaryYearGraduated,
            juniorHighSchool: updateData.juniorHighSchool,
            juniorHighYearGraduated: updateData.juniorHighYearGraduated,
            seniorHighSchool: updateData.seniorHighSchool,
            seniorHighYearGraduated: updateData.seniorHighYearGraduated,
            seniorHighStrand: updateData.seniorHighStrand,
        };
        
        // Perform the updates within the transaction
        await user.update(userDataToUpdate, { transaction: t });

        const studentDetails = await StudentModel.findOne({ where: { userId: id } });
        if (studentDetails) {
            await studentDetails.update(studentDetailsDataToUpdate, { transaction: t });
        } else {
            // This case is unlikely if the student is registered, but it's good practice
            // to handle it. You could even create a student record here if needed.
            console.warn(`No studentDetails record found for userId: ${id} to update.`);
        }

        // If both updates are successful, commit the transaction
        await t.commit();

        res.json({ message: 'Student updated successfully.' });
    } catch (error) {
        // If any error occurs, roll back all changes
        await t.rollback();
        console.error("Error updating student:", error);
        next(error);
    }
};

export const deleteStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const student = await UserModel.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // Soft delete by setting isActive to false
        await student.update({ isActive: false });

        // Also soft delete student details if they exist
        const studentDetails = await StudentModel.findOne({ where: { userId: id } });
        if (studentDetails) {
            await studentDetails.update({ isActive: false });
        }

        res.json({ message: 'Student deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

export const registerStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    const t = await sequelize.transaction();
    try {
        const {
            idNumber,
            password,
            firstName,
            lastName,
            middleName
        } = req.body;

        // Validate required fields
        if (!idNumber || !password || !firstName || !lastName) {
            res.status(400).json({ message: 'School ID, Password, First Name, and Last Name are required.' });
            return;
        }

        // Validate School ID format (YYYY-XXXXX)
        const schoolIdPattern = /^\d{4}-\d{5}$/;
        if (!schoolIdPattern.test(idNumber)) {
            res.status(400).json({ message: 'School ID must be in the format: YYYY-XXXXX (e.g., 2022-00037)' });
            return;
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ where: { idNumber } });
        if (existingUser) {
            res.status(409).json({ message: `The School ID '${idNumber}' is already registered. Please use a different School ID.` });
            return;
        }

        // Create user account
        const newUser = await UserModel.create({
            idNumber,
            password, // The model hook will hash this automatically
            role: 'student',
            firstName,
            lastName,
            middleName: middleName || '',
            isActive: true
        }, { transaction: t });

        // Create basic student record
        await StudentModel.create({
            userId: newUser.id,
            studentNumber: idNumber, // Use School ID as student number
            courseId: null, // Will be set during enrollment
            fullName: `${lastName}, ${firstName} ${middleName || ''}`.trim(),
            // Optional fields will use database defaults or be null
            studentType: 'First',
            semesterEntry: 'First',
            yearOfEntry: new Date().getFullYear(),
            applicationType: 'Freshmen',
            academicStatus: 'Regular',
            currentYearLevel: 1,
            currentSemester: 1,
            totalUnitsEarned: 0,
            cumulativeGPA: 0.00,
            isActive: true
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: 'Student registration completed successfully! You can now login with your School ID and password.',
            studentId: idNumber,
            firstName,
            lastName,
            redirectTo: '/student-homepage' // Frontend will redirect after successful registration
        });
    } catch (error) {
        await t.rollback();
        console.error('Error registering student:', error);
        next(error);
    }
};

export const debugStudentRegistration = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if user exists
        const user = await UserModel.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Check if student record exists
        const student = await StudentModel.findOne({ where: { userId } });
        
        res.json({
            user: {
                id: user.id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            student: student ? {
                id: student.id,
                studentNumber: student.studentNumber,
                fullName: student.fullName,
                courseId: student.courseId,
                academicStatus: student.academicStatus
            } : null,
            isRegistered: !!student
        });
    } catch (error) {
        console.error('Error in debug endpoint:', error);
        next(error);
    }
};

export const getCurrentStudentProfile = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Get user and student data
        const user = await UserModel.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const student = await StudentModel.findOne({ where: { userId } });
        if (!student) {
            res.status(404).json({ message: 'Student record not found' });
            return;
        }

        res.json({
            id: user.id,
            idNumber: user.idNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            fullName: student.fullName,
            studentNumber: student.studentNumber,
            currentYearLevel: student.currentYearLevel,
            currentSemester: student.currentSemester,
            totalUnitsEarned: student.totalUnitsEarned,
            cumulativeGPA: student.cumulativeGPA,
            academicStatus: student.academicStatus,
            yearOfEntry: student.yearOfEntry,
            applicationType: student.applicationType,
            studentType: student.studentType
        });

    } catch (error) {
        console.error('Error fetching student profile:', error);
        next(error);
    }
};

export const completeStudentRegistration = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    const t = await sequelize.transaction();
    try {
        // Helper function to parse numeric fields
        const parseNumericField = (value: any, defaultValue: number = 0): number => {
            if (value === '' || value === null || value === undefined) {
                return defaultValue;
            }
            const parsed = parseInt(value);
            return isNaN(parsed) ? defaultValue : parsed;
        };

        const {
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            placeOfBirth,
            gender,
            maritalStatus,
            nationality,
            religion,
            email,
            contactNumber,
            cityAddress,
            cityTelNumber,
            provincialAddress,
            provincialTelNumber,
            fatherName,
            fatherAddress,
            fatherOccupation,
            fatherCompany,
            fatherContactNumber,
            fatherIncome,
            motherName,
            motherAddress,
            motherOccupation,
            motherCompany,
            motherContactNumber,
            motherIncome,
            guardianName,
            guardianAddress,
            guardianOccupation,
            guardianCompany,
            guardianContactNumber,
            guardianIncome,
            yearLevel,
            semester,
            schoolYear,
            applicationType,
            studentType,
            elementarySchool,
            elementaryAddress,
            elementaryHonor,
            elementaryYearGraduated,
            juniorHighSchool,
            juniorHighAddress,
            juniorHighHonor,
            juniorHighYearGraduated,
            seniorHighSchool,
            seniorHighAddress,
            seniorHighStrand,
            seniorHighHonor,
            seniorHighYearGraduated,
            ncaeGrade,
            specialization,
            lastCollegeAttended,
            lastCollegeYearTaken,
            lastCollegeCourse,
            lastCollegeMajor,
            course,
            major
        } = req.body;

        // Get user ID from authenticated session
        const userId = req.user?.id;
        
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Validate required fields
        if (!firstName || !lastName || !yearLevel || !semester || !schoolYear) {
            res.status(400).json({ message: 'First Name, Last Name, Year Level, Semester, and School Year are required.' });
            return;
        }

        // Get student ID from existing student record
        const existingStudent = await StudentModel.findOne({
            where: { userId: userId }
        });

        if (!existingStudent) {
            res.status(404).json({ message: 'Student record not found. Please complete initial registration first.' });
            return;
        }

        // Create student registration record
        const registration = await StudentRegistrationModel.create({
            userId: userId,
            studentId: existingStudent.studentNumber,
            registrationStatus: 'Approved',
            firstName,
            middleName,
            lastName,
            dateOfBirth,
            placeOfBirth,
            gender,
            maritalStatus,
            nationality,
            religion,
            email,
            contactNumber,
            cityAddress,
            cityTelNumber,
            provincialAddress,
            provincialTelNumber,
            fatherName,
            fatherAddress,
            fatherOccupation,
            fatherCompany,
            fatherContactNumber,
            fatherIncome,
            motherName,
            motherAddress,
            motherOccupation,
            motherCompany,
            motherContactNumber,
            motherIncome,
            guardianName,
            guardianAddress,
            guardianOccupation,
            guardianCompany,
            guardianContactNumber,
            guardianIncome,
            yearLevel,
            semester,
            schoolYear,
            applicationType,
            studentType,
            elementarySchool,
            elementaryAddress,
            elementaryHonor,
            elementaryYearGraduated: parseNumericField(elementaryYearGraduated, 0),
            juniorHighSchool,
            juniorHighAddress,
            juniorHighHonor,
            juniorHighYearGraduated: parseNumericField(juniorHighYearGraduated, 0),
            seniorHighSchool,
            seniorHighAddress,
            seniorHighStrand,
            seniorHighHonor,
            seniorHighYearGraduated: parseNumericField(seniorHighYearGraduated, 0),
            ncaeGrade,
            specialization,
            lastCollegeAttended,
            lastCollegeYearTaken: parseNumericField(lastCollegeYearTaken, 0),
            lastCollegeCourse,
            lastCollegeMajor,
            course,
            major
        }, { transaction: t });

        // Update existing student record with new information
        await existingStudent.update({
            fullName: `${lastName}, ${firstName} ${middleName || ''}`.trim(),
            gender,
            dateOfBirth,
            placeOfBirth,
            email,
            contactNumber,
            currentYearLevel: parseInt(yearLevel.replace(/\D/g, '')),
            currentSemester: parseInt(semester.replace(/\D/g, '')),
            yearOfEntry: new Date().getFullYear(),
            applicationType,
            studentType
        }, { transaction: t });

        // Get BSIT curriculum for the selected year level and semester
        const curriculum = await BsitCurriculumModel.findAll({
            where: {
                yearLevel: yearLevel,
                semester: semester,
                isActive: true
            }
        });

        if (curriculum.length === 0) {
            res.status(404).json({ message: `No curriculum found for ${yearLevel} Year, ${semester} Semester` });
            return;
        }

        // Get schedules for the selected year level and semester
        const schedules = await BsitScheduleModel.findAll({
            where: {
                yearLevel: yearLevel,
                semester: semester,
                schoolYear: schoolYear,
                scheduleStatus: 'Open'
            }
        });

        if (schedules.length === 0) {
            res.status(404).json({ message: `No schedules found for ${yearLevel} Year, ${semester} Semester, ${schoolYear}` });
            return;
        }

        // Automatically enroll student in all available schedules for their year level
        const enrollments = [];
        for (const schedule of schedules) {
            const enrollment = await StudentEnrollmentModel.create({
                studentId: existingStudent.id,
                scheduleId: (schedule as any).id,
                enrollmentStatus: 'Enrolled'
            }, { transaction: t });
            enrollments.push(enrollment);
        }

        // Update schedule enrollment counts
        for (const schedule of schedules) {
            await (schedule as any).update({
                currentEnrollment: (schedule as any).currentEnrollment + 1
            }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({
            message: 'Student registration completed successfully!',
            registration: {
                id: (registration as any).id,
                yearLevel,
                semester,
                schoolYear,
                totalCourses: curriculum.length,
                totalUnits: curriculum.reduce((sum, course) => sum + (course as any).units, 0),
                totalSchedules: schedules.length,
                totalEnrollments: enrollments.length
            },
            schedule: {
                yearLevel,
                semester,
                schoolYear,
                courses: curriculum.map(course => ({
                    courseCode: (course as any).courseCode,
                    courseDescription: (course as any).courseDescription,
                    units: (course as any).units,
                    courseType: (course as any).courseType
                })),
                schedules: schedules.map(schedule => ({
                    day: (schedule as any).day,
                    startTime: (schedule as any).startTime,
                    endTime: (schedule as any).endTime,
                    room: (schedule as any).room,
                    instructor: (schedule as any).instructor
                }))
            }
        });

    } catch (error) {
        await t.rollback();
        console.error('Error completing student registration:', error);
        next(error);
    }
};

// Get student registration data by user ID (admin only)
export const getStudentRegistrationData = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        console.log('🔍 Fetching registration data for userId:', userId);
        
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });

        console.log('📋 Found registration data:', studentRegistration ? 'YES' : 'NO');
        if (studentRegistration) {
            console.log('📝 Registration details:', {
                id: studentRegistration.id,
                firstName: studentRegistration.firstName,
                lastName: studentRegistration.lastName,
                gender: studentRegistration.gender,
                email: studentRegistration.email
            });
        }

        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }

        res.json(studentRegistration);
    } catch (error) {
        console.error('Error fetching student registration data:', error);
        next(error);
    }
};

// Get student enrolled subjects by year level and semester
export const getStudentEnrolledSubjects = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        console.log('🔍 Fetching enrolled subjects for userId:', userId);
        
        // First get the student's current year level and semester
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });

        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }

        const { yearLevel, semester } = studentRegistration;
        console.log('📚 Student is in:', yearLevel, semester);

        // Get the curriculum for this year level and semester
        const curriculum = await BsitCurriculumModel.findAll({
            where: {
                yearLevel: yearLevel,
                semester: semester,
                isActive: true
            },
            order: [['courseCode', 'ASC']]
        });

        // For now, we'll show all curriculum subjects and mark them as not enrolled
        // In a real system, you'd need to join enrollments with schedules and curriculum
        const subjects = curriculum.map(course => {
            return {
                id: course.id,
                courseCode: course.courseCode,
                courseTitle: course.courseDescription,
                units: course.units,
                courseType: course.courseType,
                prerequisites: course.prerequisites,
                isEnrolled: false, // For now, assume not enrolled
                enrollmentId: null,
                finalGrade: 'N/A',
                status: 'Not Enrolled',
                yearLevel: course.yearLevel,
                semester: course.semester
            };
        });

        console.log('📋 Found subjects:', subjects.length);
        res.json({
            yearLevel,
            semester,
            totalUnits: subjects.reduce((sum, sub) => sum + sub.units, 0),
            subjects
        });
    } catch (error) {
        console.error('Error fetching student enrolled subjects:', error);
        next(error);
    }
};

// Search user by ID number (for admin use)
export const searchUserByIdNumber = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { idNumber } = req.params;
        console.log('🔍 Searching for user with ID number:', idNumber);
        
        const user = await UserModel.findOne({ 
            where: { idNumber },
            attributes: ['id', 'idNumber', 'firstName', 'lastName', 'middleName', 'email', 'phoneNumber', 'role']
        });

        console.log('🔍 User found:', user ? 'YES' : 'NO');
        if (user) {
            console.log('🔍 User details:', {
                id: user.id,
                idNumber: user.idNumber,
                firstName: user.firstName,
                lastName: user.lastName
            });
        } else {
            console.log('🔍 No user found with ID number:', idNumber);
            
            // Let's also check what users exist in the database
            const allUsers = await UserModel.findAll({
                attributes: ['id', 'idNumber', 'firstName', 'lastName'],
                limit: 10
            });
            console.log('🔍 Available users in database:', allUsers.map(u => ({ id: u.id, idNumber: u.idNumber, name: `${u.firstName} ${u.lastName}` })));
        }

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('❌ Error searching for user:', error);
        next(error);
    }
};

// Update student registration data (admin only)
export const updateStudentRegistration = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        
        console.log('🔍 Updating student registration for userId:', userId);
        console.log('🔍 Update data received:', updateData);

        // First, find the user by ID to get their ID number
        // The userId from params should be the actual user ID
        console.log('🔍 Looking for user with ID:', userId, 'Type:', typeof userId);
        
        const user = await UserModel.findByPk(parseInt(userId, 10));
        if (!user) {
            console.log('❌ User not found with ID:', userId);
            
            // Let's also check what users exist in the database
            const allUsers = await UserModel.findAll({
                attributes: ['id', 'idNumber', 'firstName', 'lastName'],
                limit: 10
            });
            console.log('🔍 Available users in database:', allUsers.map(u => ({ id: u.id, idNumber: u.idNumber, name: `${u.firstName} ${u.lastName}` })));
            
            res.status(404).json({ message: 'User not found' });
            return;
        }

        console.log('🔍 Found user:', user.idNumber);

        // Find the student registration record using the user ID
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: parseInt(userId, 10) },
            order: [['createdAt', 'DESC']]
        });

        console.log('🔍 Student registration found:', studentRegistration ? 'YES' : 'NO');

        if (!studentRegistration) {
            console.log('❌ No student registration found for userId:', userId);
            
            // Check if we should create a basic registration record
            console.log('🔍 Attempting to create basic registration record...');
            
            try {
                console.log('🔍 Creating registration record with data:', {
                    userId: parseInt(userId, 10),
                    studentId: user.idNumber,
                    firstName: updateData.firstName || user.firstName,
                    lastName: updateData.lastName || user.lastName
                });

                // Create a minimal registration record with only required fields
                const registrationData: any = {
                    userId: parseInt(userId, 10),
                    studentId: user.idNumber,
                    registrationStatus: 'Pending' as const,
                    firstName: updateData.firstName || user.firstName || 'Unknown',
                    lastName: updateData.lastName || user.lastName || 'Unknown',
                    middleName: updateData.middleName || user.middleName || '',
                    email: updateData.email || user.email || '',
                    contactNumber: updateData.contactNumber || user.phoneNumber || '',
                    // Set default values for required fields
                    yearLevel: '1st Year',
                    semester: 'First Semester',
                    schoolYear: new Date().getFullYear().toString(),
                    applicationType: 'Freshmen',
                    studentType: 'Regular',
                    // Add required fields with defaults
                    major: 'Information Technology',
                    course: 'BSIT',
                    nationality: 'Filipino',
                    // Set other required fields to empty strings or defaults
                    dateOfBirth: updateData.dateOfBirth || '',
                    placeOfBirth: updateData.placeOfBirth || '',
                    gender: updateData.gender || '',
                    maritalStatus: updateData.maritalStatus || '',
                    religion: updateData.religion || '',
                    cityAddress: updateData.cityAddress || '',
                    provincialAddress: updateData.provincialAddress || '',
                    fatherName: updateData.fatherName || '',
                    fatherOccupation: updateData.fatherOccupation || '',
                    fatherContactNumber: updateData.fatherContactNumber || '',
                    motherName: updateData.motherName || '',
                    motherOccupation: updateData.motherOccupation || '',
                    motherContactNumber: updateData.motherContactNumber || '',
                    guardianName: updateData.guardianName || '',
                    guardianOccupation: updateData.guardianOccupation || '',
                    guardianContactNumber: updateData.guardianContactNumber || '',
                    elementarySchool: updateData.elementarySchool || '',
                    elementaryYearGraduated: updateData.elementaryYearGraduated || 0,
                    juniorHighSchool: updateData.juniorHighSchool || '',
                    juniorHighYearGraduated: updateData.juniorHighYearGraduated || 0,
                    seniorHighSchool: updateData.seniorHighSchool || '',
                    seniorHighYearGraduated: updateData.seniorHighYearGraduated || 0,
                    seniorHighStrand: updateData.seniorHighStrand || '',
                    lastCollegeAttended: updateData.lastCollegeAttended || '',
                    lastCollegeYearTaken: updateData.lastCollegeYearTaken || 0,
                    lastCollegeCourse: updateData.lastCollegeCourse || '',
                    lastCollegeMajor: updateData.lastCollegeMajor || ''
                };

                const newRegistration = await StudentRegistrationModel.create(registrationData);
                
                console.log('✅ Created new registration record with ID:', newRegistration.id);
                
                // Now update this new record with the provided data (only non-empty values)
                const updateFields: any = {};
                Object.keys(updateData).forEach(key => {
                    if (updateData[key] !== '' && updateData[key] !== null && updateData[key] !== undefined) {
                        updateFields[key] = updateData[key];
                    }
                });
                
                if (Object.keys(updateFields).length > 0) {
                    await newRegistration.update(updateFields);
                    console.log('✅ Updated new registration record with fields:', Object.keys(updateFields));
                }
                
            } catch (createError: any) {
                console.error('❌ Failed to create registration record:', createError);
                console.error('❌ Error details:', {
                    message: createError.message,
                    stack: createError.stack
                });
                
                // Try to get more specific error information
                if (createError.name === 'SequelizeValidationError') {
                    const validationErrors = createError.errors?.map((err: any) => `${err.path}: ${err.message}`).join(', ');
                    res.status(500).json({ 
                        message: `Validation error: ${validationErrors}`,
                        details: 'Failed to create student registration record due to validation errors.'
                    });
                } else {
                    res.status(500).json({ 
                        message: 'Failed to create student registration record. Please ensure the student completes their registration form first.',
                        error: createError.message
                    });
                }
                return;
            }
        }

        // Update the student registration data (either existing or newly created)
        if (studentRegistration) {
            await studentRegistration.update(updateData);
            console.log('✅ Existing student registration updated successfully');
        } else {
            console.log('✅ Using newly created registration record');
        }

        // Also update the user data if basic fields are provided
        const userUpdateData = {
            firstName: updateData.firstName || user.firstName,
            lastName: updateData.lastName || user.lastName,
            middleName: updateData.middleName || user.middleName,
            email: updateData.email || user.email,
            phoneNumber: updateData.contactNumber || user.phoneNumber
        };
        await user.update(userUpdateData);
        console.log('✅ User data updated successfully');

        res.json({ message: 'Student registration updated successfully.' });
    } catch (error) {
        console.error('❌ Error updating student registration:', error);
        next(error);
    }
};