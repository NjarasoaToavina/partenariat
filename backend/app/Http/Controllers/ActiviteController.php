<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;

class ActiviteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();
        if ($user->hasRole('responsable') || $user->hasRole('service')) {
            $activites = Activite::with('user')->get();

        }
        elseif ($user->hasRole('partenaire')) {
            $activites = $user->activites()
                ->with('user')
                ->get();
        } 
        else {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json($activites, 200);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Créer une activité
     */
    public function store(Request $request)
    {
        // créer une activité
        $user = $request->user();

        if (!$user->hasRole('responsable')) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }
        
        $validated = $request->validate([
            'sujet' => ['required', 'string', 'max:255'],
            'date_debut_activ' => ['required','date'],
            'date_fin_activ' => ['required','date'],
        ]);


        $activite = $user->activites()->create([
                ...$validated,
                'etat_activ' => 'planifie',
        ]);

        return response()->json([
            'message' => 'Activité créée avec succès',
            'activite' => $activite->load('user'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        // 
        $user = $request->user();

        $activite = Activite::with('user')
            ->findOrFail($id);


        if ( !$user->hasRole('responsable') && !($user->hasRole('service'))
        ) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }
        return response()->json($activite, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Activite $activite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $user = $request->user();
        $activite = Activite::findOrFail($id);

        if ( !$user->hasRole('responsable')) 
        {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier cette activité'
            ], 403);
        }

        $validated = $request->validate([
            'sujet' => ['required', 'string', 'max:255'],
            'date_debut_activ' => ['required','date'],
            'date_fin_activ' => ['required','date'],
        ]);

        $activite->update($validated);

        return response()->json([
            'message' => 'Activite mise à jour avec succès',
            'activite' => $activite->load('user'),    
        ], 200);
    }

    public function updateStatut(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user->hasRole('responsable')) {
            return response()->json([
                'message' => "Seul le Responsable peut changer le statut d' une activité"
            ], 403);
        }

        $activite = Activite::findOrFail($id);

        $validated = $request->validate([
            'etat_activ' => ['required', 'in:planifie,realise'],
            'commentaire' => ['nullable', 'string', 'max:255'],
        ]);

        $activite->update($validated);

        return response()->json([
            'message' => "Etat de l'activité mis à jour",
            'activite' => $activite->load('user'),
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $user = request()->user();
        $activite = Activite::findOrFail($id);

        if (
            !$user->hasRole('responsable')
        ) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer cette activité'
            ], 403);
        }

        $activite->delete();
        return response()->json([
            'message' => 'Activité supprimée avec succès',
        ], 200);
    }
}
