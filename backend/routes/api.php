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
Route::post('/login', [UserController::class, 'login']); // Login/authenticate user

// User Management API
Route::get('/users', [UserController::class, 'index']); // Get all users
Route::post('/users', [UserController::class, 'store']); // Create new user
Route::get('/users/pending/list', [UserController::class, 'getPendingUsers']); // Get pending approval users (must be before wildcard route)
Route::get('/users/analytics/course-approvals', [UserController::class, 'getCourseAnalytics']); // Alumni analytics by course (must be before wildcard route)
Route::get('/users/{email}', [UserController::class, 'show']); // Get user by email
Route::put('/users/{email}', [UserController::class, 'update']); // Update user by email
Route::post('/users/{email}/profile-image', [UserController::class, 'uploadProfileImage']); // Upload profile image by email
Route::put('/users/id/{id}', [UserController::class, 'updateById']); // Update user by ID
Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete user by ID
Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']); // Block/Unblock user
Route::patch('/users/{id}/approve', [UserController::class, 'approveUser']); // Approve user
Route::patch('/users/{id}/disapprove', [UserController::class, 'disapproveUser']); // Disapprove user

// Donation Campaign API
Route::get('/campaigns', [DonationCampaignController::class, 'index']); // Get all campaigns
Route::get('/campaigns/{id}', [DonationCampaignController::class, 'show']); // Get single campaign
Route::post('/campaigns', [DonationCampaignController::class, 'store']); // Create campaign (admin)
Route::put('/campaigns/{id}', [DonationCampaignController::class, 'update']); // Update campaign (admin)
Route::delete('/campaigns/{id}', [DonationCampaignController::class, 'destroy']); // Delete campaign (admin)
Route::post('/campaigns/{id}/donate', [DonationCampaignController::class, 'addDonation']); // Add donation to campaign
Route::patch('/campaigns/{id}/toggle-active', [DonationCampaignController::class, 'toggleActive']); // Toggle campaign status (admin)
Route::get('/campaigns/{id}/donors', [DonationCampaignController::class, 'getDonors']); // Get donors for campaign (admin)

// Donation API
Route::post('/donations', [DonationController::class, 'store']); // Create general donation
Route::get('/donations', [DonationController::class, 'index']); // Get all donations (admin)
Route::get('/donations/email/{email}', [DonationController::class, 'getByEmail']); // Get donations by email
Route::get('/donations/statistics', [DonationController::class, 'getStatistics']); // Get donation statistics
Route::get('/donations/analytics', [DonationController::class, 'getAnalytics']); // Get detailed analytics (admin)

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
