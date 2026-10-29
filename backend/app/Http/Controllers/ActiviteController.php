<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Http\Request;
use App\Services\HistoriqueService;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Notifications\NouvelleActiviteProposeeNotification;
use Illuminate\Support\Facades\Notification;
use App\Notifications\DecisionActiviteNotification;

class ActiviteController extends Controller
{
   
    /**
     * Proposer une activité par un partenaire
     */
   /**
     * Proposer une activité par un partenaire
     */
    public function proposer(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('partenaire')) {
            return response()->json([
                'message' => 'Seul un partenaire peut proposer une activité'
            ], 403);
        }

        $validated = $request->validate([
            'sujet' => ['required', 'string', 'max:255'],
            'date_debut_activ' => ['required', 'date'],
            'date_fin_activ' => [
                'required',
                'date',
                'after_or_equal:date_debut_activ'
            ],
        ]);

        $activite = DB::transaction(function () use ($user, $validated) {

            $activite = $user->activites()->create([
                ...$validated,
                'etat_activ' => 'propose',
            ]);

            HistoriqueService::enregistrer(
                action: 'creation',
                module: 'activites',
                description: "A proposé l'activité {$activite->sujet}",
                elementId: $activite->getKey()
            );

            return $activite;
        });

        // Envoyer une notification aux responsables
        $responsables = User::role('responsable')->get();

        Notification::send(
            $responsables,
            new NouvelleActiviteProposeeNotification(
                $activite->load('user')
            )
        );

        return response()->json([
            'message' => 'Proposition d’activité envoyée avec succès',
            'activite' => $activite,
        ], 201);
    }


    /**
     * Accepter ou refuser une activité proposée par un partenaire
    */
    public function traiterProposition(Request $request, $id)
    {
        $user = $request->user();

        // Seul le responsable peut traiter une proposition
        if (!$user->hasRole('responsable')) {
            return response()->json([
                'message' => 'Seul le responsable peut traiter une proposition'
            ], 403);
        }

        $validated = $request->validate([
            'etat_activ' => ['required', 'in:planifie,refuse'],
        ]);

        $resultat = DB::transaction(function () use ($id, $validated) {

            $activite = Activite::with('user')
                ->lockForUpdate()
                ->findOrFail($id);

            // Vérifier que l'activité est encore proposée
            if ($activite->etat_activ !== 'propose') {
                return [
                    'erreur' => true,
                    'message' => 'Cette proposition a déjà été traitée'
                ];
            }

            // Vérifier que l'activité appartient à un partenaire
            if (!$activite->user || !$activite->user->hasRole('partenaire')) {
                return [
                    'erreur' => true,
                    'message' => 'Cette activité ne provient pas d’un partenaire'
                ];
            }

            // Mettre à jour le statut
            $activite->update([
                'etat_activ' => $validated['etat_activ'],
            ]);

            $acceptee = $validated['etat_activ'] === 'planifie';

            // Enregistrer dans l'historique
            HistoriqueService::enregistrer(
                action: $acceptee ? 'validation' : 'refus',
                module: 'activites',
                description: $acceptee
                    ? "A accepté la proposition d'activité {$activite->sujet}"
                    : "A refusé la proposition d'activité {$activite->sujet}",
                elementId: $activite->getKey()
            );

            return [
                'erreur' => false,
                'activite' => $activite
            ];
        });

        if ($resultat['erreur']) {
            return response()->json([
                'message' => $resultat['message']
            ], 422);
        }

        $activite = $resultat['activite'];

        // Notifier le partenaire après la transaction
        Notification::send(
            $activite->user,
            new DecisionActiviteNotification($activite)
        );

        return response()->json([
            'message' => $activite->etat_activ === 'planifie'
                ? 'Proposition acceptée avec succès'
                : 'Proposition refusée avec succès',

            'activite' => $activite->load('user'),
        ], 200);
    }
    

    /**
    * Display a listing of the resource.
    */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('responsable') || $user->hasRole('service')) {
            $activites = Activite::with('user.roles')->get();
        }
        elseif ($user->hasRole('partenaire')) {
            $activites = $user->activites()
                ->with('user.roles')
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


        $activite = DB::transaction(function () use ($user, $validated) {

            $activite = $user->activites()->create([
                ...$validated,
                'etat_activ' => 'planifie',
            ]);

            HistoriqueService::enregistrer(
                action: 'creation',
                module: 'activites',
                description: "A créé l'activité {$activite->sujet}",
                elementId: $activite->getKey()
            );

            return $activite;
        });

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

        DB::transaction(function () use ($activite, $validated) {

            $activite->update($validated);

            HistoriqueService::enregistrer(
                action: 'modification',
                module: 'activites',
                description: "A modifié l'activité {$activite->sujet}",
                elementId: $activite->getKey()
            );
        });

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

        DB::transaction(function () use ($activite, $validated) {

            $ancienStatut = $activite->etat_activ;
            $activite->update($validated);

            // Incrémenter si l'activité devient réalisée
            if ($ancienStatut !== 'realise' && $activite->etat_activ === 'realise') {

                $auteur = $activite->user;

                if ($auteur && $auteur->hasRole('partenaire')) {
                    $auteur->partenariat?->increment('nbr_intervention');
                }
            }
            

            $action = $activite->etat_activ === 'realise'
                ? 'realisation'
                : 'planification';

            $description = $activite->etat_activ === 'realise'
                ? "A marqué l'activité {$activite->sujet} comme réalisée"
                : "A marqué l'activité {$activite->sujet} comme planifiée";

            HistoriqueService::enregistrer(
                action: $action,
                module: 'activites',
                description: $description,
                elementId: $activite->getKey()
            );
        });

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

        DB::transaction(function () use ($activite) {

            $activite->delete();

            HistoriqueService::enregistrer(
                action: 'suppression',
                module: 'activites',
                description: "A supprimé l'activité {$activite->sujet}",
                elementId: $activite->getKey()
            );
        });
        
        return response()->json([
            'message' => 'Activité supprimée avec succès',
        ], 200);
    }
}
