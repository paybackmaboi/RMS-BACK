const { sequelize } = require('./dist/database');
const { QueryTypes } = require('sequelize');

async function test4thYearEnrollment() {
    try {
        console.log('🧪 Testing 4th Year enrollment counting...\n');
        
        // Check enrollments for 4th year subjects
        const enrollmentCounts = await sequelize.query(`
            SELECT 
                s.id as scheduleId,
                sub.courseCode,
                sub.courseDescription,
                s.currentEnrolled as currentCount,
                COALESCE(enrollment_counts.enrolled_count, 0) as actualCount
            FROM schedules s
            JOIN subjects sub ON s.subjectId = sub.id
            LEFT JOIN (
                SELECT 
                    se.scheduleId,
                    COUNT(se.id) as enrolled_count
                FROM student_enrollments se
                WHERE se.enrollmentStatus = 'Enrolled'
                GROUP BY se.scheduleId
            ) enrollment_counts ON s.id = enrollment_counts.scheduleId
            WHERE sub.yearLevel = '4th Year' AND sub.semester = '1st Semester'
            ORDER BY sub.courseCode
        `, { type: QueryTypes.SELECT });
        
        console.log('4th Year enrollment counts:');
        enrollmentCounts.forEach(schedule => {
            const match = schedule.currentCount === schedule.actualCount ? '✅' : '❌';
            console.log(`  ${match} ${schedule.courseCode}: ${schedule.currentCount} (current) vs ${schedule.actualCount} (actual)`);
        });
        
        // Update the counts
        console.log('\n🔄 Updating enrollment counts...');
        await sequelize.query(`
            UPDATE schedules s
            SET currentEnrolled = (
                SELECT COALESCE(COUNT(se.id), 0)
                FROM student_enrollments se
                WHERE se.scheduleId = s.id
                AND se.enrollmentStatus = 'Enrolled'
            )
        `, { type: QueryTypes.UPDATE });
        
        console.log('✅ Enrollment counts updated');
        
        // Check again after update
        console.log('\n📊 Updated 4th Year enrollment counts:');
        const updatedCounts = await sequelize.query(`
            SELECT 
                s.id as scheduleId,
                sub.courseCode,
                sub.courseDescription,
                s.currentEnrolled as updatedCount,
                COALESCE(enrollment_counts.enrolled_count, 0) as actualCount
            FROM schedules s
            JOIN subjects sub ON s.subjectId = sub.id
            LEFT JOIN (
                SELECT 
                    se.scheduleId,
                    COUNT(se.id) as enrolled_count
                FROM student_enrollments se
                WHERE se.enrollmentStatus = 'Enrolled'
                GROUP BY se.scheduleId
            ) enrollment_counts ON s.id = enrollment_counts.scheduleId
            WHERE sub.yearLevel = '4th Year' AND sub.semester = '1st Semester'
            ORDER BY sub.courseCode
        `, { type: QueryTypes.SELECT });
        
        updatedCounts.forEach(schedule => {
            const match = schedule.updatedCount === schedule.actualCount ? '✅' : '❌';
            console.log(`  ${match} ${schedule.courseCode}: ${schedule.updatedCount} (should be ${schedule.actualCount})`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

test4thYearEnrollment();
