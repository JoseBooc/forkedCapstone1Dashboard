<?php

use App\Http\Controllers\SurveyController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Serve the React landing page at the root URL.
Route::get('/', function () {
    $indexPath = public_path('index.html');

    if (file_exists($indexPath)) {
        return file_get_contents($indexPath);
    }

    abort(500, 'Frontend build not found. Run the frontend build and copy the output to public/index.html.');
});

// Survey routes
Route::get('/survey', [SurveyController::class, 'index']);
Route::post('/survey/check-email', [SurveyController::class, 'checkEmail']);
Route::post('/survey/submit', [SurveyController::class, 'submit']);
Route::post('/survey/save-draft', [SurveyController::class, 'saveDraft']);
Route::post('/survey/resume', [SurveyController::class, 'resume']);

// Admin routes
Route::get('/admin', [AdminController::class, 'index']);
Route::get('/admin/responses', [AdminController::class, 'responses']);
Route::get('/admin/responses/{id}/details', [AdminController::class, 'responseDetails']);
Route::get('/admin/export-csv', [AdminController::class, 'exportCsv']);

// Career opportunity posting page mount
Route::view('/career-opportunities/post', 'career.post-opportunity')->name('career.post');

// Admin API (categories / questions CRUD)
Route::get('/admin/api/categories', [AdminController::class, 'categoriesJson']);
Route::post('/admin/api/categories', [AdminController::class, 'storeCategory']);
Route::put('/admin/api/categories/{id}', [AdminController::class, 'updateCategory']);
Route::delete('/admin/api/categories/{id}', [AdminController::class, 'deleteCategory']);
Route::post('/admin/api/questions', [AdminController::class, 'storeQuestion']);
Route::post('/admin/api/questions/reorder', [AdminController::class, 'reorderQuestions']);
Route::put('/admin/api/questions/{id}', [AdminController::class, 'updateQuestion']);
Route::delete('/admin/api/questions/{id}', [AdminController::class, 'deleteQuestion']);
