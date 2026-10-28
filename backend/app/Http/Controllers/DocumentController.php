<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\HistoriqueService;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
    /**
     * Afficher les documents
     * Responsable : tous les documents
     * Étudiant : uniquement ses documents
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('responsable')) {
            $documents = Document::with('user')->get();
        }
        elseif ($user->hasRole('etudiant')) {
            $documents = $user->documents()
                ->with('user')
                ->get();
        }
        else {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json($documents, 200);
    }

    /**
     * Afficher un document
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $document = Document::with('user')->findOrFail($id);

        if (
            !$user->hasRole('responsable') &&
            !(
                $user->hasRole('etudiant') &&
                $document->user_id == $user->id
            )
        ) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json($document, 200);
    }

    /**
     * Envoyer un document
     * Étudiant uniquement
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('etudiant')) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validated = $request->validate([
         'type_doc' => [
                'required',
                'string',     // 👈 Permet d'accepter n'importe quel texte / caractère
                'max:255'     // Sécurité pour éviter les textes trop longs en base de données
         ],
            'fichier_doc' => [
                'required',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
                'max:5120'
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Stockage du fichier
        |--------------------------------------------------------------------------
        */

        $fichierPath = $request
            ->file('fichier_doc')
            ->store('documents', 'public');

        /*
        |--------------------------------------------------------------------------
        | Création du document
        |--------------------------------------------------------------------------
        */

        try {
           $document = DB::transaction(function () use ($user, $validated, $fichierPath) {

                $document = $user->documents()->create([
                    'type_doc' => $validated['type_doc'],
                    'fichier_doc' => $fichierPath,
                    'statut_doc' => 'collecte',
                    'date_envoi' => now(),
                ]);

                HistoriqueService::enregistrer(
                    action: 'creation',
                    module: 'documents',
                    description: "A envoyé un document de type {$document->type_doc}",
                    elementId: $document->id_doc
                );

                return $document;
            });
        } catch (\Throwable $e) {
            Storage::disk('public')->delete($fichierPath);
            throw $e;
        }

        return response()->json([
            'message' => 'Document envoyé avec succès',
            'document' => $document->load('user'),
        ], 201);
    }

    /**
     * Modifier un document
     * Étudiant propriétaire uniquement
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $document = Document::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Vérification du propriétaire
        |--------------------------------------------------------------------------
        */

        if (
            !$user->hasRole('etudiant') ||
            $document->user_id != $user->id
        ) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier ce document'
            ], 403);
        }

        $validated = $request->validate([
            'type_doc' => [
            'required',
            'string',     // 👈 Permet d'accepter n'importe quel texte / caractère
            'max:255'     // Sécurité pour éviter les textes trop longs en base de données
            ],
            'fichier_doc' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
                'max:5120'
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Mise à jour du fichier
        |--------------------------------------------------------------------------
        */

        $ancienPath = $document->fichier_doc;
        $nouveauPath = null;
        $estCorrection = $document->statut_doc === 'correction'
        && $request->hasFile('fichier_doc');

        if ($request->hasFile('fichier_doc')) {
            $nouveauPath = $request
                ->file('fichier_doc')
                ->store('documents', 'public');

            $document->fichier_doc = $nouveauPath;

            // Actualiser la date de modification
            $document->date_envoi = now();
            // Si une correction était demandée
            if ($document->statut_doc === 'correction') {
                $document->statut_doc = 'validation';
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Mise à jour des informations
        |--------------------------------------------------------------------------
        */

        $document->type_doc = $validated['type_doc'];

        try {
            DB::transaction(function () use ($document, $estCorrection) {

                // Enregistrer les modifications du document
                $document->save();

                // Enregistrer l'historique
                HistoriqueService::enregistrer(
                    action: $estCorrection ? 'correction' : 'modification',
                    module: 'documents',
                    description: $estCorrection
                        ? "A envoyé une correction du document {$document->type_doc}"
                        : "A modifié le document de type {$document->type_doc}",
                    elementId: $document->id_doc
                );
            });
        } catch (\Throwable $e) {
            if ($nouveauPath) {
                Storage::disk('public')->delete($nouveauPath);
            }

            throw $e;
        }

        // Supprimer l'ancien fichier après sauvegarde
        if ($nouveauPath && $ancienPath) {
            Storage::disk('public')->delete($ancienPath);
        }

        return response()->json([
            'message' => 'Document modifié avec succès',
            'document' => $document->load('user'),
        ], 200);
    }

    /**
     * Modifier le statut et la remarque
     * Responsable uniquement
     */
    public function updateStatut(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasRole('responsable')) {
            return response()->json([
                'message' => 'Seul le Responsable peut modifier le statut'
            ], 403);
        }

        $document = Document::findOrFail($id);

        $validated = $request->validate([
            'statut_doc' => [
                'required',
                'in:collecte,correction,vivier,validation'
            ],
            'remarque' => [
                'nullable',
                'string'
            ],
        ]);

        DB::transaction(function () use ($document, $validated) {

            $document->update($validated);

            $actions = [
                'collecte' => 'collecte',
                'correction' => 'demande_correction',
                'validation' => 'attente_validation',
                'vivier' => 'validation',
            ];

            $descriptions = [
                'collecte' => 'A remis le document en collecte',
                'correction' => 'A demandé une correction du document',
                'validation' => 'A placé le document en attente de validation',
                'vivier' => 'A validé le document',
            ];

            $statut = $document->statut_doc;

            HistoriqueService::enregistrer(
                action: $actions[$statut],
                module: 'documents',
                description: "{$descriptions[$statut]} de type {$document->type_doc}",
                elementId: $document->id_doc
            );
        });

        return response()->json([
            'message' => 'Statut du document mis à jour',
            'document' => $document->load('user'),
        ], 200);
    }

    /**
     * Télécharger un document
     * Responsable ou étudiant propriétaire
     */
    public function download(Request $request, $id)
    {
        $user = $request->user();

        $document = Document::findOrFail($id);

        if (
            !$user->hasRole('responsable') &&
            !(
                $user->hasRole('etudiant') &&
                $document->user_id == $user->id
            )
        ) {
            return response()->json([
                'message' => 'Accès non autorisé'
            ], 403);
        }

        if (
            !$document->fichier_doc ||
            !Storage::disk('public')->exists($document->fichier_doc)
        ) {
            return response()->json([
                'message' => 'Fichier introuvable'
            ], 404);
        }

        return Storage::disk('public')->download(
            $document->fichier_doc
        );
    }

    /**
     * Supprimer un document
     * Étudiant propriétaire uniquement
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $document = Document::findOrFail($id);

        if (
            !$user->hasRole('etudiant') ||
            $document->user_id != $user->id
        ) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer ce document'
            ], 403);
        }

        $fichierPath = $document->fichier_doc;

        // Supprimer l'enregistrement
        DB::transaction(function () use ($document) {

            $document->delete();

            HistoriqueService::enregistrer(
                action: 'suppression',
                module: 'documents',
                description: "A supprimé le document de type {$document->type_doc}",
                elementId: $document->id_doc
            );
        });

        // Supprimer le fichier associé
        if ($fichierPath) {
            Storage::disk('public')->delete($fichierPath);
        }

        return response()->json([
            'message' => 'Document supprimé avec succès'
        ], 200);
    }
}