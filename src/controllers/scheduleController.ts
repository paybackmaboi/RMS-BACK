import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../database';
import { QueryTypes } from 'sequelize';

// Get student's subject schedule for current semester
export const getStudentSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const { yearLevel, semester, schoolYear } = req.query;
        
        console.log('📅 Fetching schedule for:', { userId, yearLevel, semester, schoolYear });

        const scheduleQuery = `
            SELECT 
                sub.id as subjectId,
                sub.courseCode,
                sub.courseDescription,
                sub.units,
                sub.courseType,
                sub.prerequisites,
                s.id as scheduleId,
                s.dayOfWeek,
                s.startTime,
                s.endTime,
                s.room,
                s.isActive as scheduleActive,
                sy.year as schoolYearName,
                sem.name as semesterName
            FROM subjects sub
            LEFT JOIN schedules s ON sub.id = s.subjectId
            LEFT JOIN school_years sy ON s.schoolYearId = sy.id
            LEFT JOIN semesters sem ON s.semesterId = sem.id
            WHERE sub.yearLevel = ? 
                AND sub.semester = ? 
                AND sub.isActive = TRUE
                AND sy.year = ?
            ORDER BY 
                sub.courseCode ASC,
                sub.courseType ASC
        `;

        const scheduleData = await sequelize.query(scheduleQuery, {
            replacements: [
                yearLevel || '1st Year', 
                semester || '1st Semester', 
                schoolYear || '2025-2026'
            ],
            type: QueryTypes.SELECT
        }) as any[];

        // **FIX:** Group by unique subjectId to separate Lec and Lab
        const groupedSubjects = new Map<number, {
            subjectId: number;
            courseCode: string;
            courseDescription: string;
            units: number;
            courseType: string;
            prerequisites: string;
            schedules: any[];
        }>();
        
        scheduleData.forEach((item: any) => {
            const key = item.subjectId; // Use unique subjectId as the key
            
            if (!groupedSubjects.has(key)) {
                groupedSubjects.set(key, {
                    subjectId: item.subjectId,
                    courseCode: item.courseCode,
                    courseDescription: item.courseDescription,
                    units: item.units,
                    courseType: item.courseType,
                    prerequisites: item.prerequisites,
                    schedules: []
                });
            }
            
            if (item.scheduleId) {
                groupedSubjects.get(key)!.schedules.push({
                    id: item.scheduleId,
                    day: item.dayOfWeek,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    room: item.room,
                    instructor: 'TBA',
                    scheduleStatus: item.scheduleActive ? 'Open' : 'Closed'
                });
            }
        });

        const subjectsWithSchedules = Array.from(groupedSubjects.values()).map(subject => ({
            ...subject,
            hasSchedule: subject.schedules.length > 0
        }));

        const totalUnits = subjectsWithSchedules.reduce((sum, subject) => sum + subject.units, 0);
        const totalSubjects = subjectsWithSchedules.length;
        const scheduledSubjects = subjectsWithSchedules.filter(s => s.hasSchedule).length;

        res.json({
            yearLevel, semester, schoolYear,
            totalUnits, totalSubjects, scheduledSubjects,
            subjects: subjectsWithSchedules
        });

    } catch (error) {
        console.error('❌ Error fetching student schedule:', error);
        res.status(500).json({ 
            message: 'Internal server error occurred while fetching schedule',
            error: (error as Error).message
        });
    }
};

// Get all available schedules for admin view
export const getAllSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { yearLevel, semester, schoolYear } = req.query;
        
        console.log('📅 Admin fetching all schedules for:', { yearLevel, semester, schoolYear });

        const query = `
            SELECT 
                sub.id as subjectId,
                sub.courseCode,
                sub.courseDescription,
                sub.units,
                sub.courseType,
                sub.prerequisites,
                sub.yearLevel,
                sub.semester as semesterName,
                s.id as scheduleId,
                s.dayOfWeek,
                s.startTime,
                s.endTime,
                s.room,
                s.maxStudents,
                s.currentEnrolled,
                s.isActive as scheduleActive,
                sy.year as schoolYearName,
                COALESCE(enrollment_counts.enrolled_count, 0) as actualEnrolledCount
            FROM subjects sub
            LEFT JOIN schedules s ON sub.id = s.subjectId
            LEFT JOIN school_years sy ON s.schoolYearId = sy.id
            LEFT JOIN semesters sem ON s.semesterId = sem.id
            LEFT JOIN (
                SELECT 
                    se.scheduleId,
                    COUNT(se.id) as enrolled_count
                FROM student_enrollments se
                WHERE se.enrollmentStatus = 'Enrolled'
                GROUP BY se.scheduleId
            ) enrollment_counts ON s.id = enrollment_counts.scheduleId
            WHERE sub.isActive = TRUE
                ${yearLevel ? 'AND sub.yearLevel = ?' : ''}
                ${semester ? 'AND sub.semester = ?' : ''}
                ${schoolYear ? 'AND sy.year = ?' : ''}
            ORDER BY 
                sub.yearLevel,
                sub.semester,
                sub.courseCode,
                sub.courseType`;

        const replacements = [];
        if (yearLevel) replacements.push(yearLevel);
        if (semester) replacements.push(semester);
        if (schoolYear) replacements.push(schoolYear);

        const scheduleData = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        }) as any[];

        // **FIX:** Group by year/semester, then by unique subjectId to separate Lec/Lab
        const groupedSchedules = new Map<string, {
            yearLevel: string;
            semester: string;
            subjects: Map<number, {
                subjectId: number;
                courseCode: string;
                courseDescription: string;
                units: number;
                courseType: string;
                schedules: any[];
            }>;
        }>();
        
        scheduleData.forEach((item: any) => {
            const groupKey = `${item.yearLevel}-${item.semesterName}`;
            
            if (!groupedSchedules.has(groupKey)) {
                groupedSchedules.set(groupKey, {
                    yearLevel: item.yearLevel,
                    semester: item.semesterName,
                    subjects: new Map()
                });
            }
            
            const group = groupedSchedules.get(groupKey)!;
            const subjectKey = item.subjectId; // Use unique subjectId
            
            if (!group.subjects.has(subjectKey)) {
                group.subjects.set(subjectKey, {
                    subjectId: item.subjectId,
                    courseCode: item.courseCode,
                    courseDescription: item.courseDescription,
                    units: item.units,
                    courseType: item.courseType,
                    schedules: []
                });
            }
            
            if (item.scheduleId) {
                const currentSubject = group.subjects.get(subjectKey)!;
                // Add robust check to prevent adding logically identical schedules
                 const scheduleExists = currentSubject.schedules.some(s => 
                    s.id === item.scheduleId
                );

                if (!scheduleExists) {
                    currentSubject.schedules.push({
                        id: item.scheduleId,
                        schoolYear: item.schoolYearName,
                        day: item.dayOfWeek,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        room: item.room,
                        instructor: 'TBA',
                        maxStudents: item.maxStudents || 40, // Default max students if not set
                        currentEnrollment: item.actualEnrolledCount || 0, // Use actual count from enrollment table
                        scheduleStatus: item.scheduleActive ? 'Open' : 'Closed'
                    });
                }
            }
        });

        const response = Array.from(groupedSchedules.values()).map(group => ({
            yearLevel: group.yearLevel,
            semester: group.semester,
            subjects: Array.from(group.subjects.values()).map(subject => ({
                ...subject,
                hasSchedule: subject.schedules.length > 0
            }))
        }));

        res.json(response);

    } catch (error) {
        console.error('❌ Error fetching all schedules:', error);
        res.status(500).json({ 
            message: 'Internal server error occurred while fetching schedules',
            error: (error as Error).message
        });
    }
}; 

// Get enrolled students for a specific schedule, grouped by year level
export const getScheduleEnrolledStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { scheduleId } = req.params;
        console.log('👥 Fetching enrolled students for schedule ID:', scheduleId);

        // Get enrolled students for the SPECIFIC schedule ID (not by curriculum)
        let enrolledStudents: any[] = [];
        try {
            const enrolledStudentsQuery = `
                SELECT 
                    se.id as enrollmentId,
                    se.studentId,
                    se.enrollmentDate,
                    se.enrollmentStatus,
                    se.grade,
                    se.remarks,
                    COALESCE(u.idNumber, 'N/A') as idNumber,
                    COALESCE(u.firstName, 'Unknown') as firstName,
                    COALESCE(u.lastName, 'Unknown') as lastName,
                    COALESCE(u.middleName, '') as middleName,
                    COALESCE(s.gender, 'N/A') as gender,
                    COALESCE(s.currentYearLevel, 'Unknown') as currentYearLevel,
                    COALESCE(s.currentSemester, 'Unknown') as currentSemester,
                    COALESCE(s.studentType, 'N/A') as studentType,
                    COALESCE(s.yearOfEntry, 'N/A') as yearOfEntry,
                    bs.id as actualScheduleId,
                    bs.dayOfWeek,
                    bs.startTime,
                    bs.endTime,
                    bs.room
                FROM student_enrollments se
                LEFT JOIN students s ON se.studentId = s.id
                LEFT JOIN users u ON s.userId = u.id
                LEFT JOIN schedules bs ON se.scheduleId = bs.id
                WHERE se.scheduleId = ?  -- Look for students enrolled in THIS specific schedule
                ORDER BY COALESCE(s.currentYearLevel, 'Unknown'), COALESCE(u.lastName, 'Unknown'), COALESCE(u.firstName, 'Unknown')
            `;

            enrolledStudents = await sequelize.query(enrolledStudentsQuery, {
                replacements: [scheduleId],
                type: QueryTypes.SELECT
            }) as any[];

            console.log('👥 Found enrolled students for schedule ID', scheduleId, ':', enrolledStudents.length);
            
            // Log the actual students found for debugging
            if (enrolledStudents.length > 0) {
                console.log('👥 Sample student data:', enrolledStudents[0]);
            }
        } catch (error) {
            console.log('👥 Error querying enrolled students:', error);
            enrolledStudents = [];
        }

        // If no students found, show debug information
        if (enrolledStudents.length === 0) {
            console.log('👥 No students found for schedule ID', scheduleId, ', showing debug info');
            
            try {
                // Get all enrollments for this specific schedule ID
                const allEnrollmentsQuery = `
                    SELECT 
                        se.id as enrollmentId,
                        se.studentId,
                        se.scheduleId,
                        se.enrollmentDate,
                        se.enrollmentStatus,
                        COALESCE(u.idNumber, 'N/A') as idNumber,
                        COALESCE(u.firstName, 'Unknown') as firstName,
                        COALESCE(u.lastName, 'Unknown') as lastName,
                        COALESCE(u.middleName, '') as middleName,
                        COALESCE(s.gender, 'N/A') as gender,
                        COALESCE(s.currentYearLevel, 'Unknown') as currentYearLevel,
                        COALESCE(s.currentSemester, 'Unknown') as currentSemester
                    FROM student_enrollments se
                    LEFT JOIN students s ON se.studentId = s.id
                    LEFT JOIN users u ON s.userId = u.id
                    WHERE se.scheduleId = ?
                    ORDER BY COALESCE(s.currentYearLevel, 'Unknown')
                    LIMIT 20
                `;

                const allEnrollments = await sequelize.query(allEnrollmentsQuery, {
                    replacements: [scheduleId],
                    type: QueryTypes.SELECT
                }) as any[];

                console.log('👥 All enrollments for schedule ID', scheduleId, ':', allEnrollments);

                // Return debugging information
                const response = [{
                    yearLevel: 'Debug Info',
                    count: 0,
                    students: [],
                    message: `No students found for schedule ID: ${scheduleId}`,
                    debug: {
                        requestedScheduleId: scheduleId,
                        totalEnrollments: allEnrollments.length,
                        sampleEnrollments: allEnrollments.slice(0, 5),
                        note: 'This schedule ID exists but has no enrolled students'
                    }
                }];
                
                console.log('👥 Sending debug response');
                res.json(response);
                return;
            } catch (error) {
                console.log('👥 Error getting debug info:', error);
            }
        }

        // Group students by year level
        const studentsByYearLevel = new Map<string, {
            yearLevel: string;
            count: number;
            students: any[];
        }>();
        
        enrolledStudents.forEach((student: any) => {
            const yearLevel = student.currentYearLevel || 'Unknown';
            
            if (!studentsByYearLevel.has(yearLevel)) {
                studentsByYearLevel.set(yearLevel, {
                    yearLevel: yearLevel,
                    count: 0,
                    students: []
                });
            }
            
            const yearGroup = studentsByYearLevel.get(yearLevel)!;
            yearGroup.count++;
            yearGroup.students.push({
                id: student.studentId,
                idNumber: student.idNumber,
                fullName: `${student.lastName}, ${student.firstName} ${student.middleName || ''}`.trim(),
                gender: student.gender,
                yearLevel: student.currentYearLevel,
                semester: student.currentSemester,
                studentType: student.studentType,
                enrollmentDate: student.enrollmentDate,
                enrollmentStatus: student.enrollmentStatus,
                yearOfEntry: student.yearOfEntry,
                grade: student.grade,
                remarks: student.remarks,
                actualScheduleId: student.actualScheduleId,
                day: student.dayOfWeek,
                startTime: student.startTime,
                endTime: student.endTime,
                room: student.room,
                instructor: 'TBA'
            });
        });

        // Get schedule details
        let scheduleDetails = null;
        try {
            const scheduleDetailsQuery = `
                SELECT 
                    s.id,
                    s.dayOfWeek,
                    s.startTime,
                    s.endTime,
                    s.room,
                    s.currentEnrolled,
                    s.maxStudents,
                    sub.courseCode,
                    sub.courseDescription,
                    sub.units,
                    sub.courseType,
                    sub.yearLevel,
                    sub.semester,
                    sy.year as schoolYear
                FROM schedules s
                JOIN subjects sub ON s.subjectId = sub.id
                JOIN school_years sy ON s.schoolYearId = sy.id
                WHERE s.id = ?
            `;
            
            const scheduleResult = await sequelize.query(scheduleDetailsQuery, {
                replacements: [scheduleId],
                type: QueryTypes.SELECT
            }) as any[];
            
            if (scheduleResult.length > 0) {
                scheduleDetails = scheduleResult[0];
                console.log('📅 Schedule details found:', scheduleDetails);
            }
        } catch (error) {
            console.error('❌ Error fetching schedule details:', error);
        }

        // Convert to array format and sort by year level
        const response = Array.from(studentsByYearLevel.values())
            .sort((a, b) => {
                const yearOrder: { [key: string]: number } = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4 };
                return (yearOrder[a.yearLevel] || 999) - (yearOrder[b.yearLevel] || 999);
            });

        console.log('👥 Sending grouped students response with schedule details:', response);
        res.json({
            students: response,
            scheduleDetails: scheduleDetails
        });

    } catch (error) {
        console.error('❌ Error fetching enrolled students:', error);
        res.status(500).json({ 
            message: 'Internal server error occurred while fetching enrolled students',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator',
            details: 'This might be due to missing database tables or incorrect table structure'
        });
    }
}; 

// Function to update enrollment counts in schedules table
export const updateEnrollmentCounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔄 Updating enrollment counts in schedules table...');
        
        // Update all schedules with actual enrollment counts
        const updateQuery = `
            UPDATE schedules s
            SET currentEnrolled = (
                SELECT COALESCE(COUNT(se.id), 0)
                FROM student_enrollments se
                WHERE se.scheduleId = s.id
                AND se.enrollmentStatus = 'Enrolled'
            )
        `;
        
        const result = await sequelize.query(updateQuery, {
            type: QueryTypes.UPDATE
        });
        
        console.log('✅ Enrollment counts updated successfully');
        
        res.json({
            message: 'Enrollment counts updated successfully',
            updatedSchedules: 'All schedules updated'
        });
        
    } catch (error) {
        console.error('❌ Error updating enrollment counts:', error);
        res.status(500).json({ 
            message: 'Error updating enrollment counts',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator'
        });
    }
};

// Helper function to update enrollment counts for a specific schedule
export const updateScheduleEnrollmentCount = async (scheduleId: number): Promise<void> => {
    try {
        const updateQuery = `
            UPDATE schedules 
            SET currentEnrolled = (
                SELECT COALESCE(COUNT(se.id), 0)
                FROM student_enrollments se
                WHERE se.scheduleId = ?
                AND se.enrollmentStatus = 'Enrolled'
            )
            WHERE id = ?
        `;
        
        await sequelize.query(updateQuery, {
            replacements: [scheduleId, scheduleId],
            type: QueryTypes.UPDATE
        });
        
        console.log(`✅ Updated enrollment count for schedule ${scheduleId}`);
    } catch (error) {
        console.error(`❌ Error updating enrollment count for schedule ${scheduleId}:`, error);
    }
};

// Function to get enrollment statistics for debugging
export const getEnrollmentStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('📊 Getting enrollment statistics...');
        
        // Get total enrollments
        const totalEnrollments = await sequelize.query(`
            SELECT COUNT(*) as count FROM student_enrollments WHERE enrollmentStatus = 'Enrolled'
        `, { type: QueryTypes.SELECT }) as any[];
        
        // Get enrollments by schedule
        const enrollmentsBySchedule = await sequelize.query(`
            SELECT 
                s.id as scheduleId,
                sub.courseCode,
                sub.courseDescription,
                sub.courseType,
                s.currentEnrolled,
                COUNT(se.id) as actualEnrolled
            FROM schedules s
            LEFT JOIN subjects sub ON s.subjectId = sub.id
            LEFT JOIN student_enrollments se ON s.id = se.scheduleId AND se.enrollmentStatus = 'Enrolled'
            GROUP BY s.id, sub.courseCode, sub.courseDescription, sub.courseType, s.currentEnrolled
            ORDER BY sub.courseCode, sub.courseType
        `, { type: QueryTypes.SELECT });
        
        // Get students with enrollments
        const studentsWithEnrollments = await sequelize.query(`
            SELECT 
                u.idNumber,
                u.firstName,
                u.lastName,
                COUNT(se.id) as enrollmentCount
            FROM users u
            JOIN students s ON u.id = s.userId
            JOIN student_enrollments se ON s.id = se.studentId
            WHERE se.enrollmentStatus = 'Enrolled'
            GROUP BY u.id, u.idNumber, u.firstName, u.lastName
            ORDER BY u.lastName, u.firstName
        `, { type: QueryTypes.SELECT });
        
        res.json({
            totalEnrollments: totalEnrollments[0].count,
            enrollmentsBySchedule,
            studentsWithEnrollments,
            message: 'Enrollment statistics retrieved successfully'
        });
        
    } catch (error) {
        console.error('❌ Error getting enrollment statistics:', error);
        res.status(500).json({ 
            message: 'Error getting enrollment statistics',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator'
        });
    }
};

// Diagnostic function to check database structure
export const checkDatabaseStructure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('🔍 Checking database structure...');
        
        // Get all tables in the database
        const tablesQuery = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE()
            ORDER BY table_name
        `;
        
        const tables = await sequelize.query(tablesQuery, {
            type: QueryTypes.SELECT
        }) as any[];
        
        console.log('🔍 Available tables:', tables.map(t => t.table_name));
        
        // Check specific tables we need
        const requiredTables = ['users', 'students', 'student_enrollments', 'subjects', 'schedules'];
        const tableStatus: { [key: string]: any } = {};
        
        for (const tableName of requiredTables) {
            try {
                const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
                const result = await sequelize.query(countQuery, {
                    type: QueryTypes.SELECT
                }) as any[];
                tableStatus[tableName] = {
                    exists: true,
                    recordCount: result[0]?.count || 0
                };
            } catch (error) {
                tableStatus[tableName] = {
                    exists: false,
                    error: (error as Error).message
                };
            }
        }
        
        res.json({
            message: 'Database structure check completed',
            availableTables: tables.map(t => t.table_name),
            requiredTables: tableStatus
        });
        
    } catch (error) {
        console.error('❌ Error checking database structure:', error);
        res.status(500).json({ 
            message: 'Error checking database structure',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator'
        });
    }
}; 