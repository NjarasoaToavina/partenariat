<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PartenariatController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    // ->load('roles') force Laravel à inclut le tableau des rôles Spatie dans le JSON
    return $request->user()->load('roles');
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::apiResource('partenariats', PartenariatController::class);

Route::get('/partenariats', [PartenariatController::class, 'index']);
