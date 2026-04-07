<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\Api\LoginController;
use App\Libraries\ApiResponse;

Route::get('/test-api', function () {
    return ApiResponse::success([
        'message' => 'API is working!',
        'timestamp' => now(),
    ]);
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public API Routes
Route::prefix('api')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    
    // Current authenticated user (returns 401 if not authenticated)
    Route::get('/user', function () {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();
            return response()->json($user);
        }
        return response()->json(['error' => 'Unauthenticated'], 401);
    });
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/test', function () {
        return Inertia::render('Test');
    })->name('Test');

    // Protected API Routes
    Route::prefix('api')->group(function () {
        Route::post('/logout', [LoginController::class, 'logout']);
        
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
});

// Fallback route for SPA - catch all unmatched routes and redirect to home
Route::fallback(function () {
    return redirect('/');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

