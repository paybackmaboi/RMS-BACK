import { Request, Response, NextFunction } from 'express';
import { User, Student, Course } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
    };
}

// Helper function to generate a unique ID Number
const generateIdNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const lastUser = await User.findOne({
        where: { idNumber: { [require('sequelize').Op.like]: `${currentYear}-%` } },
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
        
        const newUser = await User.create({
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

        const student = await Student.findOne({ where: { userId } });
        res.json({ isRegistered: !!student });

    } catch (error) {
        next(error);
    }
};

export const getAllStudents = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const students = await User.findAll({
            where: { role: 'student', isActive: true },
            include: [
                {
                    model: Student,
                    as: 'studentDetails',
                    include: [
                        {
                            model: Course,
                            as: 'course'
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedStudents = students.map(student => {
            const studentDetails = student.get('studentDetails') as any;
            return {
                id: student.id,
                idNumber: student.idNumber,
                firstName: student.firstName,
                lastName: student.lastName,
                middleName: student.middleName,
                email: student.email,
                phoneNumber: student.phoneNumber,
                isRegistered: !!studentDetails,
                course: studentDetails?.course?.name || 'Not registered',
                studentNumber: studentDetails?.studentNumber || null,
                fullName: studentDetails?.fullName || `${student.firstName} ${student.lastName}`,
                academicStatus: studentDetails?.academicStatus || 'Not registered'
            };
        });

        res.json(formattedStudents);
    } catch (error) {
        console.error('Error fetching all students:', error);
        next(error);
    }
};

export const getStudentDetails = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const student = await User.findByPk(id, {
            include: [
                {
                    model: Student,
                    as: 'studentDetails',
                    include: [
                        {
                            model: Course,
                            as: 'course'
                        }
                    ]
                }
            ]
        });

        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        res.json(student);
    } catch (error) {
        next(error);
    }
};

export const updateStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const student = await User.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // Update user data
        await student.update(updateData);

        // Update student details if they exist
        const studentDetails = await Student.findOne({ where: { userId: id } });
        if (studentDetails) {
            await studentDetails.update(updateData);
        }

        res.json({ message: 'Student updated successfully.' });
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const student = await User.findByPk(id);
        if (!student) {
            res.status(404).json({ message: 'Student not found.' });
            return;
        }

        // Soft delete by setting isActive to false
        await student.update({ isActive: false });

        // Also soft delete student details if they exist
        const studentDetails = await Student.findOne({ where: { userId: id } });
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
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const {
            // I. PERSONAL DATA
            fullName,
            gender,
            maritalStatus,
            dateOfBirth,
            placeOfBirth,
            email,
            contactNumber,
            religion,
            citizenship,
            country,
            acrNumber,
            cityAddress,
            cityTelNumber,
            provincialAddress,
            provincialTelNumber,
            
            // II. FAMILY BACKGROUND
            // Father's Information
            fatherName,
            fatherAddress,
            fatherOccupation,
            fatherCompany,
            fatherContactNumber,
            fatherIncome,
            
            // Mother's Information
            motherName,
            motherAddress,
            motherOccupation,
            motherCompany,
            motherContactNumber,
            motherIncome,
            
            // Guardian's Information
            guardianName,
            guardianAddress,
            guardianOccupation,
            guardianCompany,
            guardianContactNumber,
            guardianIncome,
            
            // III. CURRENT ACADEMIC BACKGROUND
            courseId,
            major,
            studentType,
            semesterEntry,
            yearOfEntry,
            estimatedYearOfGraduation,
            applicationType,
            
            // IV. ACADEMIC HISTORY
            // Elementary
            elementarySchool,
            elementaryAddress,
            elementaryHonor,
            elementaryYearGraduated,
            
            // Junior High School
            juniorHighSchool,
            juniorHighAddress,
            juniorHighHonor,
            juniorHighYearGraduated,
            
            // Senior High School
            seniorHighSchool,
            seniorHighAddress,
            seniorHighStrand,
            seniorHighHonor,
            seniorHighYearGraduated,
            
            // Additional Academic Information
            ncaeGrade,
            specialization,
            lastCollegeAttended,
            lastCollegeYearTaken,
            lastCollegeCourse,
            lastCollegeMajor
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'fullName', 'gender', 'maritalStatus', 'dateOfBirth', 'placeOfBirth',
            'email', 'contactNumber', 'religion', 'citizenship', 'country',
            'cityAddress', 'provincialAddress', 'fatherName', 'fatherAddress',
            'fatherOccupation', 'fatherContactNumber', 'motherName', 'motherAddress',
            'motherOccupation', 'motherContactNumber', 'guardianName', 'guardianAddress',
            'guardianOccupation', 'guardianContactNumber', 'studentType',
            'semesterEntry', 'yearOfEntry', 'applicationType'
            // Removed courseId, elementary, junior high, and senior high requirements
            // since this is tertiary level only and course can be selected later
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                res.status(400).json({ message: `${field} is required` });
                return;
            }
        }

        // Generate student number
        const studentNumber = `STU${Date.now()}`;

        // Create student record with ALL fields from SPR form
        const student = await Student.create({
            userId,
            courseId: courseId ? parseInt(courseId) : null, // Make courseId optional
            studentNumber,
            
            // I. PERSONAL DATA
            fullName,
            gender,
            maritalStatus,
            dateOfBirth: new Date(dateOfBirth),
            placeOfBirth,
            email,
            contactNumber,
            religion,
            citizenship,
            country,
            acrNumber,
            cityAddress,
            cityTelNumber,
            provincialAddress,
            provincialTelNumber,
            
            // II. FAMILY BACKGROUND
            // Father's Information
            fatherName,
            fatherAddress,
            fatherOccupation,
            fatherCompany,
            fatherContactNumber,
            fatherIncome,
            
            // Mother's Information
            motherName,
            motherAddress,
            motherOccupation,
            motherCompany,
            motherContactNumber,
            motherIncome,
            
            // Guardian's Information
            guardianName,
            guardianAddress,
            guardianOccupation,
            guardianCompany,
            guardianContactNumber,
            guardianIncome,
            
            // III. CURRENT ACADEMIC BACKGROUND
            major,
            studentType,
            semesterEntry,
            yearOfEntry: parseInt(yearOfEntry),
            estimatedYearOfGraduation: estimatedYearOfGraduation ? parseInt(estimatedYearOfGraduation) : null,
            applicationType,
            
            // IV. ACADEMIC HISTORY
            // Elementary
            elementarySchool,
            elementaryAddress,
            elementaryHonor,
            elementaryYearGraduated: parseInt(elementaryYearGraduated),
            
            // Junior High School
            juniorHighSchool,
            juniorHighAddress,
            juniorHighHonor,
            juniorHighYearGraduated: parseInt(juniorHighYearGraduated),
            
            // Senior High School
            seniorHighSchool,
            seniorHighAddress,
            seniorHighStrand,
            seniorHighHonor,
            seniorHighYearGraduated: parseInt(seniorHighYearGraduated),
            
            // Additional Academic Information
            ncaeGrade,
            specialization,
            lastCollegeAttended,
            lastCollegeYearTaken: lastCollegeYearTaken ? parseInt(lastCollegeYearTaken) : null,
            lastCollegeCourse,
            lastCollegeMajor,
            
            // Academic Status
            academicStatus: 'Regular',
            currentYearLevel: 1,
            currentSemester: 1,
            totalUnitsEarned: 0,
            cumulativeGPA: 0.00,
            isActive: true
        });

        res.status(201).json({
            message: 'Student registration completed successfully',
            student: {
                id: student.id,
                studentNumber: student.studentNumber,
                fullName: student.fullName,
                courseId: student.courseId
            }
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
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Check if student record exists
        const student = await Student.findOne({ where: { userId } });
        
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