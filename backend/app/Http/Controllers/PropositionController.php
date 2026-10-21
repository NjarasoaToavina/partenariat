<?php

namespace App\Http\Controllers;

use App\Notifications\NouvellePropositionNotification;
use App\Models\Proposition;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Models\Partenariat;
use Illuminate\Support\Facades\DB;

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

        $responsables = User::role('responsable')->get();

        Notification::send(
            $responsables,
            new NouvellePropositionNotification($proposition)
        );

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


   // Mettre à jour le statut d'une proposition
    public function updateStatut(Request $request, $id)
    {
        $user = $request->user();

        // Seul le responsable peut valider ou refuser
        if (!$user->hasRole('responsable')) {
            return response()->json([
                'message' => 'Seul le Responsable peut valider ou refuser une proposition'
            ], 403);
        }

        $validated = $request->validate([
            'etat_propos' => ['required', 'in:valide,refuse'],
            'commentaire' => ['nullable', 'string', 'max:255'],
        ]);

        return DB::transaction(function () use ($id, $validated) {

            $proposition = Proposition::whereKey($id)
                ->lockForUpdate()
                ->firstOrFail();

            // Vérifier que la proposition n'a pas déjà été traitée
            if ($proposition->etat_propos !== 'attente') {
                return response()->json([
                    'message' => 'Cette proposition a déjà été traitée'
                ], 422);
            }

            // CAS 1 : Proposition validée
            if ($validated['etat_propos'] === 'valide') {

                // Créer automatiquement le partenaire
                $partenariat = Partenariat::create([
                    'nom_part' => $proposition->part_propos,
                    'campus_part' => $proposition->campus_propos,
                    'contact_part' => $proposition->contact_propos,
                    'statut_part' => 'prospecte',
                    'nbr_intervention' => 0
                ]);

                // Mettre à jour le statut de la proposition
                $proposition->update([
                    'etat_propos' => 'valide',
                ]);

                return response()->json([
                    'message' => 'Proposition validée et partenaire créé avec succès',
                    'proposition' => $proposition->load('user'),
                    'partenariat' => $partenariat,
                ], 200);
            }

            // CAS 2 : Proposition refusée
            $proposition->update([
                'etat_propos' => 'refuse',
                'commentaire' => $validated['commentaire'] ?? null,
            ]);

            return response()->json([
                'message' => 'Proposition refusée avec succès',
                'proposition' => $proposition->load('user'),
            ], 200);
        });
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
