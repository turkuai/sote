/**
 * API Response Handler Library
 * Standardizes all API responses across the application
 */

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: Record<string, any>;
    };
}

export interface ApiPaginatedResponse<T = any> {
    success: true;
    data: T[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
    };
    message?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is successful
 */
export const isSuccess = <T = any>(response: ApiResponse<T>): response is ApiSuccessResponse<T> => {
    return response.success === true;
};

/**
 * Type guard to check if response is an error
 */
export const isError = (response: ApiResponse): response is ApiErrorResponse => {
    return response.success === false;
};
