<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\HistoriqueService;
use Illuminate\Support\Facades\DB;

class PublicationController extends Controller
{
    /**
     * Ajouter une réaction à une publication
     */
    public function react(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);
        $userId = $request->user()->id;

        // Vérifier si l'utilisateur a déjà réagi
        $reaction = $publication->reactions()
            ->where('user_id', $userId)
            ->first();

        if ($reaction) {
            // Retirer la réaction
            $reaction->delete();
            $hasReacted = false;
        } else {
            // Ajouter une réaction
            $publication->reactions()->create([
                'user_id' => $userId,
            ]);
            $hasReacted = true;
        }

        return response()->json([
            'message' => $hasReacted
                ? 'Réaction ajoutée avec succès.'
                : 'Réaction retirée avec succès.',
            'reaction' => $publication->reactions()->count(),
            'has_reacted' => $hasReacted,
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $publications = Publication::with([
            'user:id,name,image',
            'commentaires.user:id,name,image'
        ])
        ->withCount('reactions')
        ->withExists([
            'reactions as has_reacted' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        ])
        ->orderBy('date_pub', 'desc')
        ->get();

        // Utiliser le nombre réel de réactions
        $publications->each(function ($publication) {
            $publication->reaction = $publication->reactions_count;
        });

        return response()->json($publications);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre_pub' => 'required|string|max:255',
            'contenu_pub' => 'required|string',
            'photo_pub' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;

        if ($request->hasFile('photo_pub')) {
            $photoPath = $request->file('photo_pub')
                ->store('publications', 'public');
        }

        try {
            $publication = DB::transaction(function () use ($request, $validated, $photoPath) {

                $publication = Publication::create([
                    'user_id' => $request->user()->id,
                    'titre_pub' => $validated['titre_pub'],
                    'contenu_pub' => $validated['contenu_pub'],
                    'photo_pub' => $photoPath,
                    'reaction' => 0,
                    'date_pub' => now(),
                ]);

                HistoriqueService::enregistrer(
                    action: 'creation',
                    module: 'publications',
                    description: "A créé la publication {$publication->titre_pub}",
                    elementId: $publication->id_pub
                );

                return $publication;
            });

        } catch (\Throwable $e) {

            if ($photoPath) {
                Storage::disk('public')->delete($photoPath);
            }

            throw $e;
        }

        return response()->json($publication, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $publication = Publication::with([
        'user:id,name,image',
        'commentaires.user:id,name,image'
        ])->findOrFail($id);

        return response()->json($publication);
        }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $publication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);
        $anciennePhoto = $publication->photo_pub;
        $nouvellePhoto = null;

        $validated = $request->validate([
            'titre_pub' => 'sometimes|required|string|max:255',
            'contenu_pub' => 'sometimes|required|string',
            'photo_pub' => 'sometimes|nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo_pub')) {

            $nouvellePhoto = $request->file('photo_pub')
                ->store('publications', 'public');

            $publication->photo_pub = $nouvellePhoto;
        }

        unset($validated['photo_pub']);

        $publication->fill($validated);
        
        try {
            DB::transaction(function () use ($publication) {

                $publication->save();

                HistoriqueService::enregistrer(
                    action: 'modification',
                    module: 'publications',
                    description: "A modifié la publication {$publication->titre_pub}",
                    elementId: $publication->id_pub
                );
            });

        } catch (\Throwable $e) {

            if ($nouvellePhoto) {
                Storage::disk('public')->delete($nouvellePhoto);
            }

            throw $e;
        }

        if ($nouvellePhoto && $anciennePhoto) {
            Storage::disk('public')->delete($anciennePhoto);
        }

        return response()->json([
            'message' => 'Publication modifiée avec succès.',
            'publication' => $publication
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);

      $photoPath = $publication->photo_pub;

DB::transaction(function () use ($publication) {

    $publication->delete();

    HistoriqueService::enregistrer(
            action: 'suppression',
            module: 'publications',
            description: "A supprimé la publication {$publication->titre_pub}",
            elementId: $publication->id_pub
        );
    });

    // Supprimer la photo après la transaction
    if ($photoPath) {
        Storage::disk('public')->delete($photoPath);
    }

    return response()->json([
        'message' => 'Publication supprimée avec succès.'
    ], 200);
    }
}
