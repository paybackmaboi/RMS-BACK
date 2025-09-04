import { DepartmentModel, CourseModel, SchoolYearModel, SemesterModel, BsitCurriculumModel, BsitScheduleModel } from './database';

export const seedInitialData = async () => {
    try {
        console.log('🌱 Seeding initial data...');

        // Create departments
        await DepartmentModel.bulkCreate([
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
        await CourseModel.bulkCreate([
            {
                code: 'BSIT',
                name: 'Bachelor of Science in Information Technology',
                departmentId: 1, // CIT
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            },
            {
                code: 'BSCS',
                name: 'Bachelor of Science in Computer Science',
                departmentId: 1, // CIT
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            },
            {
                code: 'BSBA',
                name: 'Bachelor of Science in Business Administration',
                departmentId: 2, // CBE
                duration: 4,
                level: 'Undergraduate',
                isActive: true
            }
        ], { ignoreDuplicates: true });

        console.log('✅ Courses created');

        // Create school years
        await SchoolYearModel.bulkCreate([
            {
                year: '2025-2026',
                description: 'Academic Year 2025-2026',
                startDate: new Date('2025-08-01'),
                endDate: new Date('2026-07-31'),
                isCurrent: true,
                isActive: true
            },
            {
                year: '2024-2025',
                description: 'Academic Year 2024-2025',
                startDate: new Date('2024-08-01'),
                endDate: new Date('2025-07-31'),
                isCurrent: false,
                isActive: true
            }
        ], { ignoreDuplicates: true });

        console.log('✅ School years created');

        // Create semesters
        await SemesterModel.bulkCreate([
            {
                name: 'First Semester',
                code: '1ST',
                description: 'First semester of the academic year',
                startDate: new Date('2025-08-01'),
                endDate: new Date('2025-12-31'),
                isActive: true
            },
            {
                name: 'Second Semester',
                code: '2ND',
                description: 'Second semester of the academic year',
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-05-31'),
                isActive: true
            },
            {
                name: 'Summer',
                code: 'SUM',
                description: 'Summer semester',
                startDate: new Date('2026-06-01'),
                endDate: new Date('2026-07-31'),
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

        const bsitCourse = await CourseModel.findOne({ where: { code: 'BSIT' } });
        if (!bsitCourse) {
            throw new Error("BSIT course not found, cannot seed curriculum.");
        }

        // Fetch semesters and create a map of name -> id
        const semesters = await SemesterModel.findAll();
        const semesterMap = new Map(semesters.map(s => [s.name, s.id]));
        const firstSemId = semesterMap.get('First Semester');
        const secondSemId = semesterMap.get('Second Semester');

        if (!firstSemId || !secondSemId) {
            throw new Error("Required semesters not found in the database.");
        }

        const bsitCurriculum: Array<{
            courseId: number;
            courseCode: string;
            courseDescription: string;
            units: number;
            yearLevel: string;
            semesterId: number;
            courseType: 'Lecture' | 'Laboratory' | 'Both';
            prerequisites: string | undefined;
            isActive: boolean;
        }> = [
            // Your curriculum data here...
            { courseId: bsitCourse.id, courseCode: 'GE 1', courseDescription: 'Understanding the Self', units: 3, yearLevel: '1st Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'GE 2', courseDescription: 'Readings in Philippine History', units: 3, yearLevel: '1st Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT 101', courseDescription: 'Introduction to Information Technology', units: 3, yearLevel: '1st Year', semesterId: firstSemId, courseType: 'Both', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT 102', courseDescription: 'Computer Programming 1', units: 3, yearLevel: '1st Year', semesterId: firstSemId, courseType: 'Both', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'PE 1', courseDescription: 'Physical Education 1', units: 2, yearLevel: '1st Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'NSTP 1', courseDescription: 'National Service Training Program 1', units: 3, yearLevel: '1st Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT 103', courseDescription: 'Computer Programming 2', units: 3, yearLevel: '1st Year', semesterId: secondSemId, courseType: 'Both', prerequisites: 'IT 102', isActive: true },
            { courseId: bsitCourse.id, courseCode: 'PE 2', courseDescription: 'Physical Education 2', units: 2, yearLevel: '1st Year', semesterId: secondSemId, courseType: 'Laboratory', prerequisites: 'PE 1', isActive: true },
            { courseId: bsitCourse.id, courseCode: 'NSTP 2', courseDescription: 'National Service Training Program 2', units: 3, yearLevel: '1st Year', semesterId: secondSemId, courseType: 'Laboratory', prerequisites: 'NSTP 1', isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ARTAPP', courseDescription: 'Art Appreciation', units: 3, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'CW', courseDescription: 'The Contemporary World', units: 3, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT210', courseDescription: 'Data Structures & Algorithms - Lec', units: 2, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT210', courseDescription: 'Data Structures & Algorithms - Lab', units: 1, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT211', courseDescription: 'Platform Technologies (Intangible) - Lec', units: 2, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT211', courseDescription: 'Platform Technologies (Intangible) - Lab', units: 1, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT212', courseDescription: 'Web Systems & Technologies 1 - Lec', units: 2, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT212', courseDescription: 'Web Systems & Technologies 1 - Lab', units: 1, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT213', courseDescription: 'Introduction to Human Computer Interaction - Lec', units: 2, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT213', courseDescription: 'Introduction to Human Computer Interaction - Lab', units: 1, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'PATHFIT 3', courseDescription: 'Sports', units: 2, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'STAT', courseDescription: 'Statistics & Probability', units: 3, yearLevel: '2nd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT 206', courseDescription: 'Software Engineering', units: 3, yearLevel: '2nd Year', semesterId: secondSemId, courseType: 'Lecture', prerequisites: 'IT 205', isActive: true },
            { courseId: bsitCourse.id, courseCode: 'PE 4', courseDescription: 'Physical Education 4', units: 2, yearLevel: '2nd Year', semesterId: secondSemId, courseType: 'Laboratory', prerequisites: 'PE 3', isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT310', courseDescription: 'Applications Dev\'t. & Emerging Technologies - Lec', units: 2, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT310', courseDescription: 'Applications Dev\'t. & Emerging Technologies - Lab', units: 1, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT311', courseDescription: 'Operating Systems - Lec', units: 2, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT311', courseDescription: 'Operating Systems - Lab', units: 1, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT312', courseDescription: 'Human Computer Interaction - Lec', units: 2, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT312', courseDescription: 'Human Computer Interaction - Lab', units: 1, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ITELEC1', courseDescription: 'IT Elective I - Lec', units: 2, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ITELEC1', courseDescription: 'IT Elective I - Lab', units: 1, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ITTEL2', courseDescription: 'IT Track Elective II - Lec', units: 2, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ITTEL2', courseDescription: 'IT Track Elective II - Lab', units: 1, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'STAT', courseDescription: 'Statistics & Probability', units: 3, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'TECHNO', courseDescription: 'Technopreneurship - Lec', units: 2, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'TECHNO', courseDescription: 'Technopreneurship - Lab', units: 1, yearLevel: '3rd Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT 306', courseDescription: 'IT Capstone Project 1', units: 3, yearLevel: '3rd Year', semesterId: secondSemId, courseType: 'Both', prerequisites: 'IT 206, IT 210', isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT410', courseDescription: 'Capstone Project II - Lec', units: 2, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT410', courseDescription: 'Capstone Project II - Lab', units: 1, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT411', courseDescription: 'Integrative Programming & Technologies - Lec', units: 2, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT411', courseDescription: 'Integrative Programming & Technologies - Lab', units: 1, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT412', courseDescription: 'Systems Administration & Maintenance - Lec', units: 2, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT412', courseDescription: 'Systems Administration & Maintenance - Lab', units: 1, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ITELEC3', courseDescription: 'IT Elective III - Lec', units: 2, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'ITELEC3', courseDescription: 'IT Elective III - Lab', units: 1, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Laboratory', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'RIZAL', courseDescription: 'Rizal\'s Life & Works', units: 3, yearLevel: '4th Year', semesterId: firstSemId, courseType: 'Lecture', prerequisites: undefined, isActive: true },
            { courseId: bsitCourse.id, courseCode: 'IT 404', courseDescription: 'IT Thesis', units: 6, yearLevel: '4th Year', semesterId: secondSemId, courseType: 'Both', prerequisites: 'IT 401', isActive: true },
        ];

        await BsitCurriculumModel.bulkCreate(bsitCurriculum, { ignoreDuplicates: true, updateOnDuplicate: ['courseDescription', 'units', 'courseType'] });
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

        // Fetch semesters and create a map of name -> id
        const semesters = await SemesterModel.findAll();
        const semesterMap = new Map(semesters.map(s => [s.name, s.id]));
        const firstSemId = semesterMap.get('First Semester');

        if (!firstSemId) {
            throw new Error("'First Semester' not found in the database.");
        }
        
        // Fetch curriculum and build the map using existing semesters data
        const curriculum = await BsitCurriculumModel.findAll();
        const semesterIdToName = new Map(semesters.map(s => [s.id, s.name]));

        const curriculumMap = new Map();
        curriculum.forEach(course => {
            const semesterName = semesterIdToName.get(course.semesterId);
            if (semesterName) {
                const key = `${course.courseCode}-${course.courseDescription}-${course.yearLevel}-${semesterName}`;
                curriculumMap.set(key, course.id);
            }
        });

        // Debug: Log the curriculum map to see what keys are available
        console.log('📋 Available curriculum keys:', Array.from(curriculumMap.keys()));

        const schedules: Array<{
            curriculumId: number | undefined;
            schoolYear: string;
            semesterId: number;
            yearLevel: string;
            day: string;
            startTime: string;
            endTime: string;
            room: string;
            instructor: string;
            maxStudents: number;
            currentEnrollment: number;
            scheduleStatus: 'Open' | 'Closed' | 'Cancelled';
        }> = [
            // Your schedule data here...
            { curriculumId: curriculumMap.get('ARTAPP-Art Appreciation-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'TH', startTime: '09:00:00', endTime: '10:30:00', room: '307', instructor: 'Prof. Cruz', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('CW-The Contemporary World-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'F', startTime: '16:00:00', endTime: '17:30:00', room: '308', instructor: 'Prof. Reyes', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Closed' },
            { curriculumId: curriculumMap.get('CW-The Contemporary World-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'T', startTime: '18:00:00', endTime: '19:30:00', room: '308', instructor: 'Prof. Reyes', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Closed' },
            { curriculumId: curriculumMap.get('IT210-Data Structures & Algorithms - Lec-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'T', startTime: '08:30:00', endTime: '10:30:00', room: '307', instructor: 'Prof. Lopez', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT210-Data Structures & Algorithms - Lab-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'MW', startTime: '10:30:00', endTime: '12:00:00', room: 'CL-2', instructor: 'Prof. Lopez', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT211-Platform Technologies (Intangible) - Lec-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'T', startTime: '13:30:00', endTime: '15:30:00', room: 'CL-1', instructor: 'Prof. Torres', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT211-Platform Technologies (Intangible) - Lab-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'THF', startTime: '18:00:00', endTime: '19:30:00', room: 'CL-1', instructor: 'Prof. Torres', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT212-Web Systems & Technologies 1 - Lec-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'MW', startTime: '08:00:00', endTime: '09:00:00', room: '305', instructor: 'Prof. Garcia', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT212-Web Systems & Technologies 1 - Lab-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'MW', startTime: '09:00:00', endTime: '10:30:00', room: 'CL-2', instructor: 'Prof. Garcia', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT213-Introduction to Human Computer Interaction - Lec-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'TH', startTime: '14:30:00', endTime: '16:30:00', room: 'CL-1', instructor: 'Prof. Santos', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT213-Introduction to Human Computer Interaction - Lab-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'TTH', startTime: '10:30:00', endTime: '12:00:00', room: 'CL-2', instructor: 'Prof. Santos', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('PATHFIT 3-Sports-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'S', startTime: '10:00:00', endTime: '12:00:00', room: 'Kinetics', instructor: 'Coach Martinez', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Closed' },
            { curriculumId: curriculumMap.get('STAT-Statistics & Probability-2nd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '2nd Year', day: 'TTH', startTime: '16:30:00', endTime: '18:00:00', room: '320', instructor: 'Prof. Hernandez', maxStudents: 40, currentEnrollment: 0, scheduleStatus: 'Open' },
            // 3rd Year Schedules
            { curriculumId: curriculumMap.get('IT310-Applications Dev\'t. & Emerging Technologies - Lec-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '08:00:00', endTime: '09:00:00', room: '307', instructor: 'Prof. Santos', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT310-Applications Dev\'t. & Emerging Technologies - Lab-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '09:00:00', endTime: '10:30:00', room: 'CL-1', instructor: 'Prof. Santos', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },

            // 4th Year Schedules
            { curriculumId: curriculumMap.get('IT311-Operating Systems - Lec-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '17:00:00', endTime: '18:00:00', room: 'CL-2', instructor: 'Prof. Rivera', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT311-Operating Systems - Lab-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '18:00:00', endTime: '19:30:00', room: 'CL-2', instructor: 'Prof. Rivera', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT312-Human Computer Interaction - Lec-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'TTH', startTime: '08:00:00', endTime: '09:00:00', room: '308', instructor: 'Prof. David', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT312-Human Computer Interaction - Lab-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'TTH', startTime: '09:00:00', endTime: '10:30:00', room: 'CL-2', instructor: 'Prof. David', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('ITELEC1-IT Elective I - Lec-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'T', startTime: '11:00:00', endTime: '13:00:00', room: '312', instructor: 'Prof. Lim', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('ITELEC1-IT Elective I - Lab-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'T', startTime: '12:00:00', endTime: '13:30:00', room: 'CL-2', instructor: 'Prof. Lim', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('ITTEL2-IT Track Elective II - Lec-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '14:00:00', endTime: '15:00:00', room: 'CL-2', instructor: 'Prof. Tan', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('ITTEL2-IT Track Elective II - Lab-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '15:00:00', endTime: '16:30:00', room: 'CL-2', instructor: 'Prof. Tan', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('STAT-Statistics & Probability-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'TTH', startTime: '15:00:00', endTime: '16:30:00', room: '324', instructor: 'Prof. Gomez', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('TECHNO-Technopreneurship - Lec-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'TH', startTime: '18:00:00', endTime: '20:00:00', room: '308', instructor: 'Prof. Mercado', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('TECHNO-Technopreneurship - Lab-3rd Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '3rd Year', day: 'MW', startTime: '19:30:00', endTime: '21:00:00', room: 'CL-2', instructor: 'Prof. Mercado', maxStudents: 35, currentEnrollment: 0, scheduleStatus: 'Open' },

            // 4th Year Schedules
            { curriculumId: curriculumMap.get('IT410-Capstone Project II - Lec-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'W', startTime: '13:30:00', endTime: '15:30:00', room: 'CL-1', instructor: 'Prof. Diaz', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT410-Capstone Project II - Lab-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'TTH', startTime: '13:00:00', endTime: '14:30:00', room: 'CL-2', instructor: 'Prof. Diaz', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT411-Integrative Programming & Technologies - Lec-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'F', startTime: '08:00:00', endTime: '10:00:00', room: '307', instructor: 'Prof. Aquino', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT411-Integrative Programming & Technologies - Lab-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'F', startTime: '13:00:00', endTime: '16:00:00', room: 'CL-2', instructor: 'Prof. Aquino', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT412-Systems Administration & Maintenance - Lec-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'F', startTime: '10:00:00', endTime: '12:00:00', room: '307', instructor: 'Prof. Ramos', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('IT412-Systems Administration & Maintenance - Lab-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'F', startTime: '16:30:00', endTime: '19:30:00', room: 'CL-2', instructor: 'Prof. Ramos', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('ITELEC3-IT Elective III - Lec-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'W', startTime: '16:00:00', endTime: '18:00:00', room: '307', instructor: 'Prof. Lee', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('ITELEC3-IT Elective III - Lab-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'T', startTime: '16:30:00', endTime: '19:30:00', room: 'CL-1', instructor: 'Prof. Lee', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
            { curriculumId: curriculumMap.get('RIZAL-Rizal\'s Life & Works-4th Year-First Semester'), schoolYear: '2025-2026', semesterId: firstSemId, yearLevel: '4th Year', day: 'TTH', startTime: '14:30:00', endTime: '16:00:00', room: '308', instructor: 'Prof. Castro', maxStudents: 30, currentEnrollment: 0, scheduleStatus: 'Open' },
        ];

        // Debug: Log each schedule's curriculum lookup
        schedules.forEach((schedule, index) => {
            const lookupKey = Object.keys(schedule).find(key => key.includes('curriculumId')) ? 
                'Already has curriculumId' : 'Need to find curriculumId';
            console.log(`📅 Schedule ${index + 1}: ${lookupKey}`);
        });

        const validSchedules = schedules.filter(
            (schedule): schedule is (typeof schedule & { curriculumId: number }) => {
                if (schedule.curriculumId === undefined) {
                    console.warn(`⚠️  Curriculum ID not found for a schedule. Check map key generation.`);
                    return false;
                }
                return true;
            }
        );
        
        if (validSchedules.length > 0) {
            await BsitScheduleModel.bulkCreate(validSchedules, { ignoreDuplicates: true });
            console.log(`✅ BSIT Schedules seeded successfully (${validSchedules.length} schedules)`);
        } else {
            console.log('⚠️  No valid schedules to seed (curriculum not found for any provided schedule)');
        }
    } catch (error) {
        console.error('❌ Error seeding BSIT Schedules:', error);
        throw error;
    }
};