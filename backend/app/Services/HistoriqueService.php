<?php

namespace App\Services;

use App\Models\Historique;
use Illuminate\Support\Facades\Auth;

class HistoriqueService
{
    /**
     * Enregistrer une action dans l'historique.
     */
    public static function enregistrer(
        string $action,
        string $module,
        string $description,
        ?int $elementId = null,
        ?int $userId = null
    ): Historique {
        return Historique::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'element_id' => $elementId,
        ]);
    }
}