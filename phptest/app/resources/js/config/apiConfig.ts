/**
 * API Client Configuration
 * Initialize the API client for use throughout the application
 */

import ApiClient from './libraries/apiClient';
import { ApiErrorResponse, ApiSuccessResponse } from './libraries/apiResponse';

// Global error handler
const handleApiError = (error: ApiErrorResponse) => {
    console.error('API Error:', error.error.message);
    // You can add custom error handling here (e.g., show toast notifications)
    if (error.error.code === '401') {
        // Handle unauthorized - redirect to login
        // window.location.href = '/login';
    }
};

// Global success handler
const handleApiSuccess = (response: ApiSuccessResponse) => {
    console.log('API Success:', response.message);
};

const apiClient = new ApiClient({
    baseUrl: '/api',
    timeout: 30000,
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    onError: handleApiError,
    onSuccess: handleApiSuccess,
});

export default apiClient;
