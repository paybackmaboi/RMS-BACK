-- Check Curriculum Data Structure
-- This script helps understand the relationship between curriculum and schedules

-- Check what curriculum entries exist for 4th year
SELECT '4th Year Curriculum:' as info;
SELECT 
    id as curriculumId,
    courseCode,
    courseDescription,
    yearLevel,
    semester,
    units,
    courseType
FROM subjects 
WHERE yearLevel = '4th' 
ORDER BY semester, courseCode;

-- Check what curriculum entries exist for 3rd year
SELECT '3rd Year Curriculum:' as info;
SELECT 
    id as curriculumId,
    courseCode,
    courseDescription,
    yearLevel,
    semester,
    units,
    courseType
FROM subjects 
WHERE yearLevel = '3rd' 
ORDER BY semester, courseCode;

-- Check existing schedules for 4th year
SELECT '4th Year Schedules:' as info;
SELECT 
    id as scheduleId,
    curriculumId,
    day,
    startTime,
    endTime,
    room,
    instructor,
    yearLevel,
    semester
FROM schedules 
WHERE yearLevel = '4th' 
ORDER BY id;

-- Check existing schedules for 3rd year
SELECT '3rd Year Schedules:' as info;
SELECT 
    id as scheduleId,
    curriculumId,
    day,
    startTime,
    endTime,
    room,
    instructor,
    yearLevel,
    semester
FROM schedules 
WHERE yearLevel = '3rd' 
ORDER BY id;

-- Check which enrollments are for which year levels
SELECT 'Enrollment Year Level Analysis:' as info;
SELECT 
    s.currentYearLevel,
    COUNT(*) as enrollment_count,
    GROUP_CONCAT(DISTINCT se.scheduleId ORDER BY se.scheduleId) as schedule_ids
FROM student_enrollments se
INNER JOIN users u ON se.studentId = u.id
INNER JOIN students s ON u.id = s.userId
GROUP BY s.currentYearLevel
ORDER BY s.currentYearLevel;
