<?php

use IllGet-ChildItem C:\xampp\mysql\data\*.err | Get-Contentollers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\Api\LoginController;
use App\Libraries\ApiResponse;

// Public endpoints
Route::post('/login', [LoginController::class, 'login']);

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
    Route::patch('/users/{id}', [UserController::class, 'update'])->middleware('checkRole:admin,manager');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('checkRole:admin');

    // Roles API
    Route::get('/roles', [UserController::class, 'getRoles']);

    // Groups API
    Route::get('/groups', [GroupController::class, 'index'])->middleware('checkRole:manager,admin');
    Route::post('/groups', [GroupController::class, 'store'])->middleware('checkRole:manager,admin');
    Route::get('/groups/{id}', [GroupController::class, 'show'])->middleware('checkRole:manager,admin');
    Route::patch('/groups/{id}', [GroupController::class, 'update'])->middleware('checkRole:admin');
    Route::delete('/groups/{id}', [GroupController::class, 'destroy'])->middleware('checkRole:admin');
    Route::post('/groups/{id}/users/{userId}', [GroupController::class, 'addUserToGroup'])->middleware('checkRole:admin');
    Route::delete('/groups/{id}/users/{userId}', [GroupController::class, 'removeUserFromGroup'])->middleware('checkRole:admin');

    
    // Permission Examples
    Route::get('/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getPermissions']);
    Route::get('/users/{id}/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getUserPermissions']);

    // Authentication API
    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/logout', [LoginController::class, 'logout']);
});
