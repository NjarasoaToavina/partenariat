<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PartenariatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AtelierController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    });
    Route::apiResource('ateliers', AtelierController::class);
    
    Route::apiResource('partenariats', PartenariatController::class);
