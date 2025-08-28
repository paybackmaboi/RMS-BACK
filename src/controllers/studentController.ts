import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';

// FIX: Import INITIALIZED MODELS from the central database file for queries
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

// FIX: Import the model CLASSES directly from their source files for TypeScript typing
import { User } from '../models/User';
import { BsitCurriculum } from '../models/BsitCurriculum';
import { StudentRegistration } from '../models/StudentRegistration';


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
        const userId = (req as ExpressRequest).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const registrationData = req.body;
        
        console.log('📝 Student completing registration for user ID:', userId);
        console.log('📝 Registration data:', registrationData);

        const user = await UserModel.findByPk(userId);
        if (!user || user.role !== 'student') {
            res.status(404).json({ message: 'Student user not found' });
            return;
        }

        let student = await StudentModel.findOne({ where: { userId: userId } });
        
        if (!student) {
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
                elementaryYearGraduated: registrationData.elementaryYearGraduated ? parseInt(registrationData.elementaryYearGraduated) : undefined,
                juniorHighSchool: registrationData.juniorHighSchool || '',
                juniorHighYearGraduated: registrationData.juniorHighYearGraduated ? parseInt(registrationData.juniorHighYearGraduated) : undefined,
                seniorHighSchool: registrationData.seniorHighSchool || '',
                seniorHighYearGraduated: registrationData.seniorHighYearGraduated ? parseInt(registrationData.seniorHighYearGraduated) : undefined,
                seniorHighStrand: registrationData.seniorHighStrand || '',
                lastCollegeAttended: registrationData.lastCollegeAttended || '',
                lastCollegeYearTaken: registrationData.lastCollegeYearTaken ? parseInt(registrationData.lastCollegeYearTaken) : undefined,
                lastCollegeCourse: registrationData.lastCollegeCourse || '',
                lastCollegeMajor: registrationData.lastCollegeMajor || ''
            });
            console.log('✅ Created new student record:', student.id);
        } else {
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

        const studentRegistration = await StudentRegistrationModel.create({
            userId: userId,
            studentId: student.id.toString(),
            firstName: user.firstName,
            middleName: user.middleName || '',
            lastName: user.lastName,
            dateOfBirth: registrationData.dateOfBirth || null,
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
            elementaryYearGraduated: registrationData.elementaryYearGraduated ? parseInt(registrationData.elementaryYearGraduated) : undefined,
            juniorHighSchool: registrationData.juniorHighSchool || '',
            juniorHighAddress: registrationData.juniorHighAddress || '',
            juniorHighHonor: registrationData.juniorHighHonor || '',
            juniorHighYearGraduated: registrationData.juniorHighYearGraduated ? parseInt(registrationData.juniorHighYearGraduated) : undefined,
            seniorHighSchool: registrationData.seniorHighSchool || '',
            seniorHighAddress: registrationData.seniorHighAddress || '',
            seniorHighStrand: registrationData.seniorHighStrand || '',
            seniorHighHonor: registrationData.seniorHighHonor || '',
            seniorHighYearGraduated: registrationData.seniorHighYearGraduated ? parseInt(registrationData.seniorHighYearGraduated) : undefined,
            ncaeGrade: registrationData.ncaeGrade || '',
            specialization: registrationData.specialization || '',
            lastCollegeAttended: registrationData.lastCollegeAttended || '',
            lastCollegeYearTaken: registrationData.lastCollegeYearTaken ? parseInt(registrationData.lastCollegeYearTaken) : undefined,
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
            order: [['createdAt', 'DESC']]
        });

        const studentsWithDetails = await Promise.all(students.map(async (student: User) => {
            const registration = await StudentRegistrationModel.findOne({
                where: { userId: student.id },
                order: [['createdAt', 'DESC']]
            });
            
            const studentDetails = await StudentModel.findOne({
                where: { userId: student.id }
            });

            const enrollmentCount = studentDetails ? await StudentEnrollmentModel.count({
                where: { studentId: studentDetails.id }
            }) : 0;

            let totalUnits = 0;
            if (registration) {
                const curriculum = await BsitCurriculumModel.findAll({
                    where: {
                        yearLevel: registration.yearLevel,
                        semester: registration.semester,
                        isActive: true
                    }
                });
                totalUnits = curriculum.reduce((sum: number, course: BsitCurriculum) => sum + course.units, 0);
            }

            return {
                id: student.id,
                idNumber: student.idNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName,
                gender: studentDetails?.gender || 'N/A',
                email: student.email,
                phoneNumber: student.phoneNumber,
                profilePhoto: student.profilePhoto || null,
                course: 'Bachelor of Science in Information Technology',
                registrationStatus: registration?.registrationStatus || 'Not registered',
                registrationDate: registration ? new Date(registration.createdAt).toISOString().split('T')[0] : 'N/A'
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
        const student = await UserModel.findByPk(id);

        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        const studentRegistration = await StudentRegistrationModel.findOne({ where: { userId: id }, order: [['createdAt', 'DESC']] });
        const studentDetails = await StudentModel.findOne({ where: { userId: id } });

        const studentData = {
            ...student.toJSON(),
            studentDetails: studentDetails ? studentDetails.toJSON() : null,
            registration: studentRegistration ? studentRegistration.toJSON() : null
        };

        res.json(studentData);
    } catch (error) {
        console.error('Error in getStudentDetails:', error);
        next(error);
    }
};

export const getStudentRegistrationData = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });

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

export const getStudentEnrolledSubjects = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const studentRegistration = await StudentRegistrationModel.findOne({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });

        if (!studentRegistration) {
            res.status(404).json({ message: 'Student registration not found' });
            return;
        }

        const { yearLevel, semester } = studentRegistration;
        const curriculum = await BsitCurriculumModel.findAll({
            where: { yearLevel, semester, isActive: true },
            order: [['courseCode', 'ASC']]
        });

        const subjects = curriculum.map(course => ({
            id: course.id,
            courseCode: course.courseCode,
            courseTitle: course.courseDescription,
            units: course.units,
            isEnrolled: true,
            status: 'Enrolled'
        }));

        res.json({
            yearLevel,
            semester,
            totalUnits: subjects.reduce((sum: number, sub: { units: number }) => sum + sub.units, 0),
            subjects
        });
    } catch (error) {
        console.error('Error fetching student enrolled subjects:', error);
        next(error);
    }
};

export const createAndEnrollStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { firstName, lastName, middleName } = req.body;
        const idNumber = await generateIdNumber();
        const password = generatePassword();
        
        const newUser = await UserModel.create({ idNumber, password, role: 'student', firstName, lastName, middleName, isActive: true });
        
        res.status(201).json({
            message: 'Student account created successfully!',
            user: { id: newUser.id, idNumber: newUser.idNumber, password: password, name: `${lastName}, ${firstName} ${middleName || ''}`.trim() },
        });

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

        await user.update(updateData);
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

        await student.update({ isActive: false });
        res.json({ message: 'Student deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

export const updateApprovedRegistrationsToEnrolled = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allRegistrations = await StudentRegistrationModel.findAll({ order: [['createdAt', 'DESC']] });
        
        const statusCounts = allRegistrations.reduce((acc: Record<string, number>, reg: StudentRegistration) => {
            acc[reg.registrationStatus] = (acc[reg.registrationStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        let updatedCount = 0;
        for (const registration of allRegistrations) {
            const student = await StudentModel.findOne({ where: { userId: registration.userId } });
            if (student && registration.registrationStatus !== 'Approved') {
                await registration.update({ registrationStatus: 'Approved' });
                updatedCount++;
            }
        }
        
        res.json({ 
            message: `Updated ${updatedCount} registrations to "Approved" status`,
            updatedCount
        });
        
    } catch (error) {
        console.error('❌ Error updating registrations:', error);
        next(error);
    }
};