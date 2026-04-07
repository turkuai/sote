/**
 * API Client Library
 * Unified fetch wrapper with error handling, type safety, and interceptors
 */

import { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from './apiResponse';

interface RequestConfig {
    headers?: Record<string, string>;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, any> | FormData;
    params?: Record<string, any>;
}

interface ApiClientConfig {
    baseUrl: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    onError?: (error: ApiErrorResponse) => void;
    onSuccess?: (response: ApiSuccessResponse) => void;
}

class ApiClient {
    private baseUrl: string;
    private timeout: number;
    private defaultHeaders: Record<string, string>;
    private onError?: (error: ApiErrorResponse) => void;
    private onSuccess?: (response: ApiSuccessResponse) => void;

    constructor(config: ApiClientConfig) {
        this.baseUrl = config.baseUrl;
        this.timeout = config.timeout || 30000;
        this.defaultHeaders = config.defaultHeaders || {
            'Content-Type': 'application/json',
        };
        this.onError = config.onError;
        this.onSuccess = config.onSuccess;
    }

    private buildUrl(endpoint: string, params?: Record<string, any>): string {
        const url = new URL(this.baseUrl + endpoint);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }
        return url.toString();
    }

    private buildHeaders(config?: RequestConfig): HeadersInit {
        return {
            ...this.defaultHeaders,
            ...config?.headers,
        };
    }

    private async handleResponse<T = any>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error: ApiErrorResponse = {
                success: false,
                error: {
                    message: data?.error?.message || 'An error occurred',
                    code: String(response.status),
                    details: data?.error?.details || data,
                },
            };

            if (this.onError) {
                this.onError(error);
            }

            throw error;
        }

        return data as ApiResponse<T>;
    }

    async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiSuccessResponse<T>> {
        const response = await fetch(this.buildUrl(endpoint, config?.params), {
            method: 'GET',
            headers: this.buildHeaders(config),
            signal: AbortSignal.timeout(this.timeout),
        });

        return (await this.handleResponse<T>(response)) as ApiSuccessResponse<T>;
    }

    async post<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiSuccessResponse<T>> {
        const response = await fetch(this.buildUrl(endpoint), {
            method: 'POST',
            headers: this.buildHeaders(config),
            body: body instanceof FormData ? body : JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout),
        });

        const result = await this.handleResponse<T>(response);
        if (this.onSuccess) {
            this.onSuccess(result as ApiSuccessResponse);
        }
        return result as ApiSuccessResponse<T>;
    }

    async put<T = any>(endpoint: string, body?: any, config?: RequestConfig): Promise<ApiSuccessResponse<T>> {
        const response = await fetch(this.buildUrl(endpoint), {
            method: 'PUT',
            headers: this.buildHeaders(config),
            body: body instanceof FormData ? body : JSON.stringify(body),
            signal: AbortSignal.timeout(this.timeout),
        });

        return (await this.handleResponse<T>(response)) as ApiSuccessResponse<T>;
    }

    async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiSuccessResponse<T>> {
        const response = await fetch(this.buildUrl(endpoint), {
            method: 'DELETE',
            headers: this.buildHeaders(config),
            signal: AbortSignal.timeout(this.timeout),
        });

        return (await this.handleResponse<T>(response)) as ApiSuccessResponse<T>;
    }
}

export default ApiClient;
