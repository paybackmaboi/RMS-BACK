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

// Complete student registration with permanent data (requires session authentication)
export const completeStudentRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get userId from the authenticated session
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const registrationData = req.body;
        
        console.log('📝 Student completing registration for user ID:', userId);
        console.log('📝 Registration data:', registrationData);

        // Check if user exists and is a student
        const user = await UserModel.findByPk(userId);
        if (!user || user.role !== 'student') {
            res.status(404).json({ message: 'Student user not found' });
            return;
        }

        // Check if student already has a record
        let student = await StudentModel.findOne({ where: { userId: userId } });
        
        if (!student) {
            // Create new student record with proper data types and defaults
            student = await StudentModel.create({
                userId: userId,
                studentNumber: user.idNumber,
                fullName: `${user.firstName} ${user.lastName} ${user.middleName || ''}`.trim(),
                gender: registrationData.gender || 'N/A',
                email: registrationData.email || user.email || '',
                contactNumber: registrationData.contactNumber || '',
                currentYearLevel: parseInt(registrationData.yearLevel) || 1,
                currentSemester: parseInt(registrationData.semester) || 1,
                yearOfEntry: new Date().getFullYear(),
                studentType: registrationData.studentType || 'First',
                semesterEntry: 'First',
                applicationType: registrationData.applicationType || 'Freshmen',
                academicStatus: 'Regular',
                totalUnitsEarned: 0,
                cumulativeGPA: 0.0,
                isActive: true,
                // Add all required fields with proper defaults
                courseId: null,
                major: 'Information Technology',
                dateOfBirth: registrationData.dateOfBirth || null,
                placeOfBirth: registrationData.placeOfBirth || '',
                maritalStatus: registrationData.maritalStatus || 'Single',
                religion: registrationData.religion || '',
                citizenship: registrationData.citizenship || 'Filipino',
                cityAddress: registrationData.cityAddress || '',
                provincialAddress: registrationData.provincialAddress || '',
                fatherName: registrationData.fatherName || '',
                fatherOccupation: registrationData.fatherOccupation || '',
                fatherContactNumber: registrationData.fatherContactNumber || '',
                motherName: registrationData.motherName || '',
                motherOccupation: registrationData.motherOccupation || '',
                motherContactNumber: registrationData.motherContactNumber || '',
                guardianName: registrationData.guardianName || '',
                guardianOccupation: registrationData.guardianOccupation || '',
                guardianContactNumber: registrationData.guardianContactNumber || '',
                elementarySchool: registrationData.elementarySchool || '',
                elementaryYearGraduated: registrationData.elementaryYearGraduated ? parseInt(registrationData.elementaryYearGraduated) || undefined : undefined,
                juniorHighSchool: registrationData.juniorHighSchool || '',
                juniorHighYearGraduated: registrationData.juniorHighYearGraduated ? parseInt(registrationData.juniorHighYearGraduated) || undefined : undefined,
                seniorHighSchool: registrationData.seniorHighSchool || '',
                seniorHighYearGraduated: registrationData.seniorHighYearGraduated ? parseInt(registrationData.seniorHighYearGraduated) || undefined : undefined,
                seniorHighStrand: registrationData.seniorHighStrand || '',
                lastCollegeAttended: registrationData.lastCollegeAttended || '',
                lastCollegeYearTaken: registrationData.lastCollegeYearTaken ? parseInt(registrationData.lastCollegeYearTaken) || undefined : undefined,
                lastCollegeCourse: registrationData.lastCollegeCourse || '',
                lastCollegeMajor: registrationData.lastCollegeMajor || ''
            });
            console.log('✅ Created new student record:', student.id);
        } else {
            // Update existing student record
            await student.update({
                fullName: `${user.firstName} ${user.lastName} ${user.middleName || ''}`.trim(),
                gender: registrationData.gender || student.gender,
                email: registrationData.email || student.email,
                contactNumber: registrationData.contactNumber || student.contactNumber,
                currentYearLevel: parseInt(registrationData.yearLevel) || student.currentYearLevel,
                currentSemester: parseInt(registrationData.semester) || student.currentSemester,
                yearOfEntry: new Date().getFullYear()
            });
            console.log('✅ Updated existing student record:', student.id);
        }

        // Create student registration record with proper data types
        const studentRegistration = await StudentRegistrationModel.create({
            userId: userId,
            studentId: student.id.toString(),
            firstName: user.firstName,
            middleName: user.middleName || '',
            lastName: user.lastName,
            dateOfBirth: registrationData.dateOfBirth || '',
            placeOfBirth: registrationData.placeOfBirth || '',
            gender: registrationData.gender || 'N/A',
            maritalStatus: registrationData.maritalStatus || 'Single',
            nationality: registrationData.nationality || 'Filipino',
            religion: registrationData.religion || '',
            email: registrationData.email || user.email || '',
            contactNumber: registrationData.contactNumber || '',
            cityAddress: registrationData.cityAddress || '',
            cityTelNumber: registrationData.cityTelNumber || '',
            provincialAddress: registrationData.provincialAddress || '',
            provincialTelNumber: registrationData.provincialTelNumber || '',
            fatherName: registrationData.fatherName || '',
            fatherAddress: registrationData.fatherAddress || '',
            fatherOccupation: registrationData.fatherOccupation || '',
            fatherCompany: registrationData.fatherCompany || '',
            fatherContactNumber: registrationData.fatherContactNumber || '',
            fatherIncome: registrationData.fatherIncome || '',
            motherName: registrationData.motherName || '',
            motherAddress: registrationData.motherAddress || '',
            motherOccupation: registrationData.motherOccupation || '',
            motherCompany: registrationData.motherCompany || '',
            motherContactNumber: registrationData.motherContactNumber || '',
            motherIncome: registrationData.motherIncome || '',
            guardianName: registrationData.guardianName || '',
            guardianAddress: registrationData.guardianAddress || '',
            guardianOccupation: registrationData.guardianOccupation || '',
            guardianCompany: registrationData.guardianCompany || '',
            guardianContactNumber: registrationData.guardianContactNumber || '',
            guardianIncome: registrationData.guardianIncome || '',
            yearLevel: registrationData.yearLevel || '1st Year',
            semester: registrationData.semester || 'First Semester',
            schoolYear: registrationData.schoolYear || new Date().getFullYear().toString(),
            applicationType: registrationData.applicationType || 'Freshmen',
            studentType: registrationData.studentType || 'First',
            elementarySchool: registrationData.elementarySchool || '',
            elementaryAddress: registrationData.elementaryAddress || '',
            elementaryHonor: registrationData.elementaryHonor || '',
            elementaryYearGraduated: registrationData.elementaryYearGraduated ? parseInt(registrationData.elementaryYearGraduated) || undefined : undefined,
            juniorHighSchool: registrationData.juniorHighSchool || '',
            juniorHighAddress: registrationData.juniorHighAddress || '',
            juniorHighHonor: registrationData.juniorHighHonor || '',
            juniorHighYearGraduated: registrationData.juniorHighYearGraduated ? parseInt(registrationData.juniorHighYearGraduated) || undefined : undefined,
            seniorHighSchool: registrationData.seniorHighSchool || '',
            seniorHighAddress: registrationData.seniorHighAddress || '',
            seniorHighStrand: registrationData.seniorHighStrand || '',
            seniorHighHonor: registrationData.seniorHighHonor || '',
            seniorHighYearGraduated: registrationData.seniorHighYearGraduated ? parseInt(registrationData.seniorHighYearGraduated) || undefined : undefined,
            ncaeGrade: registrationData.ncaeGrade || '',
            specialization: registrationData.specialization || '',
            lastCollegeAttended: registrationData.lastCollegeAttended || '',
            lastCollegeYearTaken: registrationData.lastCollegeYearTaken ? parseInt(registrationData.lastCollegeYearTaken) || undefined : undefined,
            lastCollegeCourse: registrationData.lastCollegeCourse || '',
            lastCollegeMajor: registrationData.lastCollegeMajor || '',
            course: 'Bachelor of Science in Information Technology',
            major: 'Information Technology',
            registrationStatus: 'Approved'
        });

        console.log('✅ Created student registration record:', studentRegistration.id);

        res.status(201).json({
            message: 'Student registration completed successfully',
            studentId: student.id,
            registrationId: studentRegistration.id,
            status: 'Enrolled'
        });

    } catch (error) {
        console.error('❌ Error completing student registration:', error);
        res.status(500).json({ 
            message: 'Failed to complete student registration',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator'
        });
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

export const updateStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const user = await UserModel.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'Student user account not found.' });
            return;
        }

        // Update user data
        await user.update({
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            middleName: updateData.middleName,
            email: updateData.email,
        });

        // Update student details if they exist
        const studentDetails = await StudentModel.findOne({ where: { userId: id } });
        if (studentDetails) {
            await studentDetails.update({
                gender: updateData.gender,
                contactNumber: updateData.contactNumber,
                cityAddress: updateData.cityAddress,
                provincialAddress: updateData.provincialAddress,
                // Add other fields as needed
            });
        }

        res.json({ message: 'Student updated successfully.' });
    } catch (error) {
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

        // Check if user already exists
        const existingUser = await UserModel.findOne({ where: { idNumber } });
        if (existingUser) {
            res.status(409).json({ message: `The School ID '${idNumber}' is already registered. Please use a different School ID.` });
            return;
        }

        // Create user account
        const newUser = await UserModel.create({
            idNumber,
            password,
            role: 'student',
            firstName,
            lastName,
            middleName: middleName || '',
            isActive: true
        });

        res.status(201).json({
            message: 'Student registration completed successfully! You can now login with your School ID and password.',
            studentId: idNumber,
            firstName,
            lastName,
            redirectTo: '/student-homepage'
        });
    } catch (error) {
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

export const searchUserByIdNumber = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { idNumber } = req.params;
        console.log('🔍 Searching for user with ID number:', idNumber);
        
        const user = await UserModel.findOne({ 
            where: { idNumber },
            attributes: ['id', 'idNumber', 'firstName', 'lastName', 'middleName', 'email', 'phoneNumber', 'role']
        });

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

export const updateStudentRegistration = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        
        console.log('🔍 Updating student registration for userId:', userId);
        console.log('🔍 Update data received:', updateData);

        // Find the user
        const user = await UserModel.findByPk(parseInt(userId, 10));
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Find the student registration record
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: parseInt(userId, 10) },
            order: [['createdAt', 'DESC']]
        });

        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }

        // Update the student registration data
        await studentRegistration.update(updateData);
        console.log('✅ Student registration updated successfully');

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

// Update all approved registrations to "Enrolled" status
export const updateApprovedRegistrationsToEnrolled = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔄 Checking current registration statuses...');
        
        // Get all registrations with their current status
        const allRegistrations = await StudentRegistrationModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        console.log(`📋 Found ${allRegistrations.length} total registrations`);
        
        // Show current status distribution
        const statusCounts = allRegistrations.reduce((acc, reg) => {
            acc[reg.registrationStatus] = (acc[reg.registrationStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        console.log('📊 Current status distribution:', statusCounts);
        
        // Find registrations that should be considered "enrolled" (have student records)
        const enrolledRegistrations = [];
        
        for (const registration of allRegistrations) {
            // Check if this student has a student record (meaning they're enrolled)
            const student = await StudentModel.findOne({
                where: { userId: registration.userId }
            });
            
            if (student && registration.registrationStatus === 'Pending') {
                // Update to "Approved" since they have a student record
                await registration.update({ registrationStatus: 'Approved' });
                enrolledRegistrations.push(registration);
                console.log(`✅ Updated ${registration.firstName} ${registration.lastName} to "Approved" (enrolled)`);
            }
        }
        
        console.log(`✅ Successfully updated ${enrolledRegistrations.length} registrations to "Approved" status`);
        
        res.json({ 
            message: `Updated ${enrolledRegistrations.length} registrations to "Approved" status`,
            note: 'Note: Database uses "Approved" status for enrolled students. Frontend can display this as "Enrolled".',
            updatedCount: enrolledRegistrations.length,
            currentStatusDistribution: statusCounts,
            updatedRegistrations: enrolledRegistrations.map(r => ({
                id: r.id,
                firstName: r.firstName,
                lastName: r.lastName,
                registrationStatus: r.registrationStatus
            }))
        });
        
    } catch (error) {
        console.error('❌ Error updating registrations:', error);
        next(error);
    }
};