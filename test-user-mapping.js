const { sequelize } = require('./dist/database');
const { QueryTypes } = require('sequelize');

async function testUserMapping() {
    try {
        console.log('🧪 Testing user mapping...\n');
        
        // Check students and their userIds
        const studentsQuery = `
            SELECT s.id as studentId, s.userId, u.firstName, u.lastName, u.idNumber
            FROM students s
            JOIN users u ON s.userId = u.id
            WHERE s.id IN (1, 2)
        `;
        
        const students = await sequelize.query(studentsQuery, {
            type: QueryTypes.SELECT
        });
        
        console.log('👥 Student to User mapping:');
        students.forEach(student => {
            console.log(`  - Student ID: ${student.studentId}, User ID: ${student.userId}, Name: ${student.firstName} ${student.lastName}, ID Number: ${student.idNumber}`);
        });
        
        // Test the enrolled subjects query with the correct userId
        if (students.length > 0) {
            const userId = students[1].userId; // Get the second student's userId
            console.log(`\n🔍 Testing enrolled subjects for userId: ${userId}`);
            
            const enrolledSubjectsQuery = `
                SELECT 
                    se.id as enrollmentId,
                    se.studentId,
                    se.enrollmentStatus,
                    se.grade,
                    se.enrollmentDate,
                    sub.id as subjectId,
                    sub.courseCode,
                    sub.courseDescription,
                    sub.units,
                    sub.courseType,
                    sub.yearLevel,
                    sub.semester,
                    sched.dayOfWeek,
                    sched.startTime,
                    sched.endTime,
                    sched.room
                FROM student_enrollments se
                JOIN schedules sched ON se.scheduleId = sched.id
                JOIN subjects sub ON sched.subjectId = sub.id
                JOIN students s ON se.studentId = s.id
                WHERE s.userId = ? 
                    AND se.enrollmentStatus = 'Enrolled'
                ORDER BY sub.courseCode ASC
                LIMIT 5
            `;

            const enrolledSubjects = await sequelize.query(enrolledSubjectsQuery, {
                replacements: [userId],
                type: QueryTypes.SELECT
            });

            console.log(`Found ${enrolledSubjects.length} enrolled subjects`);
            
            if (enrolledSubjects.length > 0) {
                console.log('\n📚 Sample enrolled subjects:');
                enrolledSubjects.forEach((subject, index) => {
                    console.log(`  ${index + 1}. ${subject.courseCode} - ${subject.courseDescription}`);
                    console.log(`     - Units: ${subject.units}, Type: ${subject.courseType}`);
                    console.log(`     - Schedule: ${subject.dayOfWeek} ${subject.startTime} - ${subject.endTime}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

testUserMapping();
