import { DepartmentModel, CourseModel, SchoolYearModel, SemesterModel } from './database';

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
                year: '2024-2025',
                description: 'Academic Year 2024-2025',
                startDate: new Date('2024-06-01'),
                endDate: new Date('2025-05-31'),
                isCurrent: true,
                isActive: true
            },
            {
                year: '2023-2024',
                description: 'Academic Year 2023-2024',
                startDate: new Date('2023-06-01'),
                endDate: new Date('2024-05-31'),
                isCurrent: false,
                isActive: true
            }
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

        console.log('🎉 Initial data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
    }
}; 