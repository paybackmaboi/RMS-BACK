-- Check bsit_schedules table data
SELECT COUNT(*) as total_schedules FROM bsit_schedules;

-- Show sample schedule data
SELECT * FROM bsit_schedules LIMIT 5;

-- Check if there's curriculum data
SELECT COUNT(*) as total_curriculum FROM bsit_curriculum;

-- Show sample curriculum data
SELECT * FROM bsit_curriculum LIMIT 5;

-- Check the relationship between curriculum and schedules
SELECT 
    c.courseCode,
    c.courseDescription,
    c.yearLevel,
    c.semester,
    COUNT(s.id) as schedule_count
FROM bsit_curriculum c
LEFT JOIN bsit_schedules s ON c.id = s.curriculumId
GROUP BY c.id, c.courseCode, c.courseDescription, c.yearLevel, c.semester
ORDER BY c.yearLevel, c.semester, c.courseCode
LIMIT 10;
