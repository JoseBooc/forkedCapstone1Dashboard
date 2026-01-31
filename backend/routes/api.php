<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel API working'
    ]);
});

// Authentication API
Route::post('/login', [UserController::class, 'login']); // Login/authenticate user

// User Management API
Route::get('/users', [UserController::class, 'index']); // Get all users
Route::post('/users', [UserController::class, 'store']); // Create new user
Route::get('/users/{email}', [UserController::class, 'show']); // Get user by email
Route::put('/users/{email}', [UserController::class, 'update']); // Update user by email
Route::put('/users/id/{id}', [UserController::class, 'updateById']); // Update user by ID
Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete user by ID
Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']); // Block/Unblock user
