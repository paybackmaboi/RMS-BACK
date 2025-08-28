const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSchema() {
    let connection;
    
    try {
        console.log('🔍 Checking current database schema...');
        
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'rms_db'
        });
        
        console.log('✅ Connected to database');
        
        // Check notifications table structure
        const [columns] = await connection.execute('DESCRIBE notifications');
        console.log('\n📋 Current notifications table structure:');
        columns.forEach(col => {
            console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });
        
        // Check if type column exists
        const typeColumn = columns.find(col => col.Field === 'type');
        if (typeColumn) {
            console.log('\n✅ Type column exists:', typeColumn);
        } else {
            console.log('\n❌ Type column is missing!');
        }
        
        // Check if requestId is nullable
        const requestIdColumn = columns.find(col => col.Field === 'requestId');
        if (requestIdColumn) {
            console.log('✅ RequestId column exists:', requestIdColumn);
            if (requestIdColumn.Null === 'YES') {
                console.log('✅ RequestId is nullable');
            } else {
                console.log('❌ RequestId is NOT nullable');
            }
        } else {
            console.log('❌ RequestId column is missing!');
        }
        
    } catch (error) {
        console.error('❌ Error checking schema:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run the check
checkSchema();
