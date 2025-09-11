const { sequelize } = require('./dist/database');
const { QueryTypes } = require('sequelize');

async function checkDatabaseStructure() {
    try {
        console.log('🔍 Checking database structure...\n');
        
        // Check students table structure
        console.log('📋 Students table structure:');
        const studentColumns = await sequelize.query('DESCRIBE students', { type: QueryTypes.SELECT });
        studentColumns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        // Check student_enrollments table structure
        console.log('\n📚 Student_enrollments table structure:');
        const enrollmentColumns = await sequelize.query('DESCRIBE student_enrollments', { type: QueryTypes.SELECT });
        enrollmentColumns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        // Check schedules table structure
        console.log('\n📅 Schedules table structure:');
        const scheduleColumns = await sequelize.query('DESCRIBE schedules', { type: QueryTypes.SELECT });
        scheduleColumns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        // Check subjects table structure
        console.log('\n📖 Subjects table structure:');
        const subjectColumns = await sequelize.query('DESCRIBE subjects', { type: QueryTypes.SELECT });
        subjectColumns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        // Get sample student data with correct column names
        console.log('\n👥 Sample student data:');
        const sampleStudents = await sequelize.query(`
            SELECT s.id, s.userId, s.currentYearLevel, s.currentSemester, u.firstName, u.lastName
            FROM students s
            JOIN users u ON s.userId = u.id
            LIMIT 3
        `, { type: QueryTypes.SELECT });
        
        sampleStudents.forEach(student => {
            console.log(`  - ${student.firstName} ${student.lastName} (ID: ${student.id}, UserID: ${student.userId}, Year: ${student.currentYearLevel}, Semester: ${student.currentSemester})`);
        });
        
        // Get sample schedule data
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
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkDatabaseStructure();
