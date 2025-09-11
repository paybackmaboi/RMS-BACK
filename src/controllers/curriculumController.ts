import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../database';
import { QueryTypes } from 'sequelize';

// Get curriculum subjects and schedules by year level and semester
export const getCurriculumByYearAndSemester = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { yearLevel, semester } = req.query;
        
        if (!yearLevel || !semester) {
            res.status(400).json({ message: 'Year level and semester are required' });
            return;
        }

        // Map frontend values to database values
        const yearLevelMapping: { [key: string]: string } = {
            '1st': '1st Year', '2nd': '2nd Year', '3rd': '3rd Year', '4th': '4th Year'
        };
        const semesterMapping: { [key: string]: string } = {
            '1st': '1st Semester', '2nd': '2nd Semester', 'sum': 'Summer', 'Summer': 'Summer'
        };

        const dbYearLevel = yearLevelMapping[yearLevel as string] || yearLevel;
        const dbSemester = semesterMapping[semester as string] || semester;

        const curriculumQuery = `
            SELECT 
                s.id as subjectId, s.courseCode, s.courseDescription, s.units, s.courseType, s.prerequisites,
                sch.id as scheduleId, sch.dayOfWeek, sch.startTime, sch.endTime, sch.room, sch.isActive as scheduleActive
            FROM subjects s
            LEFT JOIN schedules sch ON s.id = sch.subjectId
            WHERE s.yearLevel = ? AND s.semester = ? AND s.isActive = TRUE
            ORDER BY s.courseCode ASC, s.courseType ASC`;

        const curriculumData = await sequelize.query(curriculumQuery, {
            replacements: [dbYearLevel, dbSemester],
            type: QueryTypes.SELECT
        }) as any[];

        // **FIX:** Group by courseCode to combine Lec/Lab as one subject
        const groupedSubjects = new Map<string, {
            courseCode: string; courseDescription: string; totalUnits: number; 
            courseTypes: string[]; prerequisites: string; schedules: any[];
            subjectIds: number[];
        }>();
        
        curriculumData.forEach((item: any) => {
            const key = item.courseCode;
            
            if (!groupedSubjects.has(key)) {
                groupedSubjects.set(key, {
                    courseCode: item.courseCode, 
                    courseDescription: item.courseDescription.replace(/ - (Lec|Lab)$/, ''), // Remove Lec/Lab suffix
                    totalUnits: 0, 
                    courseTypes: [], 
                    prerequisites: item.prerequisites, 
                    schedules: [],
                    subjectIds: []
                });
            }
            
            const currentSubject = groupedSubjects.get(key)!;
            
            // Add units (only count once per course, not per Lec/Lab)
            if (!currentSubject.subjectIds.includes(item.subjectId)) {
                currentSubject.totalUnits += item.units;
                currentSubject.subjectIds.push(item.subjectId);
                currentSubject.courseTypes.push(item.courseType);
            }
            
            if (item.scheduleId && item.scheduleActive) {
                const newSchedule = {
                    id: item.scheduleId, 
                    dayOfWeek: item.dayOfWeek, 
                    startTime: item.startTime,
                    endTime: item.endTime, 
                    room: item.room,
                    courseType: item.courseType // Keep track of whether this is Lec or Lab
                };
                
                // **FIX:** Add robust check to prevent adding logically identical schedules
                const scheduleExists = currentSubject.schedules.some(s => 
                    s.dayOfWeek === newSchedule.dayOfWeek &&
                    s.startTime === newSchedule.startTime &&
                    s.endTime === newSchedule.endTime &&
                    s.room === newSchedule.room &&
                    s.courseType === newSchedule.courseType
                );
                
                if (!scheduleExists) {
                    currentSubject.schedules.push(newSchedule);
                }
            }
        });

        const subjectsWithSchedules = Array.from(groupedSubjects.values()).map(subject => ({
            courseCode: subject.courseCode,
            courseDescription: subject.courseDescription,
            units: subject.totalUnits,
            courseTypes: subject.courseTypes,
            prerequisites: subject.prerequisites,
            schedules: subject.schedules,
            hasSchedule: subject.schedules.length > 0
        }));

        const totalUnits = subjectsWithSchedules.reduce((sum, subject) => sum + subject.units, 0);

        res.json({
            yearLevel, semester,
            subjects: subjectsWithSchedules,
            totalUnits,
            totalSubjects: subjectsWithSchedules.length
        });

    } catch (error) {
        console.error('❌ Error fetching curriculum:', error);
        res.status(500).json({ 
            message: 'Error fetching curriculum', error: (error as Error).message 
        });
    }
};