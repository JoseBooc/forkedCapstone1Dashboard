<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CareerPostingController;
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [UserController::class, 'login']);

Route::get('/career-postings', [CareerPostingController::class, 'index']);
Route::post('/career-postings', [CareerPostingController::class, 'store']);
Route::get('/jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);
Route::patch('/jobs/{job}/approve', [JobController::class, 'approve']);