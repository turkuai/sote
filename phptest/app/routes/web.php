<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Libraries\ApiResponse;

// Test endpoint
Route::get('/test-api', function () {
    return ApiResponse::success([
        'message' => 'API is working!',
        'timestamp' => now(),
    ]);
});

Route::get('/', function () {
    return Inertia::render('Test');
})->name('home');

// API Routes
Route::prefix('api')->group(function () {
    // Users API
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Roles API
    Route::get('/roles', [UserController::class, 'getRoles']);

    // Groups API
    Route::get('/groups', [GroupController::class, 'index']);
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/{id}', [GroupController::class, 'show']);
    Route::put('/groups/{id}', [GroupController::class, 'update']);
    Route::delete('/groups/{id}', [GroupController::class, 'destroy']);

    // Permission Examples
    Route::get('/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getPermissions']);
    Route::get('/users/{id}/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getUserPermissions']);
});
