<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Test');
})->name('home');

// API endpoint test
Route::get('/api/test', function () {
    return response()->json([
        'message' => 'Hola desde Laravel!',
        'items' => ['uno', 'dos', 'tres']
    ]);
});
