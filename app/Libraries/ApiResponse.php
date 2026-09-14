<?php

namespace App\Libraries;

use Illuminate\Pagination\LengthAwarePaginator;

class ApiResponse {
  /**
   * Return a successful response
   *
   * @param mixed $data
   * @param string $message
   * @param int $statusCode
   * @return \Illuminate\Http\JsonResponse
   */
  public static function success($data = null, $message = 'Success', $statusCode = 200) {
    return response()->json([
      'success' => true,
      'data' => $data,
      'message' => $message,
    ], $statusCode);
  }

  /**
   * Return an error response
   *
   * @param string $message
   * @param int $statusCode
   * @return \Illuminate\Http\JsonResponse
   */
  public static function error($message = 'Error', $statusCode = 400) {
    return response()->json([
      'success' => false,
      'message' => $message,
    ], $statusCode);
  }

  /**
   * Return a validation error response
   *
   * @param mixed $errors
   * @return \Illuminate\Http\JsonResponse
   */
  public static function validationError($errors) {
    return response()->json([
      'success' => false,
      'message' => 'Validation failed',
      'errors' => $errors,
    ], 422);
  }

  /**
   * Return a not found response
   *
   * @param string $message
   * @return \Illuminate\Http\JsonResponse
   */
  public static function notFound($message = 'Resource not found') {
    return response()->json([
      'success' => false,
      'message' => $message,
    ], 404);
  }

  /**
   * Return a paginated response
   *
   * @param mixed $data
   * @param string $message
   * @return \Illuminate\Http\JsonResponse
   */
  public static function paginated(LengthAwarePaginator $data, $message = 'Success') {
    return response()->json([
      'success' => true,
      'data' => $data->items(),
      'pagination' => [
        'total' => $data->total(),
        'per_page' => $data->perPage(),
        'current_page' => $data->currentPage(),
        'last_page' => $data->lastPage(),
        'from' => $data->firstItem(),
        'to' => $data->lastItem(),
      ],
      /*
              * In the frontend, ./grid/src/api/api.ts checks for a root-level
              * "totalPages" property. Specifically, line 86 contains:
              *
              * const pages = typeof payloadObj.totalPages === 'number'
              *   ? payloadObj.totalPages
              *   : 1;
              *
              * This means the frontend expects "totalPages" to exist directly
              * in the root of the response object.
              *
              * The paginated() response previously returned the page count only
              * as "pagination.last_page", so ServerGrid could not detect the total
              * number of pages and defaulted to 1.
              *
              * Although pagination metadata would logically belong inside the
              * "pagination" object, the current frontend implementation expects
              * "totalPages" at the root level. Therefore, it is also returned here
              * for compatibility with ServerGrid.
              *
              * At this point, api.ts should be treated as read-only because tai-grid
              * does not use this source file directly. The package uses the built
              * files from the dist folder. Therefore, modifying api.ts alone would
              * not affect the application. Changing this behavior in tai-grid would
              * require modifying the package source and rebuilding the package so
              * that the changes are reflected in dist.
            */
      'totalPages' => $data->lastPage(),
      'message' => $message,
    ]);
  }
}
