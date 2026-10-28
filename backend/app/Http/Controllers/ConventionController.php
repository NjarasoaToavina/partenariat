<?php

namespace App\Http\Controllers;

use App\Models\Convention;
use App\Models\Partenariat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\HistoriqueService;
use Illuminate\Support\Facades\DB;

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

    public function getByPartenariat($id_part)
    {
        $conventions = Convention::with('partenariat')
            ->where('id_part', $id_part)
            ->get();

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

        try {
            $convention = DB::transaction(function () use (
                $partenariat,
                $validated,
                $photoPath,
                $scanPath
            ) {

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

            HistoriqueService::enregistrer(
                action: 'creation',
                module: 'conventions',
                description: "A créé la convention n°{$convention->num_conv} du partenariat {$partenariat->nom_part}",
                elementId: $convention->getKey()
            );
            return $convention;
        });

        } catch (\Throwable $e) {

            // Supprimer les fichiers créés si la transaction échoue
            if ($photoPath) {
                Storage::disk('public')->delete($photoPath);
            }

            if ($scanPath) {
                Storage::disk('public')->delete($scanPath);
            }

            throw $e;
        }

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
        $anciennePhoto = $convention->photo_conv;
        $ancienScan = $convention->scan;

        $nouvellePhoto = null;
        $nouveauScan = null;

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

            $nouvellePhoto = $request
                ->file('photo_conv')
                ->store('conventions/photos', 'public');

            $convention->photo_conv = $nouvellePhoto;
        }

        /*
        |--------------------------------------------------------------------------
        | Mise à jour du scan
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('scan')) {

            $nouveauScan = $request
                ->file('scan')
                ->store('conventions/scans', 'public');

            $convention->scan = $nouveauScan;
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

        try {
            DB::transaction(function () use ($convention) {

                $convention->save();

                HistoriqueService::enregistrer(
                    action: 'modification',
                    module: 'conventions',
                    description: "A modifié la convention n°{$convention->num_conv}",
                    elementId: $convention->getKey()
                );
            });

        } catch (\Throwable $e) {

            // Supprimer les nouveaux fichiers si la transaction échoue
            if ($nouvellePhoto) {
                Storage::disk('public')->delete($nouvellePhoto);
            }

            if ($nouveauScan) {
                Storage::disk('public')->delete($nouveauScan);
            }

            throw $e;
        }

        // Supprimer les anciens fichiers après sauvegarde réussie
        if ($nouvellePhoto && $anciennePhoto) {
            Storage::disk('public')->delete($anciennePhoto);
        }

        if ($nouveauScan && $ancienScan) {
            Storage::disk('public')->delete($ancienScan);
        }

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
        // Conserver les chemins des fichiers
        $photoPath = $convention->photo_conv;
        $scanPath = $convention->scan;

        DB::transaction(function () use ($convention) {

            $convention->delete();

            HistoriqueService::enregistrer(
                action: 'suppression',
                module: 'conventions',
                description: "A supprimé la convention n°{$convention->num_conv}",
                elementId: $convention->getKey()
            );
        });

        // Supprimer les fichiers après la réussite de la transaction
        if ($photoPath) {
            Storage::disk('public')->delete($photoPath);
        }

        if ($scanPath) {
            Storage::disk('public')->delete($scanPath);
        }

        return response()->json([
            'message' => 'Convention supprimée avec succès.'
        ], 200);
    }
}