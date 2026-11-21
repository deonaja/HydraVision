<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',          [AuthController::class, 'logout']);
        Route::get('/me',               [AuthController::class, 'me']);
        Route::put('/profile',          [AuthController::class, 'updateProfile']);
    });

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password',  [AuthController::class, 'resetPassword']);
});

// Recommendations
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/recommendations', [RecommendationController::class, 'index']);

    Route::middleware('admin')->group(function () {
        Route::post('/recommendations',       [RecommendationController::class, 'store']);
        Route::put('/recommendations/{id}',   [RecommendationController::class, 'update']);
        Route::delete('/recommendations/{id}',[RecommendationController::class, 'destroy']);
    });
});

// History
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/history',       [HistoryController::class, 'index']);
    Route::post('/history',      [HistoryController::class, 'store']);
    Route::get('/history/{id}',  [HistoryController::class, 'show']);
    Route::delete('/history/{id}', [HistoryController::class, 'destroy']);
});

// Admin
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users',                       [AdminController::class, 'users']);
    Route::put('/users/{id}/status',           [AdminController::class, 'updateUserStatus']);
    Route::delete('/users/{id}',               [AdminController::class, 'deleteUser']);
    Route::get('/dashboard',                   [AdminController::class, 'dashboard']);
});
