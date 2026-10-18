<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            $document = $user->documents()->create([
                'type_doc' => $validated['type_doc'],
                'fichier_doc' => $fichierPath,
                'statut_doc' => 'collecte',
                'date_envoi' => now(),
            ]);
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
            $document->save();
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

        $document->update($validated);

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
        $document->delete();

        // Supprimer le fichier associé
        if ($fichierPath) {
            Storage::disk('public')->delete($fichierPath);
        }

        return response()->json([
            'message' => 'Document supprimé avec succès'
        ], 200);
    }
}