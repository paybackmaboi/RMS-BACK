/**
 * Backend Helper Functions
 * Common utilities for server-side operations
 */

import { Response } from 'express';

/**
 * Standard API response format
 */
interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

/**
 * Send success response
 * @param res - Express response object
 * @param message - Success message
 * @param data - Optional data to send
 * @param statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = <T>(
    res: Response, 
    message: string, 
    data?: T, 
    statusCode: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data
    };
    res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param res - Express response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @param error - Optional error details
 */
export const sendError = (
    res: Response, 
    message: string, 
    statusCode: number = 400, 
    error?: string
): void => {
    const response: ApiResponse = {
        success: false,
        message,
        error
    };
    res.status(statusCode).json(response);
};

/**
 * Validate required fields in request body
 * @param body - Request body object
 * @param requiredFields - Array of required field names
 * @returns Object with isValid boolean and missing fields array
 */
export const validateRequiredFields = (
    body: any, 
    requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
        if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
            missingFields.push(field);
        }
    });
    
    return {
        isValid: missingFields.length === 0,
        missingFields
    };
};

/**
 * Generate a random string of specified length
 * @param length - Length of the string to generate
 * @returns Random string
 */
export const generateRandomString = (length: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Format date to MySQL datetime format
 * @param date - Date object or string
 * @returns Formatted date string
 */
export const formatDateForDB = (date: Date | string): string => {
    const dateObj = new Date(date);
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Sanitize string input to prevent XSS
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
};

/**
 * Check if email format is valid
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if phone number format is valid
 * @param phone - Phone number to validate
 * @returns True if valid phone format
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone?.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Log with timestamp and color coding
 * @param level - Log level (info, warn, error, success)
 * @param message - Message to log
 * @param data - Optional data to log
 */
export const logWithTimestamp = (
    level: 'info' | 'warn' | 'error' | 'success', 
    message: string, 
    data?: any
): void => {
    const timestamp = new Date().toISOString();
    const icons = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        success: '✅'
    };
    
    console.log(`${icons[level]} [${timestamp}] ${message}`);
    if (data) {
        console.log(data);
    }
};

/**
 * Calculate pagination offset
 * @param page - Current page number (1-based)
 * @param limit - Items per page
 * @returns Offset for database query
 */
export const calculateOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

/**
 * Create pagination metadata
 * @param totalItems - Total number of items
 * @param currentPage - Current page number
 * @param limit - Items per page
 * @returns Pagination metadata object
 */
export const createPaginationMeta = (
    totalItems: number, 
    currentPage: number, 
    limit: number
) => {
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
};
