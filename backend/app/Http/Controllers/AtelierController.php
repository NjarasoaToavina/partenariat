<?php

namespace App\Http\Controllers;

use App\Models\Atelier;
use Illuminate\Http\Request;

class AtelierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $ateliers = Atelier::all();
        return response()->json($ateliers);
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
        //
        $validated = $request->validate([
            'date_debut_atel' => 'required|date',
            'date_fin_atel' => 'required|date',
            'campus_atel' => 'required|string|max:255',
            'groupe' => 'required|string|max:255',
            'contenu_atel' => 'required|string',
            'intervenant' => 'required|string|max:255',
            'statut_atel' => 'required|string|max:255',
        ]);

        $atelier = Atelier::create($validated);
        return response()->json($atelier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Atelier $atelier)
    {
        //
        return response()->json($atelier);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Atelier $atelier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Atelier $atelier)
    {
        //
        $validated = $request->validate([
            'date_debut_atel' => 'required|date',
            'date_fin_atel' => 'required|date',
            'campus_atel' => 'required|string|max:255',
            'groupe' => 'required|string|max:255',
            'contenu_atel' => 'required|string',
            'intervenant' => 'required|string|max:255',
            'statut_atel' => 'required|string|max:255',
        ]);

        $atelier->update($validated);
        return response()->json($atelier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Atelier $atelier)
    {
        //
        $atelier->delete();
        return response()->json(null, 204);
    }
}
