<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\EbookController;
use App\Http\Controllers\Api\ReadingActivityController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\RewardController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

// Public Routes
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    // E-Books (Siswa: read, Admin: manage)
    Route::get('ebooks', [EbookController::class, 'index']);
    Route::get('ebooks/{id}', [EbookController::class, 'show']);
    Route::get('ebooks/{id}/pdf', [EbookController::class, 'getPDF']);
    Route::get('ebooks/{id}/progress', [EbookController::class, 'getUserProgress']);
    
    // Admin only routes
    Route::middleware('admin')->group(function () {
        Route::post('ebooks', [EbookController::class, 'store']);
        Route::put('ebooks/{id}', [EbookController::class, 'update']);
        Route::delete('ebooks/{id}', [EbookController::class, 'destroy']);
    });
    
    // Reading Activities (Siswa: track reading)
    Route::post('reading-activities/start', [ReadingActivityController::class, 'startReading']);
    Route::put('reading-activities/{id}/progress', [ReadingActivityController::class, 'updateProgress']);
    Route::put('reading-activities/{id}/complete', [ReadingActivityController::class, 'completeReading']);
    Route::get('reading-activities', [ReadingActivityController::class, 'getMyActivities']);
    Route::get('reading-activities/{id}', [ReadingActivityController::class, 'getActivity']);
    
    // Quizzes (Siswa: take, Guru: create)
    Route::get('ebooks/{id}/quiz', [QuizController::class, 'getQuizForBook']);
    Route::post('quiz/submit', [QuizController::class, 'submitQuiz']);
    Route::get('quiz/my-attempts', [QuizController::class, 'getMyAttempts']);
    
    Route::middleware('guru')->group(function () {
        Route::post('quiz/create', [QuizController::class, 'createQuiz']);
        Route::put('quiz/{id}', [QuizController::class, 'updateQuiz']);
        Route::delete('quiz/{id}', [QuizController::class, 'deleteQuiz']);
    });
    
    // Rewards (Siswa: view & redeem, Admin: manage)
    Route::get('rewards', [RewardController::class, 'index']);
    Route::get('rewards/{id}', [RewardController::class, 'show']);
    Route::post('rewards/{id}/redeem', [RewardController::class, 'redeem']);
    Route::get('my-redemptions', [RewardController::class, 'getMyRedemptions']);
    Route::get('user-points', [RewardController::class, 'getUserPoints']);
    
    Route::middleware('admin')->group(function () {
        Route::post('rewards', [RewardController::class, 'store']);
        Route::put('rewards/{id}', [RewardController::class, 'update']);
        Route::delete('rewards/{id}', [RewardController::class, 'destroy']);
        Route::post('rewards/verify-claim', [RewardController::class, 'verifyClaim']);
    });
    
    // Books (original)
    Route::apiResource('books', BookController::class);
    
    // Dashboard routes (role-based stats)
    Route::middleware('admin')->group(function () {
        Route::get('dashboard/admin/stats', [DashboardController::class, 'adminStats']);
        Route::get('dashboard/admin/top-students', [DashboardController::class, 'topStudents']);
        Route::get('dashboard/admin/books', [DashboardController::class, 'adminBooks']);
    });
    
    Route::middleware('guru')->group(function () {
        Route::get('dashboard/guru/stats', [DashboardController::class, 'guruStats']);
        Route::get('dashboard/guru/students', [DashboardController::class, 'guruStudents']);
    });
    
    Route::middleware('siswa')->group(function () {
        Route::get('dashboard/siswa/stats', [DashboardController::class, 'siswaStats']);
        Route::get('dashboard/siswa/books', [DashboardController::class, 'siswaBooks']);
        Route::get('dashboard/siswa/points-history', [DashboardController::class, 'siswaPointsHistory']);
    });
    
    // User management (Admin only)
    Route::middleware('admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword']);
        Route::get('dashboard/admin/users-stats', [UserController::class, 'getStatistics']);
    });
});


