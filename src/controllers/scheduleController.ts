import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../database';
import { QueryTypes } from 'sequelize';

// Get student's subject schedule for current semester
export const getStudentSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;
        const { yearLevel, semester, schoolYear } = req.query;
        
        console.log('📅 Fetching schedule for:', { userId, yearLevel, semester, schoolYear });

        // Build the query to get curriculum and schedule data
        const scheduleQuery = `
            SELECT 
                c.id as curriculumId,
                c.courseCode,
                c.courseDescription,
                c.units,
                c.courseType,
                c.prerequisites,
                s.id as scheduleId,
                s.day,
                s.startTime,
                s.endTime,
                s.room,
                s.instructor,
                s.maxStudents,
                s.currentEnrollment,
                s.scheduleStatus,
                s.remarks
            FROM bsit_curriculum c
            LEFT JOIN bsit_schedules s ON c.id = s.curriculumId 
                AND s.schoolYear = ? 
                AND s.semester = ? 
                AND s.yearLevel = ?
            WHERE c.yearLevel = ? 
                AND c.semester = ? 
                AND c.isActive = TRUE
            ORDER BY 
                CASE s.day 
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                    ELSE 8
                END,
                s.startTime ASC,
                c.courseCode ASC
        `;

        const scheduleData = await sequelize.query(scheduleQuery, {
            replacements: [schoolYear || '2025-2026', semester || '1st', yearLevel || '1st', yearLevel || '1st', semester || '1st'],
            type: QueryTypes.SELECT
        }) as any[];

        console.log('📅 Found schedule entries:', scheduleData.length);

        // Group subjects by course code (combining lecture and lab)
        const groupedSubjects = new Map<string, {
            courseCode: string;
            courseDescription: string;
            units: number;
            courseType: string;
            prerequisites: string;
            schedules: any[];
        }>();
        
        scheduleData.forEach((item: any) => {
            const key = item.courseCode;
            
            if (!groupedSubjects.has(key)) {
                groupedSubjects.set(key, {
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
                    day: item.day,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    room: item.room,
                    instructor: item.instructor,
                    maxStudents: item.maxStudents,
                    currentEnrollment: item.currentEnrollment,
                    scheduleStatus: item.scheduleStatus,
                    remarks: item.remarks
                });
            }
        });

        // Convert to array and add schedule summary
        const subjectsWithSchedules = Array.from(groupedSubjects.values()).map(subject => {
            const totalUnits = subject.units;
            const hasSchedule = subject.schedules.length > 0;
            
            return {
                ...subject,
                hasSchedule,
                totalUnits,
                scheduleSummary: hasSchedule ? `${subject.schedules.length} schedule(s)` : 'No schedule assigned'
            };
        });

        // Calculate totals
        const totalUnits = subjectsWithSchedules.reduce((sum, subject) => sum + subject.totalUnits, 0);
        const totalSubjects = subjectsWithSchedules.length;
        const scheduledSubjects = subjectsWithSchedules.filter(s => s.hasSchedule).length;

        const response = {
            yearLevel: yearLevel || '1st',
            semester: semester || '1st',
            schoolYear: schoolYear || '2025-2026',
            totalUnits,
            totalSubjects,
            scheduledSubjects,
            subjects: subjectsWithSchedules
        };

        console.log('📅 Schedule response prepared:', {
            yearLevel: response.yearLevel,
            semester: response.semester,
            totalUnits: response.totalUnits,
            totalSubjects: response.totalSubjects,
            scheduledSubjects: response.scheduledSubjects
        });

        res.json(response);

    } catch (error) {
        console.error('❌ Error fetching student schedule:', error);
        res.status(500).json({ 
            message: 'Internal server error occurred while fetching schedule',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator'
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
                c.id as curriculumId,
                c.courseCode,
                c.courseDescription,
                c.units,
                c.courseType,
                c.prerequisites,
                s.id as scheduleId,
                s.schoolYear,
                s.semester,
                s.yearLevel,
                s.day,
                s.startTime,
                s.endTime,
                s.room,
                s.instructor,
                s.maxStudents,
                s.currentEnrollment,
                s.scheduleStatus,
                s.remarks
            FROM bsit_curriculum c
            LEFT JOIN bsit_schedules s ON c.id = s.curriculumId
            WHERE c.isActive = TRUE
                ${yearLevel ? 'AND c.yearLevel = ?' : ''}
                ${semester ? 'AND c.semester = ?' : ''}
                ${schoolYear ? 'AND s.schoolYear = ?' : ''}
            ORDER BY 
                c.yearLevel,
                c.semester,
                CASE s.day 
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                    ELSE 8
                END,
                s.startTime ASC,
                c.courseCode ASC
        `;

        const replacements = [];
        if (yearLevel) replacements.push(yearLevel);
        if (semester) replacements.push(semester);
        if (schoolYear) replacements.push(schoolYear);

        const scheduleData = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        }) as any[];

        console.log('📅 Admin found schedule entries:', scheduleData.length);

        // Group by year level and semester
        const groupedSchedules = new Map<string, {
            yearLevel: string;
            semester: string;
            subjects: Map<string, {
                courseCode: string;
                courseDescription: string;
                units: number;
                courseType: string;
                prerequisites: string;
                schedules: any[];
            }>;
        }>();
        
        scheduleData.forEach((item: any) => {
            const key = `${item.yearLevel}-${item.semester}`;
            
            if (!groupedSchedules.has(key)) {
                groupedSchedules.set(key, {
                    yearLevel: item.yearLevel,
                    semester: item.semester,
                    subjects: new Map()
                });
            }
            
            const group = groupedSchedules.get(key)!;
            const subjectKey = item.courseCode;
            
            if (!group.subjects.has(subjectKey)) {
                group.subjects.set(subjectKey, {
                    courseCode: item.courseCode,
                    courseDescription: item.courseDescription,
                    units: item.units,
                    courseType: item.courseType,
                    prerequisites: item.prerequisites,
                    schedules: []
                });
            }
            
            if (item.scheduleId) {
                group.subjects.get(subjectKey)!.schedules.push({
                    id: item.scheduleId,
                    schoolYear: item.schoolYear,
                    day: item.day,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    room: item.room,
                    instructor: item.instructor,
                    maxStudents: item.maxStudents,
                    currentEnrollment: item.currentEnrollment,
                    scheduleStatus: item.scheduleStatus,
                    remarks: item.remarks
                });
            }
        });

        // Convert to array format
        const response = Array.from(groupedSchedules.values()).map(group => ({
            yearLevel: group.yearLevel,
            semester: group.semester,
            subjects: Array.from(group.subjects.values()).map(subject => ({
                ...subject,
                hasSchedule: subject.schedules.length > 0,
                totalUnits: subject.units,
                scheduleSummary: subject.schedules.length > 0 ? `${subject.schedules.length} schedule(s)` : 'No schedule assigned'
            }))
        }));

        res.json(response);

    } catch (error) {
        console.error('❌ Error fetching all schedules:', error);
        res.status(500).json({ 
            message: 'Internal server error occurred while fetching schedules',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator'
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
                    COALESCE(s.currentYearLevel, 'Unknown') as currentYearLevel,
                    COALESCE(s.currentSemester, 'Unknown') as currentSemester,
                    COALESCE(s.studentType, 'N/A') as studentType,
                    COALESCE(s.yearOfEntry, 'N/A') as yearOfEntry,
                    bs.id as actualScheduleId,
                    bs.day,
                    bs.startTime,
                    bs.endTime,
                    bs.room,
                    bs.instructor
                FROM student_enrollments se
                LEFT JOIN students s ON se.studentId = s.id
                LEFT JOIN users u ON s.userId = u.id
                LEFT JOIN bsit_schedules bs ON se.scheduleId = bs.id
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
                yearLevel: student.currentYearLevel,
                semester: student.currentSemester,
                studentType: student.studentType,
                enrollmentDate: student.enrollmentDate,
                enrollmentStatus: student.enrollmentStatus,
                yearOfEntry: student.yearOfEntry,
                grade: student.grade,
                remarks: student.remarks,
                actualScheduleId: student.actualScheduleId,
                day: student.day,
                startTime: student.startTime,
                endTime: student.endTime,
                room: student.room,
                instructor: student.instructor
            });
        });

        // Convert to array format and sort by year level
        const response = Array.from(studentsByYearLevel.values())
            .sort((a, b) => {
                const yearOrder: { [key: string]: number } = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4 };
                return (yearOrder[a.yearLevel] || 999) - (yearOrder[b.yearLevel] || 999);
            });

        console.log('👥 Sending grouped students response:', response);
        res.json(response);

    } catch (error) {
        console.error('❌ Error fetching enrolled students:', error);
        res.status(500).json({ 
            message: 'Internal server error occurred while fetching enrolled students',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Contact administrator',
            details: 'This might be due to missing database tables or incorrect table structure'
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
        const requiredTables = ['users', 'students', 'student_enrollments', 'bsit_curriculum', 'bsit_schedules'];
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