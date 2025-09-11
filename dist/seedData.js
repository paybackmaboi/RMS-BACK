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
exports.seedSchedules = exports.seedBsitCurriculum = exports.seedInitialData = void 0;
const database_1 = require("./database");
const seedInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🌱 Seeding initial data...');
        // Create departments
        const departments = yield database_1.DepartmentModel.bulkCreate([
            {
                code: 'CIT',
                name: 'College of Information Technology',
                description: 'Computer and IT programs',
                isActive: true
            }
        ], { ignoreDuplicates: true });
        console.log('✅ Departments created');
        // Create courses
        const courses = yield database_1.CourseModel.bulkCreate([
            {
                code: 'BSIT',
                name: 'Bachelor of Science in Information Technology',
                departmentId: 1, // CIT
                totalUnits: 144,
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            }
        ], { ignoreDuplicates: true });
        console.log('✅ Courses created');
        // Create school years
        const schoolYears = yield database_1.SchoolYearModel.bulkCreate([
            {
                year: '2025-2026',
                description: 'Academic Year 2025-2026',
                startDate: new Date('2025-06-01'),
                endDate: new Date('2026-05-31'),
                isCurrent: true,
                isActive: true
            }
        ], { ignoreDuplicates: true });
        console.log('✅ School years created');
        // Create semesters
        const semesters = yield database_1.SemesterModel.bulkCreate([
            {
                name: 'First Semester',
                code: '1ST',
                description: 'First semester of the academic year',
                startDate: new Date('2025-06-01'),
                endDate: new Date('2025-10-31'),
                isActive: true
            },
            {
                name: 'Second Semester',
                code: '2ND',
                description: 'Second semester of the academic year',
                startDate: new Date('2025-11-01'),
                endDate: new Date('2026-03-31'),
                isActive: true
            },
            {
                name: 'Summer',
                code: 'SUM',
                description: 'Summer semester',
                startDate: new Date('2026-04-01'),
                endDate: new Date('2026-05-31'),
                isActive: true
            }
        ], { ignoreDuplicates: true });
        console.log('✅ Semesters created');
        // Seed BSIT Curriculum
        yield (0, exports.seedBsitCurriculum)();
        // Seed Schedules
        yield (0, exports.seedSchedules)();
        console.log('🎉 Initial data seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
    }
});
exports.seedInitialData = seedInitialData;
// BSIT Curriculum Seeding - Based on provided curriculum images
const seedBsitCurriculum = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📚 Seeding BSIT Curriculum...');
        const bsitCurriculum = [
            // First Year - First Semester
            {
                courseCode: 'FIL 1-A',
                courseDescription: 'Wikang Filipino',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT110',
                courseDescription: 'Introduction to Computing - Lec',
                units: 2,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT110',
                courseDescription: 'Introduction to Computing - Lab',
                units: 1,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT111',
                courseDescription: 'Computer Programming 1 - Lec',
                units: 2,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT111',
                courseDescription: 'Computer Programming 1 - Lab',
                units: 1,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 112',
                courseDescription: 'PC Assembly & Troubleshooting - Lec',
                units: 2,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 112',
                courseDescription: 'PC Assembly & Troubleshooting - Lab',
                units: 1,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'MATHWORLD-B',
                courseDescription: 'Mathematics in the Modern World',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'NSTP1 - C',
                courseDescription: 'National Service Training Prog. 1',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'PATHFIT 1 - C',
                courseDescription: 'Movement Competency Training',
                units: 2,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'UTS - A',
                courseDescription: 'Understanding the Self',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'MATHPREP',
                courseDescription: 'Pre Calculus for Non-STEM',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            // Second Year - First Semester
            {
                courseCode: 'ARTAPP - B',
                courseDescription: 'Art Appreciation',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'CW - B',
                courseDescription: 'The Contemporary World',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT210',
                courseDescription: 'Data Structures & Algorithms - Lec',
                units: 2,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT111',
                isActive: true
            },
            {
                courseCode: 'IT210',
                courseDescription: 'Data Structures & Algorithms - Lab',
                units: 1,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT111',
                isActive: true
            },
            {
                courseCode: 'IT 211',
                courseDescription: 'Platform Technologies (Intangible) - Lec',
                units: 2,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT110',
                isActive: true
            },
            {
                courseCode: 'IT 211',
                courseDescription: 'Platform Technologies (Intangible) - Lab',
                units: 1,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT110',
                isActive: true
            },
            {
                courseCode: 'IT 212',
                courseDescription: 'Web Systems & Technologies 1 - Lec',
                units: 2,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT111',
                isActive: true
            },
            {
                courseCode: 'IT 212',
                courseDescription: 'Web Systems & Technologies 1 - Lab',
                units: 1,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT111',
                isActive: true
            },
            {
                courseCode: 'IT 213',
                courseDescription: 'Introduction to Human Computer Interaction - Lec',
                units: 2,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 213',
                courseDescription: 'Introduction to Human Computer Interaction - Lab',
                units: 1,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'PATHFIT 3-B',
                courseDescription: 'Sports',
                units: 2,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'STAT',
                courseDescription: 'Statistics & Probability',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'MATHWORLD-B',
                isActive: true
            },
            // Third Year - First Semester
            {
                courseCode: 'IT310',
                courseDescription: 'Applications Dev\'t. & Emerging Technologies - Lec',
                units: 2,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 212',
                isActive: true
            },
            {
                courseCode: 'IT310',
                courseDescription: 'Applications Dev\'t. & Emerging Technologies - Lab',
                units: 1,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT 212',
                isActive: true
            },
            {
                courseCode: 'IT311',
                courseDescription: 'Operating Systems - Lec',
                units: 2,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 112',
                isActive: true
            },
            {
                courseCode: 'IT311',
                courseDescription: 'Operating Systems - Lab',
                units: 1,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT 112',
                isActive: true
            },
            {
                courseCode: 'IT312',
                courseDescription: 'Human Computer Interaction - Lec',
                units: 2,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 213',
                isActive: true
            },
            {
                courseCode: 'IT312',
                courseDescription: 'Human Computer Interaction - Lab',
                units: 1,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT 213',
                isActive: true
            },
            {
                courseCode: 'ITELEC1',
                courseDescription: 'IT Elective I - Lec',
                units: 2,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'ITELEC1',
                courseDescription: 'IT Elective I - Lab',
                units: 1,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'ITTEL2',
                courseDescription: 'IT Track Elective II - Lec',
                units: 2,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'ITTEL2',
                courseDescription: 'IT Track Elective II - Lab',
                units: 1,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'STAT',
                courseDescription: 'Statistics & Probability',
                units: 3,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'MATHWORLD-B',
                isActive: true
            },
            {
                courseCode: 'TECHNO',
                courseDescription: 'Technopreneurship - Lec',
                units: 2,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'TECHNO',
                courseDescription: 'Technopreneurship - Lab',
                units: 1,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            // Fourth Year - First Semester
            {
                courseCode: 'IT410',
                courseDescription: 'Capstone Project II - Lec',
                units: 2,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 401',
                isActive: true
            },
            {
                courseCode: 'IT410',
                courseDescription: 'Capstone Project II - Lab',
                units: 1,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT 401',
                isActive: true
            },
            {
                courseCode: 'IT411',
                courseDescription: 'Integrative Programming & Technologies - Lec',
                units: 2,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT310',
                isActive: true
            },
            {
                courseCode: 'IT411',
                courseDescription: 'Integrative Programming & Technologies - Lab',
                units: 1,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT310',
                isActive: true
            },
            {
                courseCode: 'IT 412',
                courseDescription: 'Systems Administration & Maintenance - Lec',
                units: 2,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT311',
                isActive: true
            },
            {
                courseCode: 'IT 412',
                courseDescription: 'Systems Administration & Maintenance - Lab',
                units: 1,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'IT311',
                isActive: true
            },
            {
                courseCode: 'ITELEC3',
                courseDescription: 'IT Elective III - Lec',
                units: 2,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'ITELEC3',
                courseDescription: 'IT Elective III - Lab',
                units: 1,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'RIZAL',
                courseDescription: 'Rizal\'s Life & Works',
                units: 3,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            }
        ];
        yield database_1.SubjectsModel.bulkCreate(bsitCurriculum, { ignoreDuplicates: true });
        console.log('✅ BSIT Curriculum seeded successfully');
    }
    catch (error) {
        console.error('❌ Error seeding BSIT Curriculum:', error);
        throw error;
    }
});
exports.seedBsitCurriculum = seedBsitCurriculum;
// Schedules Seeding - Based on actual curriculum schedules from images
const seedSchedules = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📅 Seeding Schedules...');
        // Get school year and semester IDs
        const schoolYear = yield database_1.SchoolYearModel.findOne({ where: { year: '2025-2026' } });
        const firstSemester = yield database_1.SemesterModel.findOne({ where: { code: '1ST' } });
        if (!schoolYear || !firstSemester) {
            throw new Error('School year or semester not found');
        }
        // Get all subjects
        const subjects = yield database_1.SubjectsModel.findAll();
        const schedules = [];
        // Create specific schedules for each subject based on curriculum images
        for (const subject of subjects) {
            let subjectSchedules = [];
            // 1st Year - 1st Semester schedules
            if (subject.yearLevel === '1st Year' && subject.semester === '1st Semester') {
                switch (subject.courseCode) {
                    case 'FIL 1-A':
                        subjectSchedules = [
                            { dayOfWeek: 'TTH', startTime: '05:00PM', endTime: '06:30PM', room: '314' }
                        ];
                        break;
                    case 'IT110':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'MW', startTime: '09:30AM', endTime: '10:30AM', room: '314' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'MW', startTime: '10:30AM', endTime: '12:00PM', room: 'CL-1' }
                            ];
                        }
                        break;
                    case 'IT111':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '08:00AM', endTime: '09:00AM', room: '309' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '09:00AM', endTime: '10:30AM', room: 'CL-1' }
                            ];
                        }
                        break;
                    case 'IT 112':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'F', startTime: '10:00AM', endTime: '12:00PM', room: '309' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '10:30AM', endTime: '12:00PM', room: 'CL-1' }
                            ];
                        }
                        break;
                    case 'MATHWORLD-B':
                        subjectSchedules = [
                            { dayOfWeek: 'TTH', startTime: '01:00PM', endTime: '02:30PM', room: '309' }
                        ];
                        break;
                    case 'NSTP1 - C':
                        subjectSchedules = [
                            { dayOfWeek: 'F', startTime: '01:00PM', endTime: '04:00PM', room: '314' }
                        ];
                        break;
                    case 'PATHFIT 1 - C':
                        subjectSchedules = [
                            { dayOfWeek: 'F', startTime: '08:00AM', endTime: '10:00AM', room: 'Kinetics' }
                        ];
                        break;
                    case 'UTS - A':
                        subjectSchedules = [
                            { dayOfWeek: 'TTH', startTime: '02:30PM', endTime: '04:00PM', room: '309' }
                        ];
                        break;
                    case 'MATHPREP':
                        subjectSchedules = [
                            { dayOfWeek: 'MW', startTime: '01:00PM', endTime: '02:30PM', room: '307' }
                        ];
                        break;
                }
            }
            // 2nd Year - 1st Semester schedules
            if (subject.yearLevel === '2nd Year' && subject.semester === '1st Semester') {
                switch (subject.courseCode) {
                    case 'ARTAPP - B':
                        subjectSchedules = [
                            { dayOfWeek: 'TH', startTime: '09:00AM', endTime: '10:30AM', room: '307' }
                        ];
                        break;
                    case 'CW - B':
                        subjectSchedules = [
                            { dayOfWeek: 'F', startTime: '04:00PM', endTime: '05:30PM', room: '308' }
                        ];
                        break;
                    case 'IT210':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'MW', startTime: '06:00PM', endTime: '07:30PM', room: '308' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '02:30PM', endTime: '04:00PM', room: 'CL-2' }
                            ];
                        }
                        break;
                    case 'IT 211':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '08:30AM', endTime: '10:30AM', room: 'CL-2' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '10:30AM', endTime: '12:00PM', room: 'CL-1' }
                            ];
                        }
                        break;
                    case 'IT 212':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'MW', startTime: '01:30PM', endTime: '03:30PM', room: 'CL-1' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '08:00AM', endTime: '09:00AM', room: '305' }
                            ];
                        }
                        break;
                    case 'IT 213':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '12:00PM', endTime: '01:30PM', room: '320' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '02:00PM', endTime: '03:00PM', room: '320' }
                            ];
                        }
                        break;
                    case 'PATHFIT 3-B':
                        subjectSchedules = [
                            { dayOfWeek: 'S', startTime: '03:00PM', endTime: '04:30PM', room: 'Kinetics' }
                        ];
                        break;
                    case 'STAT':
                        subjectSchedules = [
                            { dayOfWeek: 'TTH', startTime: '06:00PM', endTime: '08:00PM', room: '320' }
                        ];
                        break;
                }
            }
            // 3rd Year - 1st Semester schedules
            if (subject.yearLevel === '3rd Year' && subject.semester === '1st Semester') {
                switch (subject.courseCode) {
                    case 'IT310':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'MW', startTime: '08:00AM', endTime: '09:00AM', room: '307' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'MW', startTime: '09:00AM', endTime: '10:30AM', room: 'CL-1' }
                            ];
                        }
                        break;
                    case 'IT311':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '05:00PM', endTime: '06:00PM', room: 'CL-1' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '06:00PM', endTime: '07:30PM', room: 'CL-2' }
                            ];
                        }
                        break;
                    case 'IT312':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'T', startTime: '11:00AM', endTime: '01:00PM', room: '308' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TH', startTime: '12:00PM', endTime: '01:30PM', room: '312' }
                            ];
                        }
                        break;
                    case 'ITELEC1':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '02:00PM', endTime: '03:00PM', room: '324' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '03:00PM', endTime: '04:30PM', room: '324' }
                            ];
                        }
                        break;
                    case 'ITTEL2':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '06:00PM', endTime: '08:00PM', room: '307' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '07:30PM', endTime: '09:00PM', room: '307' }
                            ];
                        }
                        break;
                    case 'STAT':
                        subjectSchedules = [
                            { dayOfWeek: 'TTH', startTime: '06:00PM', endTime: '08:00PM', room: '320' }
                        ];
                        break;
                    case 'TECHNO':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '06:00PM', endTime: '08:00PM', room: '320' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '07:30PM', endTime: '09:00PM', room: '320' }
                            ];
                        }
                        break;
                }
            }
            // 4th Year - 1st Semester schedules
            if (subject.yearLevel === '4th Year' && subject.semester === '1st Semester') {
                switch (subject.courseCode) {
                    case 'IT410':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'W', startTime: '01:30PM', endTime: '03:30PM', room: 'CL-1' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'TTH', startTime: '01:00PM', endTime: '02:30PM', room: 'CL-2' }
                            ];
                        }
                        break;
                    case 'IT411':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'F', startTime: '08:00AM', endTime: '10:00AM', room: '307' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'F', startTime: '01:00PM', endTime: '04:00PM', room: 'CL-2' }
                            ];
                        }
                        break;
                    case 'IT 412':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'F', startTime: '10:00AM', endTime: '12:00PM', room: '307' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'F', startTime: '04:30PM', endTime: '07:30PM', room: 'CL-2' }
                            ];
                        }
                        break;
                    case 'ITELEC3':
                        if (subject.courseDescription.includes('Lec')) {
                            subjectSchedules = [
                                { dayOfWeek: 'W', startTime: '04:00PM', endTime: '06:00PM', room: '307' }
                            ];
                        }
                        else if (subject.courseDescription.includes('Lab')) {
                            subjectSchedules = [
                                { dayOfWeek: 'T', startTime: '04:30PM', endTime: '07:30PM', room: 'CL-1' }
                            ];
                        }
                        break;
                    case 'RIZAL':
                        subjectSchedules = [
                            { dayOfWeek: 'TTH', startTime: '02:30PM', endTime: '04:00PM', room: '308' }
                        ];
                        break;
                }
            }
            // Add schedules for this subject
            subjectSchedules.forEach(schedule => {
                schedules.push({
                    subjectId: subject.id,
                    schoolYearId: schoolYear.id,
                    semesterId: firstSemester.id,
                    dayOfWeek: schedule.dayOfWeek,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    room: schedule.room,
                    maxStudents: 35,
                    currentEnrolled: 0,
                    isActive: true
                });
            });
        }
        yield database_1.SchedulesModel.bulkCreate(schedules, { ignoreDuplicates: true });
        console.log('✅ Schedules seeded successfully');
    }
    catch (error) {
        console.error('❌ Error seeding schedules:', error);
        throw error;
    }
});
exports.seedSchedules = seedSchedules;
