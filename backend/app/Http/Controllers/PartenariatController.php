<?php

namespace App\Http\Controllers;

use App\Models\Partenariat;
use Illuminate\Http\Request;

class PartenariatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $partenariats = Partenariat::all();

        return response()->json($partenariats);
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
            'nom_part' => 'required|string|max:255',
            'campus_part' => 'required|string|max:255',
            'statut_part' => 'required|string|max:255',
            'type_part' => 'required|string|max:255',
            'nbr_intervenant' => 'required|integer|min:0',
            'prochaine_action' => 'required|string|max:255',
            'contact_part' => 'required|string|max:255',
            'observation' => 'required|string',
        ]);

        $partenariat = Partenariat::create($validated);

        return response()->json($partenariat, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Partenariat $partenariat)
    {
        //
        return response()->json($partenariat);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Partenariat $partenariat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Partenariat $partenariat)
    {
        //
        $validated = $request->validate([
            'nom_part' => 'sometimes|required|string|max:255',
            'campus_part' => 'sometimes|required|string|max:255',
            'statut_part' => 'sometimes|required|string|max:255',
            'type_part' => 'sometimes|required|string|max:255',
            'nbr_intervenant' => 'sometimes|required|integer|min:0',
            'prochaine_action' => 'sometimes|required|string|max:255',
            'contact_part' => 'sometimes|required|string|max:255',
            'observation' => 'sometimes|required|string',
        ]);

        $partenariat->update($validated);

        return response()->json($partenariat);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partenariat $partenariat)
    {
        //
        $partenariat->delete();

        return response()->json([
            'message' => 'Partenariat supprimé avec succès.'
        ]);
    }
}
