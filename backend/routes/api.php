<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\ReadingProgressController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\RewardController;

// Public Routes
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    // Books
    Route::apiResource('books', BookController::class);
    
    // Reading Progress
    Route::apiResource('reading-progress', ReadingProgressController::class);
    Route::post('reading-progress/{id}/update-page', [ReadingProgressController::class, 'updatePage']);
    
    // Quizzes
    Route::get('quizzes', [QuizController::class, 'index']);
    Route::post('quiz-attempts', [QuizController::class, 'submitAttempt']);
    Route::get('quiz-attempts/{id}', [QuizController::class, 'showAttempt']);
        
        // Rewards
        Route::get('rewards', [RewardController::class, 'index']);
        Route::post('rewards/{id}/redeem', [RewardController::class, 'redeem']);
    });

