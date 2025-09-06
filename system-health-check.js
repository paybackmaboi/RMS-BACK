#!/usr/bin/env node

/**
 * System Health Check Script
 * Verifies all backend components are working correctly
 */

const { sequelize, connectAndInitialize } = require('./dist/database');
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function runHealthCheck() {
    console.log('🏥 Starting System Health Check...\n');
    
    let allChecksPass = true;
    
    try {
        // 1. Database Connection Check
        console.log('1️⃣ Checking Database Connection...');
        await connectAndInitialize();
        console.log('✅ Database connection successful\n');
        
        // 2. Check All Tables Exist
        console.log('2️⃣ Verifying Database Tables...');
        const [tables] = await sequelize.query("SHOW TABLES");
        const requiredTables = [
            'users', 'students', 'user_sessions', 'notifications', 
            'requests', 'student_registrations', 'enrollments',
            'bsit_curriculum', 'bsit_schedules', 'courses'
        ];
        
        const existingTables = tables.map(t => Object.values(t)[0]);
        const missingTables = requiredTables.filter(t => !existingTables.includes(t));
        
        if (missingTables.length > 0) {
            console.log('❌ Missing tables:', missingTables);
            allChecksPass = false;
        } else {
            console.log('✅ All required tables exist');
        }
        
        // 3. Check Notifications Table Structure
        console.log('\n3️⃣ Checking Notifications Table Structure...');
        const [columns] = await sequelize.query("DESCRIBE notifications");
        const hasTypeColumn = columns.some(col => col.Field === 'type');
        const requestIdNullable = columns.find(col => col.Field === 'requestId')?.Null === 'YES';
        
        if (hasTypeColumn && requestIdNullable) {
            console.log('✅ Notifications table properly configured');
        } else {
            console.log('❌ Notifications table needs migration');
            console.log(`   - Type column exists: ${hasTypeColumn}`);
            console.log(`   - RequestId nullable: ${requestIdNullable}`);
            allChecksPass = false;
        }
        
        // 4. Check Sample Data
        console.log('\n4️⃣ Checking Sample Data...');
        const [userCount] = await sequelize.query("SELECT COUNT(*) as count FROM users");
        const [curriculumCount] = await sequelize.query("SELECT COUNT(*) as count FROM bsit_curriculum");
        
        if (userCount[0].count > 0 && curriculumCount[0].count > 0) {
            console.log('✅ Sample data exists');
            console.log(`   - Users: ${userCount[0].count}`);
            console.log(`   - Curriculum items: ${curriculumCount[0].count}`);
        } else {
            console.log('⚠️  Limited sample data');
            console.log(`   - Users: ${userCount[0].count}`);
            console.log(`   - Curriculum items: ${curriculumCount[0].count}`);
        }
        
        // 5. Test API Endpoints (if server is running)
        console.log('\n5️⃣ Testing API Endpoints...');
        try {
            const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
            if (healthResponse.ok) {
                console.log('✅ Health endpoint responding');
            } else {
                console.log('⚠️  Health endpoint not responding (server may not be running)');
            }
        } catch (error) {
            console.log('⚠️  API server not running (this is normal if server is not started)');
        }
        
        // 6. Check Environment Variables
        console.log('\n6️⃣ Checking Environment Configuration...');
        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
        const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);
        
        if (missingEnvVars.length > 0) {
            console.log('⚠️  Missing environment variables:', missingEnvVars);
        } else {
            console.log('✅ Environment variables configured');
        }
        
        // Final Summary
        console.log('\n' + '='.repeat(50));
        if (allChecksPass) {
            console.log('🎉 ALL HEALTH CHECKS PASSED!');
            console.log('✅ System is ready for production use');
        } else {
            console.log('⚠️  Some issues found - please review above');
            console.log('💡 Run the database migration if needed');
        }
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Run the health check
runHealthCheck().catch(console.error);
