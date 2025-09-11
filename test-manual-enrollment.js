const { sequelize } = require('./dist/database');
const { QueryTypes } = require('sequelize');

async function testManualEnrollment() {
    try {
        console.log('🧪 Testing manual enrollment for existing students...\n');
        
        // Get existing students
        const students = await sequelize.query(`
            SELECT s.id, s.userId, s.currentYearLevel, s.currentSemester, u.firstName, u.lastName
            FROM students s
            JOIN users u ON s.userId = u.id
        `, { type: QueryTypes.SELECT });
        
        console.log(`Found ${students.length} students to enroll:`);
        students.forEach(student => {
            console.log(`  - ${student.firstName} ${student.lastName} (Year: ${student.currentYearLevel}, Semester: ${student.currentSemester})`);
        });
        
        // Convert year level and semester to string format
        const yearLevelMap = {
            1: '1st Year',
            2: '2nd Year', 
            3: '3rd Year',
            4: '4th Year'
        };
        
        const semesterMap = {
            1: '1st Semester',
            2: '2nd Semester',
            3: 'Summer'
        };
        
        // Enroll each student
        for (const student of students) {
            const dbYearLevel = yearLevelMap[student.currentYearLevel] || `${student.currentYearLevel} Year`;
            const dbSemester = semesterMap[student.currentSemester] || `${student.currentSemester} Semester`;
            
            console.log(`\n🎓 Enrolling ${student.firstName} ${student.lastName} in ${dbYearLevel}, ${dbSemester}...`);
            
            // Get available schedules for this student
            const schedules = await sequelize.query(`
                SELECT 
                    s.id as scheduleId,
                    s.subjectId,
                    sub.courseCode,
                    sub.courseDescription
                FROM schedules s
                JOIN subjects sub ON s.subjectId = sub.id
                JOIN school_years sy ON s.schoolYearId = sy.id
                JOIN semesters sem ON s.semesterId = sem.id
                WHERE sub.yearLevel = ? 
                    AND sub.semester = ?
                    AND sub.isActive = TRUE
                    AND s.isActive = TRUE
                    AND sy.year = '2025-2026'
            `, {
                replacements: [dbYearLevel, dbSemester],
                type: QueryTypes.SELECT
            });
            
            console.log(`  Found ${schedules.length} schedules for enrollment`);
            
            // Enroll student in each schedule
            for (const schedule of schedules) {
                try {
                    // Check if already enrolled
                    const existingEnrollment = await sequelize.query(`
                        SELECT id FROM student_enrollments 
                        WHERE studentId = ? AND scheduleId = ?
                    `, {
                        replacements: [student.id, schedule.scheduleId],
                        type: QueryTypes.SELECT
                    });
                    
                    if (existingEnrollment.length === 0) {
                        // Create enrollment
                        await sequelize.query(`
                            INSERT INTO student_enrollments (studentId, scheduleId, enrollmentDate, enrollmentStatus)
                            VALUES (?, ?, NOW(), 'Enrolled')
                        `, {
                            replacements: [student.id, schedule.scheduleId],
                            type: QueryTypes.INSERT
                        });
                        
                        console.log(`    ✅ Enrolled in ${schedule.courseCode} - ${schedule.courseDescription}`);
                    } else {
                        console.log(`    ⚠️ Already enrolled in ${schedule.courseCode}`);
                    }
                } catch (enrollmentError) {
                    console.error(`    ❌ Failed to enroll in ${schedule.courseCode}:`, enrollmentError.message);
                }
            }
        }
        
        // Check final enrollment count
        const finalEnrollments = await sequelize.query('SELECT COUNT(*) as count FROM student_enrollments', { type: QueryTypes.SELECT });
        console.log(`\n🎉 Enrollment completed! Total enrollments: ${finalEnrollments[0].count}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

testManualEnrollment();
