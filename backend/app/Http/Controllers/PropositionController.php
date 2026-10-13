<?php

namespace App\Http\Controllers;

use App\Models\Proposition;
use App\Models\User;
use Illuminate\Http\Request;

class PropositionController extends Controller
{
    /**
     * Pour afficher la liste des propositions
     */
    public function index(Request $request)
    {
        //
        $user = $request->user();

        if ($user->hasRole('responsable')) {
            $propositions = Proposition::with('user')->get();
        }

        elseif ($user->hasRole('service')) {
            $propositions = $user->propositions()
                ->with('user')
                ->get();
        } 
        else {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json($propositions, 200);
    }

        /**
     * Ajouter une nouvelle proposition
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('service')) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }
        
        $validated = $request->validate([
            'part_propos' => ['required', 'string', 'max:255'],
            'campus_propos' => ['required', 'string', 'max:255'],
            'contact_propos' => ['required', 'string', 'max:255'],
        ]);


        $proposition = $user->propositions()->create([
                ...$validated,
                'date_propos' => now(),
                'etat_propos' => 'attente',
        ]);


        return response()->json([
            'message' => 'Proposition créée avec succès',
            'proposition' => $proposition->load('user'),
        ], 201);
    }

    public function getByUser($id)
    {
        $propositions = Proposition::with('user')
            ->where('id', $id)
            ->get();

        return response()->json($propositions, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $proposition = Proposition::with('user')
            ->findOrFail($id);

        // $proposition->id récupère l'identifiant de l'utilisateur qui a créé la proposition
        if (
            !$user->hasRole('responsable') &&
            !($user->hasRole('service') && $proposition->user_id == $user->id)
        ) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }
        return response()->json($proposition, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $user = $request->user();
        $proposition = Proposition::findOrFail($id);

        if (
            !$user->hasRole('service') ||
            $proposition->user_id != $user->id
        ) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier cette proposition'
            ], 403);
        }

        $validated = $request->validate([
            'part_propos' => ['required', 'string', 'max:255'],            
            'campus_propos' => ['required', 'string', 'max:255'],            
            'contact_propos' => ['required', 'string', 'max:255'],            
        ]);

        $proposition->update($validated);

        return response()->json([
            'message' => 'Proposition mise à jour avec succès',
            'proposition' => $proposition->load('user'),    
        ], 200);
    }       


    //Pour mettre à ajour les états
    public function updateStatut(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user->hasRole('responsable')) {
            return response()->json([
                'message' => 'Seul le Responsable peut valider ou refuser une proposition'
            ], 403);
        }

        $proposition = Proposition::findOrFail($id);

        $validated = $request->validate([
            'etat_propos' => ['required', 'in:validee,refusee'],
            'commentaire' => ['nullable', 'string', 'max:255'],
        ]);

        $proposition->update($validated);

        return response()->json([
            'message' => 'Etat de la proposition mis à jour',
            'proposition' => $proposition->load('user'),
        ], 200);
    }

    /**
     * Supprimer une proposition
     */
    public function destroy($id)
    {
        $user = request()->user();
        $proposition = Proposition::findOrFail($id);

        if (
            !$user->hasRole('service') ||
            $proposition->user_id != $user->id
        ) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer cette proposition'
            ], 403);
        }

        $proposition->delete();

        return response()->json([
            'message' => 'Proposition supprimée avec succès',
        ], 200);
    }
}
