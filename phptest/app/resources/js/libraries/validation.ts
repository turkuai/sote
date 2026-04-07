/**
 * Validation Library
 * Common validation rules that work both frontend and backend
 */

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export class Validator {
    /**
     * Validate email format
     */
    static email(value: string, fieldName: string = 'Email'): ValidationError | null {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { field: fieldName, message: `${fieldName} must be a valid email address` };
        }
        return null;
    }

    /**
     * Validate required field
     */
    static required(value: any, fieldName: string = 'Field'): ValidationError | null {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return { field: fieldName, message: `${fieldName} is required` };
        }
        return null;
    }

    /**
     * Validate minimum length
     */
    static minLength(value: string, min: number, fieldName: string = 'Field'): ValidationError | null {
        if (value.length < min) {
            return { field: fieldName, message: `${fieldName} must be at least ${min} characters long` };
        }
        return null;
    }

    /**
     * Validate maximum length
     */
    static maxLength(value: string, max: number, fieldName: string = 'Field'): ValidationError | null {
        if (value.length > max) {
            return { field: fieldName, message: `${fieldName} must not exceed ${max} characters` };
        }
        return null;
    }

    /**
     * Validate number range
     */
    static range(value: number, min: number, max: number, fieldName: string = 'Field'): ValidationError | null {
        if (value < min || value > max) {
            return { field: fieldName, message: `${fieldName} must be between ${min} and ${max}` };
        }
        return null;
    }

    /**
     * Validate URL format
     */
    static url(value: string, fieldName: string = 'URL'): ValidationError | null {
        try {
            new URL(value);
            return null;
        } catch {
            return { field: fieldName, message: `${fieldName} must be a valid URL` };
        }
    }

    /**
     * Validate phone number (basic)
     */
    static phone(value: string, fieldName: string = 'Phone'): ValidationError | null {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            return { field: fieldName, message: `${fieldName} must be a valid phone number` };
        }
        return null;
    }

    /**
     * Validate object against multiple rules
     */
    static validateObject(obj: Record<string, any>, rules: Record<string, ((value: any) => ValidationError | null)[]>): ValidationResult {
        const errors: ValidationError[] = [];

        for (const [field, fieldRules] of Object.entries(rules)) {
            for (const rule of fieldRules) {
                const error = rule(obj[field]);
                if (error) {
                    errors.push(error);
                    break; // Stop at first error for this field
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}

/**
 * Hook for form validation
 */
export const useFormValidation = <T extends Record<string, any>>(
    initialValues: T,
    rules?: Record<keyof T, ((value: any) => ValidationError | null)[]>
) => {
    const [values, setValues] = React.useState(initialValues);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const validate = (): boolean => {
        if (!rules) return true;
        const result = Validator.validateObject(values, rules as any);
        const errorMap = result.errors.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {});
        setErrors(errorMap);
        return result.valid;
    };

    const handleChange = (field: keyof T, value: any) => {
        setValues({ ...values, [field]: value });
        if (errors[String(field)]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
    };

    return { values, errors, validate, handleChange, reset };
};

import React from 'react';
