const { sequelize } = require('./dist/database');
const { QueryTypes } = require('sequelize');

async function checkDatabaseData() {
    try {
        console.log('🔍 Checking database data...\n');
        
        // Check students
        const students = await sequelize.query('SELECT COUNT(*) as count FROM students', { type: QueryTypes.SELECT });
        console.log('Students in database:', students[0].count);
        
        // Check student users
        const studentUsers = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE role = "student"', { type: QueryTypes.SELECT });
        console.log('Student users:', studentUsers[0].count);
        
        // Check enrollments
        const enrollments = await sequelize.query('SELECT COUNT(*) as count FROM student_enrollments', { type: QueryTypes.SELECT });
        console.log('Enrollments:', enrollments[0].count);
        
        // Check schedules
        const schedules = await sequelize.query('SELECT COUNT(*) as count FROM schedules', { type: QueryTypes.SELECT });
        console.log('Schedules:', schedules[0].count);
        
        // Check subjects
        const subjects = await sequelize.query('SELECT COUNT(*) as count FROM subjects', { type: QueryTypes.SELECT });
        console.log('Subjects:', subjects[0].count);
        
        // Get sample student data
        if (students[0].count > 0) {
            console.log('\n📋 Sample student data:');
            const sampleStudents = await sequelize.query(`
                SELECT s.id, s.studentId, s.currentYearLevel, s.currentSemester, u.firstName, u.lastName
                FROM students s
                JOIN users u ON s.userId = u.id
                LIMIT 3
            `, { type: QueryTypes.SELECT });
            
            sampleStudents.forEach(student => {
                console.log(`  - ${student.firstName} ${student.lastName} (ID: ${student.id}, Year: ${student.currentYearLevel}, Semester: ${student.currentSemester})`);
            });
        }
        
        // Get sample schedule data
        if (schedules[0].count > 0) {
            console.log('\n📅 Sample schedule data:');
            const sampleSchedules = await sequelize.query(`
                SELECT s.id, sub.courseCode, sub.yearLevel, sub.semester, s.dayOfWeek, s.startTime, s.endTime
                FROM schedules s
                JOIN subjects sub ON s.subjectId = sub.id
                LIMIT 3
            `, { type: QueryTypes.SELECT });
            
            sampleSchedules.forEach(schedule => {
                console.log(`  - ${schedule.courseCode} (${schedule.yearLevel}, ${schedule.semester}) - ${schedule.dayOfWeek} ${schedule.startTime}-${schedule.endTime}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkDatabaseData();
