<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use Illuminate\Http\Request;

class CommentaireController extends Controller
{
    /**
     * Afficher tous les commentaires
     */
    public function index()
    {
        $commentaires = Commentaire::with([
            'user:id,name,image',
            'publication:id_pub,titre_pub'
        ])
        ->orderBy('date_com', 'desc')
        ->get();

        return response()->json($commentaires);
    }

    /**
     * Ajouter un commentaire
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_pub' => 'required|exists:publications,id_pub',
            'contenu_com' => 'required|string',
        ]);

        $commentaire = Commentaire::create([
            'user_id' => $request->user()->id,
            'id_pub' => $validated['id_pub'],
            'contenu_com' => $validated['contenu_com'],
            'date_com' => now(),
        ]);

        return response()->json([
            'message' => 'Commentaire ajouté avec succès.',
            'commentaire' => $commentaire->load('user:id,name,image')
        ], 201);
    }

    /**
     * Afficher un commentaire
     */
    public function show($id)
    {
        $commentaire = Commentaire::with([
            'user:id,name,image',
            'publication:id_pub,titre_pub'
        ])->findOrFail($id);

        return response()->json($commentaire);
    }

    /**
     * Modifier un commentaire
     */
    public function update(Request $request, $id)
    {
        $commentaire = Commentaire::findOrFail($id);

        // Seul l'auteur peut modifier son commentaire
        if ($commentaire->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier ce commentaire.'
            ], 403);
        }

        $validated = $request->validate([
            'contenu_com' => 'required|string',
        ]);

        $commentaire->update($validated);

        return response()->json([
            'message' => 'Commentaire modifié avec succès.',
            'commentaire' => $commentaire
        ]);
    }

    /**
     * Supprimer un commentaire
     */
    public function destroy(Request $request, $id)
    {
        $commentaire = Commentaire::findOrFail($id);

        // Seul l'auteur peut supprimer son commentaire
        if ($commentaire->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer ce commentaire.'
            ], 403);
        }

        $commentaire->delete();

        return response()->json([
            'message' => 'Commentaire supprimé avec succès.'
        ]);
    }
}