import { sequelize } from './database';
import { QueryInterface } from 'sequelize';

export const initializeDatabaseSafely = async () => {
    const queryInterface = sequelize.getQueryInterface();
    
    try {
        console.log('🔧 Starting safe database initialization...');
        
        // Create tables one by one to avoid key limit issues
        const tables = [
            'users',
            'departments', 
            'courses',
            'students',
            'subjects',
            'school_years',
            'semesters',
            'schedules',
            'enrollments',
            'student_registrations',
            'bsit_curriculum',
            'bsit_schedules',
            'student_enrollments',
            'user_sessions',
            'requests',
            'notifications',
            'accounting',
            'login_history'
        ];

        for (const table of tables) {
            try {
                // Check if table exists
                const tableExists = await queryInterface.describeTable(table);
                if (tableExists) {
                    console.log(`✅ Table ${table} already exists`);
                    continue;
                }
            } catch (error) {
                // Table doesn't exist, create it
                console.log(`🔨 Creating table ${table}...`);
                
                // Create table based on model definition
                await sequelize.sync({ 
                    force: false,
                    alter: false,
                    match: new RegExp(`^${table}$`)
                });
                
                console.log(`✅ Table ${table} created successfully`);
            }
        }
        
        console.log('✅ Safe database initialization completed');
        
    } catch (error) {
        console.error('❌ Safe database initialization failed:', error);
        throw error;
    }
};
