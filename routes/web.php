<?php

use App\Http\Controllers\SurveyController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Survey routes
Route::get('/', [SurveyController::class, 'index']);
Route::post('/survey/check-email', [SurveyController::class, 'checkEmail']);
Route::post('/survey/submit', [SurveyController::class, 'submit']);
Route::post('/survey/save-draft', [SurveyController::class, 'saveDraft']);
Route::post('/survey/resume', [SurveyController::class, 'resume']);

// Admin routes
Route::get('/admin', [AdminController::class, 'index']);
Route::get('/admin/responses', [AdminController::class, 'responses']);
Route::get('/admin/responses/{id}/details', [AdminController::class, 'responseDetails']);
Route::get('/admin/export-csv', [AdminController::class, 'exportCsv']);

// Admin API (categories / questions CRUD)
Route::get('/admin/api/categories', [AdminController::class, 'categoriesJson']);
Route::post('/admin/api/categories', [AdminController::class, 'storeCategory']);
Route::put('/admin/api/categories/{id}', [AdminController::class, 'updateCategory']);
Route::delete('/admin/api/categories/{id}', [AdminController::class, 'deleteCategory']);
Route::post('/admin/api/questions', [AdminController::class, 'storeQuestion']);
Route::post('/admin/api/questions/reorder', [AdminController::class, 'reorderQuestions']);
Route::put('/admin/api/questions/{id}', [AdminController::class, 'updateQuestion']);
Route::delete('/admin/api/questions/{id}', [AdminController::class, 'deleteQuestion']);
