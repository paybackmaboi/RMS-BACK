import { Request, Response, NextFunction } from 'express';
import { SettingsModel } from '../database';

interface ExpressRequest extends Request {
    user?: {
        id: number;
        role: 'student' | 'admin' | 'accounting';
        idNumber?: string;
        firstName?: string;
        lastName?: string;
    };
}

/**
 * Get all settings or specific setting by key
 */
export const getSettings = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { key, category } = req.query;

        let whereClause: any = {};
        
        if (key) {
            whereClause.key = key;
        }
        
        if (category) {
            whereClause.category = category;
        }

        const settings = await SettingsModel.findAll({
            where: whereClause,
            order: [['category', 'ASC'], ['key', 'ASC']]
        });

        // If requesting a specific key, return just that setting's value
        if (key && settings.length === 1) {
            res.json({
                success: true,
                data: {
                    key: settings[0].key,
                    value: settings[0].value,
                    description: settings[0].description,
                    category: settings[0].category
                }
            });
        } else {
            res.json({
                success: true,
                data: settings
            });
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings'
        });
    }
};

/**
 * Update or create a setting
 */
export const updateSetting = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { key, value, description, category } = req.body;

        if (!key || value === undefined) {
            res.status(400).json({
                success: false,
                message: 'Key and value are required'
            });
            return;
        }

        // Check if setting exists
        let setting = await SettingsModel.findOne({ where: { key } });

        if (setting) {
            // Update existing setting
            setting.value = value;
            if (description !== undefined) setting.description = description;
            if (category !== undefined) setting.category = category;
            await setting.save();
        } else {
            // Create new setting
            setting = await SettingsModel.create({
                key,
                value,
                description: description || null,
                category: category || 'general'
            });
        }

        res.json({
            success: true,
            message: 'Setting updated successfully',
            data: {
                key: setting.key,
                value: setting.value,
                description: setting.description,
                category: setting.category
            }
        });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting'
        });
    }
};

/**
 * Delete a setting
 */
export const deleteSetting = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { key } = req.params;

        const deleted = await SettingsModel.destroy({
            where: { key }
        });

        if (deleted === 0) {
            res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
            return;
        }

        res.json({
            success: true,
            message: 'Setting deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting setting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete setting'
        });
    }
};

/**
 * Initialize default settings
 */
export const initializeDefaultSettings = async (): Promise<void> => {
    try {
        const defaultSettings = [
            {
                key: 'login_title',
                value: '🔐 Welcome Back',
                description: 'Title displayed on the login form',
                category: 'ui'
            },
            {
                key: 'login_subtitle',
                value: 'Sign in to your account with your ID and password',
                description: 'Subtitle displayed on the login form',
                category: 'ui'
            },
            {
                key: 'system_name',
                value: 'Student Records Management System',
                description: 'Name of the system displayed in various places',
                category: 'general'
            },
            {
                key: 'institution_name',
                value: 'Benedicto College',
                description: 'Name of the institution',
                category: 'general'
            }
        ];

        for (const settingData of defaultSettings) {
            const existingSetting = await SettingsModel.findOne({ 
                where: { key: settingData.key } 
            });

            if (!existingSetting) {
                await SettingsModel.create(settingData);
                console.log(`✅ Created default setting: ${settingData.key}`);
            }
        }
    } catch (error) {
        console.error('Error initializing default settings:', error);
    }
};
