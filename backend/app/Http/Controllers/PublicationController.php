<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{
    /**
     * Ajouter une réaction à une publication
     */
    public function react($id)
    {
        $publication = Publication::findOrFail($id);

        // Incrémenter le nombre de réactions
        $publication->increment('reaction');

        return response()->json([
            'message' => 'Réaction ajoutée avec succès.',
            'reaction' => $publication->reaction
        ]);
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
       $publications = Publication::with([
        'user:id,name,image',
        'commentaires.user:id,name,image'
        ])
        ->orderBy('date_pub', 'desc')
        ->get();

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

        $publication = Publication::create([
            'user_id' => $request->user()->id,
            'titre_pub' => $validated['titre_pub'],
            'contenu_pub' => $validated['contenu_pub'],
            'photo_pub' => $photoPath,
            'reaction' => 0,
            'date_pub' => now(),
        ]);

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

        $validated = $request->validate([
            'titre_pub' => 'sometimes|required|string|max:255',
            'contenu_pub' => 'sometimes|required|string',
            'photo_pub' => 'sometimes|nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo_pub')) {

            $nouveauPath = $request->file('photo_pub')
                ->store('publications', 'public');

            if ($publication->photo_pub) {
                Storage::disk('public')->delete($publication->photo_pub);
            }

            $publication->photo_pub = $nouveauPath;
        }

        unset($validated['photo_pub']);

        $publication->fill($validated);
        $publication->save();

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

        if ($publication->photo_pub) {
            Storage::disk('public')->delete($publication->photo_pub);
        }

        $publication->delete();

        return response()->json([
            'message' => 'Publication supprimée avec succès.'
        ], 200);
    }
}
