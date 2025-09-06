"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBsitSchedules = exports.seedBsitCurriculum = exports.seedInitialData = void 0;
const database_1 = require("./database");
const seedInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🌱 Seeding initial data...');
        // Temporarily skip seeding of commented-out models to avoid key limit issues
        // Departments, Courses, School Years, and Semesters will be seeded later
        // when we re-enable those models
        console.log('✅ Basic seeding completed (essential models only)');
        // Seed BSIT Curriculum
        yield (0, exports.seedBsitCurriculum)();
        // Seed BSIT Schedules
        yield (0, exports.seedBsitSchedules)();
        console.log('🎉 Initial data seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
    }
});
exports.seedInitialData = seedInitialData;
// BSIT Curriculum Seeding
const seedBsitCurriculum = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📚 Seeding BSIT Curriculum...');
        const bsitCurriculum = [
            // First Year - First Semester
            {
                courseCode: 'GE 1',
                courseDescription: 'Understanding the Self',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 2',
                courseDescription: 'Readings in Philippine History',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 3',
                courseDescription: 'Mathematics in the Modern World',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 4',
                courseDescription: 'Science, Technology and Society',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 5',
                courseDescription: 'Purposive Communication',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 6',
                courseDescription: 'Art Appreciation',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 7',
                courseDescription: 'Ethics',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 8',
                courseDescription: 'The Contemporary World',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 9',
                courseDescription: 'Life and Works of Rizal',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'PE 1',
                courseDescription: 'Physical Education 1',
                units: 2,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'NSTP 1',
                courseDescription: 'National Service Training Program 1',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 101',
                courseDescription: 'Introduction to Information Technology',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 102',
                courseDescription: 'Computer Programming 1',
                units: 3,
                yearLevel: '1st',
                semester: '1st',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            // First Year - Second Semester
            {
                courseCode: 'IT 103',
                courseDescription: 'Computer Programming 2',
                units: 3,
                yearLevel: '1st',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: 'IT 102',
                isActive: true
            },
            {
                courseCode: 'IT 104',
                courseDescription: 'Computer Organization and Architecture',
                units: 3,
                yearLevel: '1st',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 105',
                courseDescription: 'Discrete Mathematics',
                units: 3,
                yearLevel: '1st',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 106',
                courseDescription: 'Web Development Fundamentals',
                units: 3,
                yearLevel: '1st',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'PE 2',
                courseDescription: 'Physical Education 2',
                units: 2,
                yearLevel: '1st',
                semester: '2nd',
                courseType: 'Laboratory',
                prerequisites: 'PE 1',
                isActive: true
            },
            {
                courseCode: 'NSTP 2',
                courseDescription: 'National Service Training Program 2',
                units: 3,
                yearLevel: '1st',
                semester: '2nd',
                courseType: 'Laboratory',
                prerequisites: 'NSTP 1',
                isActive: true
            },
            // Second Year - First Semester
            {
                courseCode: 'IT 201',
                courseDescription: 'Data Structures and Algorithms',
                units: 3,
                yearLevel: '2nd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 103',
                isActive: true
            },
            {
                courseCode: 'IT 202',
                courseDescription: 'Database Management Systems',
                units: 3,
                yearLevel: '2nd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 101',
                isActive: true
            },
            {
                courseCode: 'IT 203',
                courseDescription: 'Object-Oriented Programming',
                units: 3,
                yearLevel: '2nd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 103',
                isActive: true
            },
            {
                courseCode: 'IT 204',
                courseDescription: 'Computer Networks',
                units: 3,
                yearLevel: '2nd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 104',
                isActive: true
            },
            {
                courseCode: 'IT 205',
                courseDescription: 'Systems Analysis and Design',
                units: 3,
                yearLevel: '2nd',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: 'IT 101',
                isActive: true
            },
            {
                courseCode: 'PE 3',
                courseDescription: 'Physical Education 3',
                units: 2,
                yearLevel: '2nd',
                semester: '1st',
                courseType: 'Laboratory',
                prerequisites: 'PE 2',
                isActive: true
            },
            // Second Year - Second Semester
            {
                courseCode: 'IT 206',
                courseDescription: 'Software Engineering',
                units: 3,
                yearLevel: '2nd',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: 'IT 205',
                isActive: true
            },
            {
                courseCode: 'IT 207',
                courseDescription: 'Web Application Development',
                units: 3,
                yearLevel: '2nd',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: 'IT 106, IT 203',
                isActive: true
            },
            {
                courseCode: 'IT 208',
                courseDescription: 'Mobile Application Development',
                units: 3,
                yearLevel: '2nd',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: 'IT 203',
                isActive: true
            },
            {
                courseCode: 'IT 209',
                courseDescription: 'Information Security',
                units: 3,
                yearLevel: '2nd',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: 'IT 204',
                isActive: true
            },
            {
                courseCode: 'IT 210',
                courseDescription: 'IT Project Management',
                units: 3,
                yearLevel: '2nd',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: 'IT 205',
                isActive: true
            },
            {
                courseCode: 'PE 4',
                courseDescription: 'Physical Education 4',
                units: 2,
                yearLevel: '2nd',
                semester: '2nd',
                courseType: 'Laboratory',
                prerequisites: 'PE 3',
                isActive: true
            },
            // Third Year - First Semester
            {
                courseCode: 'IT 301',
                courseDescription: 'Advanced Database Systems',
                units: 3,
                yearLevel: '3rd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 202',
                isActive: true
            },
            {
                courseCode: 'IT 302',
                courseDescription: 'Web Services and APIs',
                units: 3,
                yearLevel: '3rd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 207',
                isActive: true
            },
            {
                courseCode: 'IT 303',
                courseDescription: 'Cloud Computing',
                units: 3,
                yearLevel: '3rd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 204',
                isActive: true
            },
            {
                courseCode: 'IT 304',
                courseDescription: 'Data Analytics',
                units: 3,
                yearLevel: '3rd',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 201',
                isActive: true
            },
            {
                courseCode: 'IT 305',
                courseDescription: 'IT Elective 1',
                units: 3,
                yearLevel: '3rd',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            // Third Year - Second Semester
            {
                courseCode: 'IT 306',
                courseDescription: 'IT Capstone Project 1',
                units: 3,
                yearLevel: '3rd',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: 'IT 206, IT 210',
                isActive: true
            },
            {
                courseCode: 'IT 307',
                courseDescription: 'Enterprise Systems',
                units: 3,
                yearLevel: '3rd',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: 'IT 202, IT 205',
                isActive: true
            },
            {
                courseCode: 'IT 308',
                courseDescription: 'IT Elective 2',
                units: 3,
                yearLevel: '3rd',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 309',
                courseDescription: 'IT Elective 3',
                units: 3,
                yearLevel: '3rd',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            // Fourth Year - First Semester
            {
                courseCode: 'IT 401',
                courseDescription: 'IT Capstone Project 2',
                units: 3,
                yearLevel: '4th',
                semester: '1st',
                courseType: 'Both',
                prerequisites: 'IT 306',
                isActive: true
            },
            {
                courseCode: 'IT 402',
                courseDescription: 'IT Internship',
                units: 6,
                yearLevel: '4th',
                semester: '1st',
                courseType: 'Laboratory',
                prerequisites: 'Completion of 3rd Year',
                isActive: true
            },
            {
                courseCode: 'IT 403',
                courseDescription: 'IT Elective 4',
                units: 3,
                yearLevel: '4th',
                semester: '1st',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            // Fourth Year - Second Semester
            {
                courseCode: 'IT 404',
                courseDescription: 'IT Thesis',
                units: 6,
                yearLevel: '4th',
                semester: '2nd',
                courseType: 'Both',
                prerequisites: 'IT 401',
                isActive: true
            },
            {
                courseCode: 'IT 405',
                courseDescription: 'IT Elective 5',
                units: 3,
                yearLevel: '4th',
                semester: '2nd',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            }
        ];
        yield database_1.BsitCurriculumModel.bulkCreate(bsitCurriculum, { ignoreDuplicates: true });
        console.log('✅ BSIT Curriculum seeded successfully');
    }
    catch (error) {
        console.error('❌ Error seeding BSIT Curriculum:', error);
        throw error;
    }
});
exports.seedBsitCurriculum = seedBsitCurriculum;
// BSIT Schedule Seeding
const seedBsitSchedules = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📅 Seeding BSIT Schedules...');
        // Get curriculum IDs for reference
        const curriculum = yield database_1.BsitCurriculumModel.findAll();
        const curriculumMap = new Map();
        curriculum.forEach(course => {
            const key = `${course.courseCode}-${course.yearLevel}-${course.semester}`;
            curriculumMap.set(key, course.id);
        });
        const schedules = [
            // First Year - First Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 101-1st-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '1st',
                day: 'Monday',
                startTime: new Date('2025-06-02T08:00:00'),
                endTime: new Date('2025-06-02T11:00:00'),
                room: 'IT Lab 1',
                instructor: 'Prof. Santos',
                maxStudents: 40,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            {
                curriculumId: curriculumMap.get('IT 102-1st-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '1st',
                day: 'Tuesday',
                startTime: new Date('2025-06-03T08:00:00'),
                endTime: new Date('2025-06-03T11:00:00'),
                room: 'IT Lab 2',
                instructor: 'Prof. Garcia',
                maxStudents: 40,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            {
                curriculumId: curriculumMap.get('GE 1-1st-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '1st',
                day: 'Wednesday',
                startTime: new Date('2025-06-04T08:00:00'),
                endTime: new Date('2025-06-04T11:00:00'),
                room: 'Room 101',
                instructor: 'Prof. Reyes',
                maxStudents: 50,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            {
                curriculumId: curriculumMap.get('GE 2-1st-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '1st',
                day: 'Thursday',
                startTime: new Date('2025-06-05T08:00:00'),
                endTime: new Date('2025-06-05T11:00:00'),
                room: 'Room 102',
                instructor: 'Prof. Cruz',
                maxStudents: 50,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            {
                curriculumId: curriculumMap.get('PE 1-1st-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '1st',
                day: 'Friday',
                startTime: new Date('2025-06-06T08:00:00'),
                endTime: new Date('2025-06-06T10:00:00'),
                room: 'Gymnasium',
                instructor: 'Coach Martinez',
                maxStudents: 40,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // First Year - Second Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 103-1st-2nd'),
                schoolYear: '2025-2026',
                semester: '2nd',
                yearLevel: '1st',
                day: 'Monday',
                startTime: new Date('2025-11-03T08:00:00'),
                endTime: new Date('2025-11-03T11:00:00'),
                room: 'IT Lab 1',
                instructor: 'Prof. Garcia',
                maxStudents: 40,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            {
                curriculumId: curriculumMap.get('IT 104-1st-2nd'),
                schoolYear: '2025-2026',
                semester: '2nd',
                yearLevel: '1st',
                day: 'Tuesday',
                startTime: new Date('2025-11-04T08:00:00'),
                endTime: new Date('2025-11-04T11:00:00'),
                room: 'IT Lab 2',
                instructor: 'Prof. Santos',
                maxStudents: 40,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // Second Year - First Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 201-2nd-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '2nd',
                day: 'Monday',
                startTime: new Date('2025-06-02T13:00:00'),
                endTime: new Date('2025-06-02T16:00:00'),
                room: 'IT Lab 1',
                instructor: 'Prof. Lopez',
                maxStudents: 35,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            {
                curriculumId: curriculumMap.get('IT 202-2nd-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '2nd',
                day: 'Tuesday',
                startTime: new Date('2025-06-03T13:00:00'),
                endTime: new Date('2025-06-03T16:00:00'),
                room: 'IT Lab 2',
                instructor: 'Prof. Torres',
                maxStudents: 35,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // Second Year - Second Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 206-2nd-2nd'),
                schoolYear: '2025-2026',
                semester: '2nd',
                yearLevel: '2nd',
                day: 'Monday',
                startTime: new Date('2025-11-03T13:00:00'),
                endTime: new Date('2025-11-03T16:00:00'),
                room: 'Room 201',
                instructor: 'Prof. Lopez',
                maxStudents: 35,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // Third Year - First Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 301-3rd-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '3rd',
                day: 'Wednesday',
                startTime: new Date('2025-06-04T13:00:00'),
                endTime: new Date('2025-06-04T16:00:00'),
                room: 'IT Lab 3',
                instructor: 'Prof. Hernandez',
                maxStudents: 30,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // Third Year - Second Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 306-3rd-2nd'),
                schoolYear: '2025-2026',
                semester: '2nd',
                yearLevel: '3rd',
                day: 'Wednesday',
                startTime: new Date('2025-11-05T13:00:00'),
                endTime: new Date('2025-11-05T16:00:00'),
                room: 'IT Lab 3',
                instructor: 'Prof. Hernandez',
                maxStudents: 30,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // Fourth Year - First Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 401-4th-1st'),
                schoolYear: '2025-2026',
                semester: '1st',
                yearLevel: '4th',
                day: 'Thursday',
                startTime: new Date('2025-06-05T13:00:00'),
                endTime: new Date('2025-06-05T16:00:00'),
                room: 'IT Lab 4',
                instructor: 'Prof. Mendoza',
                maxStudents: 25,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            },
            // Fourth Year - Second Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 404-4th-2nd'),
                schoolYear: '2025-2026',
                semester: '2nd',
                yearLevel: '4th',
                day: 'Thursday',
                startTime: new Date('2025-11-06T13:00:00'),
                endTime: new Date('2025-11-06T16:00:00'),
                room: 'IT Lab 4',
                instructor: 'Prof. Mendoza',
                maxStudents: 25,
                currentEnrollment: 0,
                scheduleStatus: 'Open'
            }
        ];
        // Filter out schedules with undefined curriculumId
        const validSchedules = schedules.filter(schedule => schedule.curriculumId);
        if (validSchedules.length > 0) {
            yield database_1.BsitScheduleModel.bulkCreate(validSchedules, { ignoreDuplicates: true });
            console.log(`✅ BSIT Schedules seeded successfully (${validSchedules.length} schedules)`);
        }
        else {
            console.log('⚠️  No valid schedules to seed (curriculum not found)');
        }
    }
    catch (error) {
        console.error('❌ Error seeding BSIT Schedules:', error);
        throw error;
    }
});
exports.seedBsitSchedules = seedBsitSchedules;
