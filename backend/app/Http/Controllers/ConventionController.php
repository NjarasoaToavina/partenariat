<?php

namespace App\Http\Controllers;

use App\Models\Convention;
use App\Models\Partenariat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConventionController extends Controller
{
    /**
     * Afficher toutes les conventions
     */
    public function index()
    {
        $conventions = Convention::with('partenariat')->get();

        return response()->json($conventions, 200);
    }

    /**
     * Afficher une convention
     */
    public function show($id)
    {
        $convention = Convention::with('partenariat')
            ->findOrFail($id);

        return response()->json($convention, 200);
    }

    /**
     * Créer une convention pour un partenariat
     */
    public function store(Request $request, $id_part)
    {
        $partenariat = Partenariat::findOrFail($id_part);

        $validated = $request->validate([
            'num_conv' => ['required', 'string', 'max:255'],
            'preambule' => ['nullable', 'string'],

            'repres_int' => ['required', 'string', 'max:255'],
            'repres_ext' => ['required', 'string', 'max:255'],

            'fct_int' => ['required', 'string', 'max:255'],
            'fct_ext' => ['required', 'string', 'max:255'],

            'objet_part' => ['required', 'string'],
            'axe_collab' => ['nullable', 'string'],
            'cond_part' => ['nullable', 'string'],
            'cond_finan' => ['nullable', 'string'],

            'date_debut_conv' => ['required', 'date'],
            'date_fin_conv' => [
                'nullable',
                'date',
                'after_or_equal:date_debut_conv'
            ],

            'resiliation' => ['nullable', 'string'],
            'confidentialite' => ['nullable', 'string'],
            'regle_diff' => ['nullable', 'string'],
            'droit_appli' => ['nullable', 'string'],

            // Fichiers
            'photo_conv' => ['nullable', 'image', 'max:2048'],
            'scan' => ['nullable', 'image', 'max:2048'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Gestion de la photo de signature
        |--------------------------------------------------------------------------
        */

        $photoPath = null;

        if ($request->hasFile('photo_conv')) {
            $photoPath = $request
                ->file('photo_conv')
                ->store('conventions/photos', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Gestion du scan de la convention
        |--------------------------------------------------------------------------
        */

        $scanPath = null;

        if ($request->hasFile('scan')) {
            $scanPath = $request
                ->file('scan')
                ->store('conventions/scans', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Création de la convention
        |--------------------------------------------------------------------------
        */

        $convention = $partenariat->conventions()->create([
            'num_conv' => $validated['num_conv'],
            'preambule' => $validated['preambule'] ?? null,

            'repres_int' => $validated['repres_int'],
            'repres_ext' => $validated['repres_ext'],

            'fct_int' => $validated['fct_int'],
            'fct_ext' => $validated['fct_ext'],

            'objet_part' => $validated['objet_part'],
            'axe_collab' => $validated['axe_collab'] ?? null,
            'cond_part' => $validated['cond_part'] ?? null,
            'cond_finan' => $validated['cond_finan'] ?? null,

            'date_debut_conv' => $validated['date_debut_conv'],
            'date_fin_conv' => $validated['date_fin_conv'] ?? null,

            'resiliation' => $validated['resiliation'] ?? null,
            'confidentialite' => $validated['confidentialite'] ?? null,
            'regle_diff' => $validated['regle_diff'] ?? null,
            'droit_appli' => $validated['droit_appli'] ?? null,

            'photo_conv' => $photoPath,
            'scan' => $scanPath,
        ]);

        return response()->json([
            'message' => 'Convention créée avec succès.',
            'convention' => $convention->load('partenariat'),
        ], 201);
    }

    /**
     * Modifier une convention
     */
    public function update(Request $request, $id)
    {
        $convention = Convention::findOrFail($id);

        $validated = $request->validate([
            'num_conv' => ['required', 'string', 'max:255'],
            'preambule' => ['nullable', 'string'],

            'repres_int' => ['required', 'string', 'max:255'],
            'repres_ext' => ['required', 'string', 'max:255'],

            'fct_int' => ['required', 'string', 'max:255'],
            'fct_ext' => ['required', 'string', 'max:255'],

            'objet_part' => ['required', 'string'],
            'axe_collab' => ['nullable', 'string'],
            'cond_part' => ['nullable', 'string'],
            'cond_finan' => ['nullable', 'string'],

            'date_debut_conv' => ['required', 'date'],
            'date_fin_conv' => [
                'nullable',
                'date',
                'after_or_equal:date_debut_conv'
            ],

            'resiliation' => ['nullable', 'string'],
            'confidentialite' => ['nullable', 'string'],
            'regle_diff' => ['nullable', 'string'],
            'droit_appli' => ['nullable', 'string'],

            'photo_conv' => ['nullable', 'image', 'max:2048'],
            'scan' => ['nullable', 'image', 'max:2048'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Mise à jour de la photo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('photo_conv')) {

            if ($convention->photo_conv) {
                Storage::disk('public')->delete($convention->photo_conv);
            }

            $convention->photo_conv = $request
                ->file('photo_conv')
                ->store('conventions/photos', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Mise à jour du scan
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('scan')) {

            if ($convention->scan) {
                Storage::disk('public')->delete($convention->scan);
            }

            $convention->scan = $request
                ->file('scan')
                ->store('conventions/scans', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | Mise à jour des informations
        |--------------------------------------------------------------------------
        */

        $convention->num_conv = $validated['num_conv'];
        $convention->preambule = $validated['preambule'] ?? null;

        $convention->repres_int = $validated['repres_int'];
        $convention->repres_ext = $validated['repres_ext'];

        $convention->fct_int = $validated['fct_int'];
        $convention->fct_ext = $validated['fct_ext'];

        $convention->objet_part = $validated['objet_part'];
        $convention->axe_collab = $validated['axe_collab'] ?? null;
        $convention->cond_part = $validated['cond_part'] ?? null;
        $convention->cond_finan = $validated['cond_finan'] ?? null;

        $convention->date_debut_conv = $validated['date_debut_conv'];
        $convention->date_fin_conv = $validated['date_fin_conv'] ?? null;

        $convention->resiliation = $validated['resiliation'] ?? null;
        $convention->confidentialite = $validated['confidentialite'] ?? null;
        $convention->regle_diff = $validated['regle_diff'] ?? null;
        $convention->droit_appli = $validated['droit_appli'] ?? null;

        $convention->save();

        return response()->json([
            'message' => 'Convention modifiée avec succès.',
            'convention' => $convention->load('partenariat'),
        ], 200);
    }

    /**
     * Supprimer une convention
     */
    public function destroy($id)
    {
        $convention = Convention::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Supprimer les fichiers associés
        |--------------------------------------------------------------------------
        */

        if ($convention->photo_conv) {
            Storage::disk('public')->delete($convention->photo_conv);
        }

        if ($convention->scan) {
            Storage::disk('public')->delete($convention->scan);
        }

        $convention->delete();

        return response()->json([
            'message' => 'Convention supprimée avec succès.'
        ], 200);
    }
}