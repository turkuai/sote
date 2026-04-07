<?php

namespace App\Libraries;

/**
 * API Response Handler Library
 * Standardizes all API responses across the application
 */

class ApiResponse
{
    /**
     * Return a success response
     */
    public static function success($data = null, $message = null, $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Return a paginated response
     */
    public static function paginated($items, $message = null)
    {
        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'pagination' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'from' => $items->firstItem(),
                'to' => $items->lastItem(),
            ],
            'message' => $message,
        ]);
    }

    /**
     * Return an error response
     */
    public static function error($message, $code = null, $details = null, $statusCode = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'message' => $message,
                'code' => $code,
                'details' => $details,
            ],
        ], $statusCode);
    }

    /**
     * Return a validation error response
     */
    public static function validationError($errors)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'message' => 'Validation failed',
                'code' => 'VALIDATION_ERROR',
                'details' => $errors,
            ],
        ], 422);
    }

    /**
     * Return a not found error
     */
    public static function notFound($message = 'Resource not found')
    {
        return self::error($message, 'NOT_FOUND', null, 404);
    }

    /**
     * Return an unauthorized error
     */
    public static function unauthorized($message = 'Unauthorized')
    {
        return self::error($message, 'UNAUTHORIZED', null, 401);
    }

    /**
     * Return a forbidden error
     */
    public static function forbidden($message = 'Forbidden')
    {
        return self::error($message, 'FORBIDDEN', null, 403);
    }
}
