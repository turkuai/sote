<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegisterController;

// API Routes - must be BEFORE fallback to avoid Inertia catching them
Route::prefix('api')->group(function () {
    // Public endpoints
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/register', [RegisterController::class, 'register']);
    
    // Current authenticated user
    Route::get('/user', function () {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
                'role_type' => $user->role_type,
            ]);
        }
        return response()->json(['error' => 'Unauthenticated'], 401);
    });

    // Protected routes
    Route::middleware(['auth'])->group(function () {
        // Users API
        Route::get('/users', [UserController::class, 'index'])->middleware('checkRole:manager,admin');
        Route::post('/users', [UserController::class, 'store'])->middleware('checkRole:admin');
        Route::get('/users/{id}', [UserController::class, 'show'])->middleware('checkRole:manager,admin');
        Route::patch('/users/{id}', [UserController::class, 'update'])->middleware('checkRole:admin');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('checkRole:admin');

        // Roles API
        Route::get('/roles', [UserController::class, 'getRoles']);

        // Groups API
        Route::get('/groups', [GroupController::class, 'index'])->middleware('checkRole:manager,admin');
        Route::post('/groups', [GroupController::class, 'store'])->middleware('checkRole:admin');
        Route::get('/groups/{id}', [GroupController::class, 'show'])->middleware('checkRole:manager,admin');
        Route::patch('/groups/{id}', [GroupController::class, 'update'])->middleware('checkRole:admin');
        Route::delete('/groups/{id}', [GroupController::class, 'destroy'])->middleware('checkRole:admin');
        Route::post('/groups/{id}/users/{userId}', [GroupController::class, 'addUserToGroup'])->middleware('checkRole:admin');
        Route::delete('/groups/{id}/users/{userId}', [GroupController::class, 'removeUserFromGroup'])->middleware('checkRole:admin');

        // Permission Examples
        Route::get('/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getPermissions']);
        Route::get('/users/{id}/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getUserPermissions']);

        Route::post('/logout', [LoginController::class, 'logout']);
    });
});

// Web test endpoint
Route::get('/test-api', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
    ]);
});

// Page routes
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/test', function () {
        return Inertia::render('Test');
    })->name('Test');
});

// Fallback route for SPA - catch all unmatched routes and redirect to home
Route::fallback(function () {
    return redirect('/');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

