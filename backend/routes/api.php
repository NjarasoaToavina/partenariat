<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PartenariatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AtelierController;
use App\Http\Controllers\ConventionController;
use App\Http\Controllers\PropositionController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ActiviteController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name')->values(),
        ]);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('ateliers', AtelierController::class);
    Route::apiResource('partenariats', PartenariatController::class);

    //route convention
    Route::get('/conventions/{id}', [ConventionController::class, 'show']);
    Route::put('/conventions/{id}', [ConventionController::class, 'update']);
    Route::delete('/conventions/{id}', [ConventionController::class, 'destroy']);
    Route::get('/conventions', [ConventionController::class, 'index']);
    Route::post('/partenariats/{id_part}/conventions', [ConventionController::class, 'store']);
    Route::get('/partenariats/{id_part}/conventions', [ConventionController::class, 'getByPartenariat']);
    
    //route proposition
    Route::apiResource('propositions', PropositionController::class);
    Route::get(
        '/users/{id}/propositions',
        [PropositionController::class, 'getByUser']
    );

    Route::patch(
        '/propositions/{id}/statut',
        [PropositionController::class, 'updateStatut']
    );

    //route activite
    Route::apiResource('activites', ActiviteController::class);
    Route::patch(
        '/activites/{id}/statut',
        [ActiviteController::class, 'updateStatut']
    );

    //route document
    Route::patch(
        '/documents/{id}/statut',
        [DocumentController::class, 'updateStatut']
    );

    Route::get(
        '/documents/{id}/download',
        [DocumentController::class, 'download']
    );

    Route::apiResource('documents', DocumentController::class);

});
