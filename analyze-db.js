const mysql = require('mysql2/promise');
require('dotenv').config();

async function analyzeDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'enroll_db'
    });

    try {
        console.log('🔍 Analyzing database structure...');
        
        // Get all tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`\n📋 Total tables found: ${tables.length}`);
        
        const tableAnalysis = [];
        
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            
            // Get table structure
            const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
            const [indexes] = await connection.execute(`SHOW INDEX FROM ${tableName}`);
            const [rowCount] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
            
            tableAnalysis.push({
                name: tableName,
                columns: columns.length,
                indexes: indexes.length,
                rows: rowCount[0].count,
                structure: columns
            });
        }
        
        // Display analysis
        console.log('\n📊 Table Analysis:');
        console.log('='.repeat(80));
        
        tableAnalysis.forEach(table => {
            console.log(`\n📋 Table: ${table.name}`);
            console.log(`   Columns: ${table.columns} | Indexes: ${table.indexes} | Rows: ${table.rows}`);
            
            // Identify potential issues
            if (table.indexes > 10) {
                console.log(`   ⚠️  WARNING: Too many indexes (${table.indexes}) - may cause "Too many keys" error`);
            }
            
            if (table.rows === 0) {
                console.log(`   💡 Empty table - consider if needed`);
            }
        });
        
        // Identify unnecessary tables
        console.log('\n🗑️  Potentially Unnecessary Tables:');
        console.log('='.repeat(80));
        
        const unnecessaryTables = tableAnalysis.filter(table => {
            // Tables that might be duplicates or unused
            return table.name.includes('_copy') || 
                   table.name.includes('_backup') ||
                   table.name.includes('_old') ||
                   table.name.includes('temp_') ||
                   table.rows === 0;
        });
        
        if (unnecessaryTables.length === 0) {
            console.log('✅ No obviously unnecessary tables found');
        } else {
            unnecessaryTables.forEach(table => {
                console.log(`   🗑️  ${table.name} - ${table.rows} rows`);
            });
        }
        
        // Check for required tables
        console.log('\n✅ Required Tables Check:');
        console.log('='.repeat(80));
        
        const requiredTables = ['users', 'students', 'user_sessions'];
        requiredTables.forEach(tableName => {
            const exists = tableAnalysis.find(t => t.name === tableName);
            if (exists) {
                console.log(`   ✅ ${tableName} - EXISTS`);
            } else {
                console.log(`   ❌ ${tableName} - MISSING`);
            }
        });
        
        // Recommendations
        console.log('\n💡 Recommendations:');
        console.log('='.repeat(80));
        
        const highIndexTables = tableAnalysis.filter(t => t.indexes > 10);
        if (highIndexTables.length > 0) {
            console.log('   🔧 Consider reducing indexes on these tables:');
            highIndexTables.forEach(table => {
                console.log(`      - ${table.name} (${table.indexes} indexes)`);
            });
        }
        
        console.log('\n   🚀 Your backend should now work with existing tables!');
        
    } catch (error) {
        console.error('❌ Error analyzing database:', error.message);
    } finally {
        await connection.end();
    }
}

analyzeDatabase();
