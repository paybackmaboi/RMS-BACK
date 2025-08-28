import { DepartmentModel, CourseModel, SchoolYearModel, SemesterModel, BsitCurriculumModel, BsitScheduleModel } from './database';

export const seedInitialData = async () => {
    try {
        console.log('🌱 Seeding initial data...');

        // Create departments
        const departments = await DepartmentModel.bulkCreate([
            {
                code: 'CIT',
                name: 'College of Information Technology',
                description: 'Computer and IT programs',
                isActive: true
            },
            {
                code: 'CBE',
                name: 'College of Business and Economics',
                description: 'Business and economics programs',
                isActive: true
            },
            {
                code: 'CAS',
                name: 'College of Arts and Sciences',
                description: 'Liberal arts and sciences programs',
                isActive: true
            }
        ], { ignoreDuplicates: true });

        console.log('✅ Departments created');

        // Create courses
        const courses = await CourseModel.bulkCreate([
            {
                code: 'BSIT',
                name: 'Bachelor of Science in Information Technology',
                departmentId: 1, // CIT
                totalUnits: 144,
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            },
            {
                code: 'BSCS',
                name: 'Bachelor of Science in Computer Science',
                departmentId: 1, // CIT
                totalUnits: 144,
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            },
            {
                code: 'BSBA',
                name: 'Bachelor of Science in Business Administration',
                departmentId: 2, // CBE
                totalUnits: 144,
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            }
        ], { ignoreDuplicates: true });

        console.log('✅ Courses created');

        // Create school years
        const schoolYears = await SchoolYearModel.bulkCreate([
            {
                year: '2025-2026',
                description: 'Academic Year 2025-2026',
                startDate: new Date('2025-06-01'),
                endDate: new Date('2026-05-31'),
                isCurrent: true,
                isActive: true
            },
            {
                year: '2024-2025',
                description: 'Academic Year 2024-2025',
                startDate: new Date('2024-06-01'),
                endDate: new Date('2025-05-31'),
                isCurrent: false,
                isActive: true
            },
            {
                year: '2023-2024',
                description: 'Academic Year 2023-2024',
                startDate: new Date('2023-06-01'),
                endDate: new Date('2024-05-31'),
                isCurrent: false,
                isActive: true
            },
        ], { ignoreDuplicates: true });

        console.log('✅ School years created');

        // Create semesters
        const semesters = await SemesterModel.bulkCreate([
            {
                name: 'First Semester',
                code: '1ST',
                description: 'First semester of the academic year',
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-10-31'),
                isActive: true
            },
            {
                name: 'Second Semester',
                code: '2ND',
                description: 'Second semester of the academic year',
                startDate: new Date('2024-11-01'),
                endDate: new Date('2025-03-31'),
                isActive: true
            },
            {
                name: 'Summer',
                code: 'SUM',
                description: 'Summer semester',
                startDate: new Date('2025-04-01'),
                endDate: new Date('2025-05-31'),
                isActive: true
            }
        ], { ignoreDuplicates: true });

        console.log('✅ Semesters created');

        // Seed BSIT Curriculum
        await seedBsitCurriculum();
        
        // Seed BSIT Schedules
        await seedBsitSchedules();

        console.log('🎉 Initial data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
    }
};

// BSIT Curriculum Seeding
export const seedBsitCurriculum = async () => {
    try {
        console.log('📚 Seeding BSIT Curriculum...');

        const bsitCurriculum: Array<{
            courseCode: string;
            courseDescription: string;
            units: number;
            yearLevel: string;
            semester: string;
            courseType: 'Lecture' | 'Laboratory' | 'Both';
            prerequisites: string | undefined;
            isActive: boolean;
        }> = [
            // First Year - First Semester
            {
                courseCode: 'GE 1',
                courseDescription: 'Understanding the Self',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 2',
                courseDescription: 'Readings in Philippine History',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 3',
                courseDescription: 'Mathematics in the Modern World',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 4',
                courseDescription: 'Science, Technology and Society',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 5',
                courseDescription: 'Purposive Communication',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 6',
                courseDescription: 'Art Appreciation',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 7',
                courseDescription: 'Ethics',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 8',
                courseDescription: 'The Contemporary World',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'GE 9',
                courseDescription: 'Life and Works of Rizal',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'PE 1',
                courseDescription: 'Physical Education 1',
                units: 2,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'NSTP 1',
                courseDescription: 'National Service Training Program 1',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 101',
                courseDescription: 'Introduction to Information Technology',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 102',
                courseDescription: 'Computer Programming 1',
                units: 3,
                yearLevel: '1st Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },

            // First Year - Second Semester
            {
                courseCode: 'IT 103',
                courseDescription: 'Computer Programming 2',
                units: 3,
                yearLevel: '1st Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: 'IT 102',
                isActive: true
            },
            {
                courseCode: 'IT 104',
                courseDescription: 'Computer Organization and Architecture',
                units: 3,
                yearLevel: '1st Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 105',
                courseDescription: 'Discrete Mathematics',
                units: 3,
                yearLevel: '1st Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 106',
                courseDescription: 'Web Development Fundamentals',
                units: 3,
                yearLevel: '1st Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'PE 2',
                courseDescription: 'Physical Education 2',
                units: 2,
                yearLevel: '1st Year',
                semester: '2nd Semester',
                courseType: 'Laboratory',
                prerequisites: 'PE 1',
                isActive: true
            },
            {
                courseCode: 'NSTP 2',
                courseDescription: 'National Service Training Program 2',
                units: 3,
                yearLevel: '1st Year',
                semester: '2nd Semester',
                courseType: 'Laboratory',
                prerequisites: 'NSTP 1',
                isActive: true
            },

            // Second Year - First Semester
            {
                courseCode: 'IT 201',
                courseDescription: 'Data Structures and Algorithms',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 103',
                isActive: true
            },
            {
                courseCode: 'IT 202',
                courseDescription: 'Database Management Systems',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 101',
                isActive: true
            },
            {
                courseCode: 'IT 203',
                courseDescription: 'Object-Oriented Programming',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 103',
                isActive: true
            },
            {
                courseCode: 'IT 204',
                courseDescription: 'Computer Networks',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 104',
                isActive: true
            },
            {
                courseCode: 'IT 205',
                courseDescription: 'Systems Analysis and Design',
                units: 3,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 101',
                isActive: true
            },
            {
                courseCode: 'PE 3',
                courseDescription: 'Physical Education 3',
                units: 2,
                yearLevel: '2nd Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'PE 2',
                isActive: true
            },

            // Second Year - Second Semester
            {
                courseCode: 'IT 206',
                courseDescription: 'Software Engineering',
                units: 3,
                yearLevel: '2nd Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 205',
                isActive: true
            },
            {
                courseCode: 'IT 207',
                courseDescription: 'Web Application Development',
                units: 3,
                yearLevel: '2nd Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: 'IT 106, IT 203',
                isActive: true
            },
            {
                courseCode: 'IT 208',
                courseDescription: 'Mobile Application Development',
                units: 3,
                yearLevel: '2nd Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: 'IT 203',
                isActive: true
            },
            {
                courseCode: 'IT 209',
                courseDescription: 'Information Security',
                units: 3,
                yearLevel: '2nd Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 204',
                isActive: true
            },
            {
                courseCode: 'IT 210',
                courseDescription: 'IT Project Management',
                units: 3,
                yearLevel: '2nd Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: 'IT 205',
                isActive: true
            },
            {
                courseCode: 'PE 4',
                courseDescription: 'Physical Education 4',
                units: 2,
                yearLevel: '2nd Year',
                semester: '2nd Semester',
                courseType: 'Laboratory',
                prerequisites: 'PE 3',
                isActive: true
            },

            // Third Year - First Semester
            {
                courseCode: 'IT 301',
                courseDescription: 'Advanced Database Systems',
                units: 3,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 202',
                isActive: true
            },
            {
                courseCode: 'IT 302',
                courseDescription: 'Web Services and APIs',
                units: 3,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 207',
                isActive: true
            },
            {
                courseCode: 'IT 303',
                courseDescription: 'Cloud Computing',
                units: 3,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 204',
                isActive: true
            },
            {
                courseCode: 'IT 304',
                courseDescription: 'Data Analytics',
                units: 3,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 201',
                isActive: true
            },
            {
                courseCode: 'IT 305',
                courseDescription: 'IT Elective 1',
                units: 3,
                yearLevel: '3rd Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },

            // Third Year - Second Semester
            {
                courseCode: 'IT 306',
                courseDescription: 'IT Capstone Project 1',
                units: 3,
                yearLevel: '3rd Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: 'IT 206, IT 210',
                isActive: true
            },
            {
                courseCode: 'IT 307',
                courseDescription: 'Enterprise Systems',
                units: 3,
                yearLevel: '3rd Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: 'IT 202, IT 205',
                isActive: true
            },
            {
                courseCode: 'IT 308',
                courseDescription: 'IT Elective 2',
                units: 3,
                yearLevel: '3rd Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },
            {
                courseCode: 'IT 309',
                courseDescription: 'IT Elective 3',
                units: 3,
                yearLevel: '3rd Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },

            // Fourth Year - First Semester
            {
                courseCode: 'IT 401',
                courseDescription: 'IT Capstone Project 2',
                units: 3,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Both',
                prerequisites: 'IT 306',
                isActive: true
            },
            {
                courseCode: 'IT 402',
                courseDescription: 'IT Internship',
                units: 6,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Laboratory',
                prerequisites: 'Completion of 3rd Year',
                isActive: true
            },
            {
                courseCode: 'IT 403',
                courseDescription: 'IT Elective 4',
                units: 3,
                yearLevel: '4th Year',
                semester: '1st Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            },

            // Fourth Year - Second Semester
            {
                courseCode: 'IT 404',
                courseDescription: 'IT Thesis',
                units: 6,
                yearLevel: '4th Year',
                semester: '2nd Semester',
                courseType: 'Both',
                prerequisites: 'IT 401',
                isActive: true
            },
            {
                courseCode: 'IT 405',
                courseDescription: 'IT Elective 5',
                units: 3,
                yearLevel: '4th Year',
                semester: '2nd Semester',
                courseType: 'Lecture',
                prerequisites: undefined,
                isActive: true
            }
        ];

        await BsitCurriculumModel.bulkCreate(bsitCurriculum, { ignoreDuplicates: true });
        console.log('✅ BSIT Curriculum seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding BSIT Curriculum:', error);
        throw error;
    }
};

// BSIT Schedule Seeding
export const seedBsitSchedules = async () => {
    try {
        console.log('📅 Seeding BSIT Schedules...');

        // Get curriculum IDs for reference
        const curriculum = await BsitCurriculumModel.findAll();
        const curriculumMap = new Map();
        curriculum.forEach(course => {
            const key = `${course.courseCode}-${course.yearLevel}-${course.semester}`;
            curriculumMap.set(key, course.id);
        });

        const schedules: Array<{
            curriculumId: number;
            schoolYear: string;
            semester: string;
            yearLevel: string;
            day: string;
            startTime: Date;
            endTime: Date;
            room: string;
            instructor: string;
            maxStudents: number;
            currentEnrollment: number;
            scheduleStatus: 'Open' | 'Closed' | 'Cancelled';
        }> = [
            // First Year - First Semester Schedules
            {
                curriculumId: curriculumMap.get('IT 101-1st Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('IT 102-1st Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('GE 1-1st Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('GE 2-1st Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('PE 1-1st Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('IT 103-1st Year-2nd Semester'),
                schoolYear: '2025-2026',
                semester: '2nd Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('IT 104-1st Year-2nd Semester'),
                schoolYear: '2025-2026',
                semester: '2nd Semester',
                yearLevel: '1st Year',
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
                curriculumId: curriculumMap.get('IT 201-2nd Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '2nd Year',
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
                curriculumId: curriculumMap.get('IT 202-2nd Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '2nd Year',
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
                curriculumId: curriculumMap.get('IT 206-2nd Year-2nd Semester'),
                schoolYear: '2025-2026',
                semester: '2nd Semester',
                yearLevel: '2nd Year',
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
                curriculumId: curriculumMap.get('IT 301-3rd Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '3rd Year',
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
                curriculumId: curriculumMap.get('IT 306-3rd Year-2nd Semester'),
                schoolYear: '2025-2026',
                semester: '2nd Semester',
                yearLevel: '3rd Year',
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
                curriculumId: curriculumMap.get('IT 401-4th Year-1st Semester'),
                schoolYear: '2025-2026',
                semester: '1st Semester',
                yearLevel: '4th Year',
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
                curriculumId: curriculumMap.get('IT 404-4th Year-2nd Semester'),
                schoolYear: '2025-2026',
                semester: '2nd Semester',
                yearLevel: '4th Year',
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
            await BsitScheduleModel.bulkCreate(validSchedules, { ignoreDuplicates: true });
            console.log(`✅ BSIT Schedules seeded successfully (${validSchedules.length} schedules)`);
        } else {
            console.log('⚠️  No valid schedules to seed (curriculum not found)');
        }
    } catch (error) {
        console.error('❌ Error seeding BSIT Schedules:', error);
        throw error;
    }
}; 