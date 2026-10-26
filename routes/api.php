<?php

use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\CareController;

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
    Route::patch('/users/{id}', [UserController::class, 'update'])->middleware('checkRole:admin,manager');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('checkRole:admin');

    // Roles API
    Route::get('/roles', [UserController::class, 'getRoles']);

    // Groups API
    Route::get('/groups/my', [GroupController::class, 'myGroups']);
    Route::post('/groups/join', [GroupController::class, 'join']);
    Route::get('/groups', [GroupController::class, 'index'])->middleware('checkRole:manager,admin');
    Route::post('/groups', [GroupController::class, 'store'])->middleware('checkRole:admin,manager');
    Route::get('/groups/{id}/registered-users', [GroupController::class, 'getRegisteredUsers'])->middleware('checkRole:manager,admin');
    Route::get('/groups/{id}/unregistered-users', [GroupController::class, 'getUnregisteredUsers'])->middleware('checkRole:manager,admin');
    Route::patch('/groups/{id}', [GroupController::class, 'update'])->middleware('checkRole:admin,manager');
    Route::delete('/groups/{id}', [GroupController::class, 'destroy'])->middleware('checkRole:admin,manager');
    Route::post('/groups/{id}/users/{userId}', [GroupController::class, 'addUserToGroup'])->middleware('checkRole:admin,manager');
    Route::delete('/groups/{id}/users/{userId}', [GroupController::class, 'removeUserFromGroup'])->middleware('checkRole:admin,manager');

    // Permission Examples
    Route::get('/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getPermissions']);
    Route::get('/users/{id}/permissions', [\App\Http\Controllers\PermissionExampleController::class, 'getUserPermissions']);

    Route::post('/logout', [LoginController::class, 'logout']);

    // Patients API
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store'])->middleware('checkRole:admin,manager');
    Route::get('patients/user-patients', [PatientController::class, 'getUserPatients']);
    Route::patch('/patients/{id}', [PatientController::class, 'update'])->middleware('checkRole:admin,manager');
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::get('/patients/{id}/groups', [PatientController::class, 'getGroups'])->middleware('checkRole:admin');
    Route::post('/patients/{id}/groups', [PatientController::class, 'addToGroup'])->middleware('checkRole:admin,manager');
    Route::delete('/patients/{id}/groups/{groupId}', [PatientController::class, 'removeFromGroup'])
      ->middleware('checkRole:admin,manager');

    // Care API
    Route::get('/care/categories', [CareController::class, 'fetchCareCategories']);
    Route::get('/care/{patientId}', [CareController::class, 'fetchPatientProblems']);
    Route::post('/care/problem', [CareController::class, 'addProblem'])->middleware('checkRole:admin,manager');
    Route::post('/care/problem/item', [CareController::class, 'addProblemItem']);
    Route::patch('/care/problem/{id}', [CareController::class, 'updateProblem'])->middleware('checkRole:admin,manager');
    Route::patch('/care/problem/item/{id}', [CareController::class, 'updateProblemItem']);
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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
