const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'test_db'
    });

    try {
        console.log('🔍 Checking database tables and indexes...');
        
        // Check all tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 Tables found:', tables.length);
        
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log(`\n📊 Table: ${tableName}`);
            
            // Check indexes for each table
            const [indexes] = await connection.execute(`SHOW INDEX FROM ${tableName}`);
            console.log(`   Indexes: ${indexes.length}`);
            
            if (indexes.length > 10) {
                console.log(`   ⚠️  WARNING: Table ${tableName} has ${indexes.length} indexes!`);
            }
            
            // Show index details
            indexes.forEach(index => {
                console.log(`     - ${index.Key_name}: ${index.Column_name} (${index.Non_unique ? 'Non-unique' : 'Unique'})`);
            });
        }
        
        // Check if user_sessions table exists
        const [userSessionsExists] = await connection.execute(`
            SELECT COUNT(*) as count FROM information_schema.tables 
            WHERE table_schema = '${process.env.DB_NAME || 'test_db'}' 
            AND table_name = 'user_sessions'
        `);
        
        if (userSessionsExists[0].count === 0) {
            console.log('\n❌ user_sessions table does not exist!');
            console.log('💡 You need to create it manually or run the database-setup.sql');
        } else {
            console.log('\n✅ user_sessions table exists');
        }
        
    } catch (error) {
        console.error('❌ Error checking database:', error.message);
    } finally {
        await connection.end();
    }
}

checkDatabase();
