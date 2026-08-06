<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DonationCampaignController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\GivebackProjectController;
use App\Http\Controllers\Api\GivebackProjectEventController;
use App\Http\Controllers\Api\GivebackProgramController;
use App\Http\Controllers\Api\EngagementActivityController;
use App\Http\Controllers\Api\EngagementRegistrationController;
use App\Http\Controllers\Api\GivebackPostController;
use App\Http\Controllers\Api\GivebackAnalyticsController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel API working'
    ]);
});

// Authentication API
Route::post('/login', [UserController::class, 'login']);

// User Management API
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/pending/list', [UserController::class, 'getPendingUsers']);
Route::get('/users/analytics/course-approvals', [UserController::class, 'getCourseAnalytics']);
Route::get('/users/{email}', [UserController::class, 'show']);
Route::put('/users/{email}', [UserController::class, 'update']);
Route::post('/users/{email}/profile-image', [UserController::class, 'uploadProfileImage']);
Route::put('/users/id/{id}', [UserController::class, 'updateById']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
Route::patch('/users/{id}/approve', [UserController::class, 'approveUser']);
Route::patch('/users/{id}/disapprove', [UserController::class, 'disapproveUser']);

// Donation Campaign API
Route::get('/campaigns', [DonationCampaignController::class, 'index']);
Route::get('/campaigns/{id}', [DonationCampaignController::class, 'show']);
Route::post('/campaigns', [DonationCampaignController::class, 'store']);
Route::put('/campaigns/{id}', [DonationCampaignController::class, 'update']);
Route::delete('/campaigns/{id}', [DonationCampaignController::class, 'destroy']);
Route::post('/campaigns/{id}/donate', [DonationCampaignController::class, 'addDonation']);
Route::patch('/campaigns/{id}/toggle-active', [DonationCampaignController::class, 'toggleActive']);
Route::get('/campaigns/{id}/donors', [DonationCampaignController::class, 'getDonors']);

// Donation API
Route::post('/donations', [DonationController::class, 'store']);
Route::get('/donations', [DonationController::class, 'index']);
Route::patch('/donations/{id}/payment-status', [DonationController::class, 'updatePaymentStatus']);
Route::get('/donations/email/{email}', [DonationController::class, 'getByEmail']);
Route::get('/donations/statistics', [DonationController::class, 'getStatistics']);
Route::get('/donations/analytics', [DonationController::class, 'getAnalytics']);

// GiveBack Projects API
Route::get('/giveback/projects', [GivebackProjectController::class, 'index']);
Route::get('/giveback/projects/{id}', [GivebackProjectController::class, 'show']);
Route::post('/giveback/projects', [GivebackProjectController::class, 'store']);
Route::put('/giveback/projects/{id}', [GivebackProjectController::class, 'update']);
Route::delete('/giveback/projects/{id}', [GivebackProjectController::class, 'destroy']);
Route::patch('/giveback/projects/{id}/archive', [GivebackProjectController::class, 'archive']);
Route::patch('/giveback/projects/{id}/restore', [GivebackProjectController::class, 'restore']);

// GiveBack Project Events API
Route::get('/giveback/project-events', [GivebackProjectEventController::class, 'index']);
Route::post('/giveback/project-events', [GivebackProjectEventController::class, 'store']);
Route::put('/giveback/project-events/{id}', [GivebackProjectEventController::class, 'update']);
Route::delete('/giveback/project-events/{id}', [GivebackProjectEventController::class, 'destroy']);
Route::patch('/giveback/project-events/{id}/archive', [GivebackProjectEventController::class, 'archive']);
Route::patch('/giveback/project-events/{id}/restore', [GivebackProjectEventController::class, 'restore']);

// GiveBack Programs API
Route::get('/giveback/programs', [GivebackProgramController::class, 'index']);
Route::get('/giveback/programs/{id}', [GivebackProgramController::class, 'show']);
Route::post('/giveback/programs', [GivebackProgramController::class, 'store']);
Route::put('/giveback/programs/{id}', [GivebackProgramController::class, 'update']);
Route::delete('/giveback/programs/{id}', [GivebackProgramController::class, 'destroy']);
Route::patch('/giveback/programs/{id}/archive', [GivebackProgramController::class, 'archive']);
Route::patch('/giveback/programs/{id}/restore', [GivebackProgramController::class, 'restore']);

// Community Engagement Activities API
Route::get('/giveback/activities', [EngagementActivityController::class, 'index']);
Route::get('/giveback/activities/{id}', [EngagementActivityController::class, 'show']);
Route::post('/giveback/activities', [EngagementActivityController::class, 'store']);
Route::put('/giveback/activities/{id}', [EngagementActivityController::class, 'update']);
Route::delete('/giveback/activities/{id}', [EngagementActivityController::class, 'destroy']);
Route::patch('/giveback/activities/{id}/toggle-registration', [EngagementActivityController::class, 'toggleRegistration']);
Route::patch('/giveback/activities/{id}/archive', [EngagementActivityController::class, 'archive']);
Route::patch('/giveback/activities/{id}/restore', [EngagementActivityController::class, 'restore']);

// Community Engagement Registrations + Payments
Route::get('/giveback/registrations', [EngagementRegistrationController::class, 'index']);
Route::post('/giveback/registrations', [EngagementRegistrationController::class, 'store']);
Route::patch('/giveback/registrations/{id}/payment-status', [EngagementRegistrationController::class, 'updatePaymentStatus']);
Route::get('/giveback/registrations/{id}/receipt', [EngagementRegistrationController::class, 'receipt']);

// GiveBack Posts API
Route::get('/giveback/posts', [GivebackPostController::class, 'index']);
Route::post('/giveback/posts', [GivebackPostController::class, 'store']);
Route::put('/giveback/posts/{id}', [GivebackPostController::class, 'update']);
Route::delete('/giveback/posts/{id}', [GivebackPostController::class, 'destroy']);
Route::patch('/giveback/posts/{id}/archive', [GivebackPostController::class, 'archive']);
Route::patch('/giveback/posts/{id}/restore', [GivebackPostController::class, 'restore']);

// GiveBack Analytics
Route::get('/giveback/analytics/overview', [GivebackAnalyticsController::class, 'overview']);
Route::get('/giveback/analytics/projects/{id}', [GivebackAnalyticsController::class, 'project']);
Route::get('/giveback/analytics/activities/{id}', [GivebackAnalyticsController::class, 'activity']);

// Registrations
Route::patch('/giveback/registrations/{id}/visibility', [EngagementRegistrationController::class, 'updateVisibility']);

// Donations
Route::patch('/donations/{id}/visibility', [DonationController::class, 'updateVisibility']);