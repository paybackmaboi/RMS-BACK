import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    try {
        // Add profilePhoto column to users table
        await queryInterface.addColumn('users', 'profilePhoto', {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL to stored profile photo'
        });
        
        console.log('✅ Added profilePhoto column to users table');
    } catch (error) {
        console.error('❌ Error adding profilePhoto column:', error);
        throw error;
    }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    try {
        // Remove profilePhoto column from users table
        await queryInterface.removeColumn('users', 'profilePhoto');
        
        console.log('✅ Removed profilePhoto column from users table');
    } catch (error) {
        console.error('❌ Error removing profilePhoto column:', error);
        throw error;
    }
}
