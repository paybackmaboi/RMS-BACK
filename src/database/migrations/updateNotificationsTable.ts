import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    try {
        // First, make requestId column nullable
        await queryInterface.changeColumn('notifications', 'requestId', {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            comment: 'Optional request ID for document requests, null for requirements announcements'
        });
        
        // Add type column for different notification types
        await queryInterface.addColumn('notifications', 'type', {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'request',
            comment: 'Type of notification: request, requirements_reminder, general, etc.'
        });
        
        console.log('✅ Updated notifications table: made requestId nullable and added type column');
    } catch (error) {
        console.error('❌ Error updating notifications table:', error);
        throw error;
    }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    try {
        // Remove type column
        await queryInterface.removeColumn('notifications', 'type');
        
        // Make requestId required again
        await queryInterface.changeColumn('notifications', 'requestId', {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: 'Request ID for document requests'
        });
        
        console.log('✅ Reverted notifications table changes');
    } catch (error) {
        console.error('❌ Error reverting notifications table changes:', error);
        throw error;
    }
}
