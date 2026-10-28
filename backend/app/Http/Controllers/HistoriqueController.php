<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    public function index(Request $request)
    {
        // Seul le responsable peut consulter l'historique
        abort_unless($request->user()->hasRole('responsable'), 403);

        $historiques = Historique::with('user:id,name,image')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($historiques, 200);
    }
}