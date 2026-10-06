<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PartenariatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AtelierController;
use App\Http\Controllers\ConventionController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('ateliers', AtelierController::class);
    Route::apiResource('partenariats', PartenariatController::class);

  
    Route::get('/conventions/{id}', [ConventionController::class, 'show']);
    Route::put('/conventions/{id}', [ConventionController::class, 'update']);
    Route::delete('/conventions/{id}', [ConventionController::class, 'destroy']);
    });
    Route::post('/partenariats/{id_part}/conventions', [ConventionController::class, 'store']);
    Route::get('/partenariats/{id_part}/conventions', [ConventionController::class, 'index']);
    
