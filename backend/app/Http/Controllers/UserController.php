<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Services\HistoriqueService;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // Vérifier que l'utilisateur est responsable
    private function authorizeResponsable(Request $request)
    {
        abort_unless($request->user()->hasRole('responsable'), 403);
    }

    // Liste des utilisateurs
    public function index(Request $request)
    {
        $this->authorizeResponsable($request);

        $users = User::with('roles')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    // Détails d'un utilisateur
    public function show(Request $request, $id)
    {
        $this->authorizeResponsable($request);

        return response()->json(
            User::with('roles')->findOrFail($id)
        );
    }

    // Ajouter un utilisateur
    public function store(Request $request)
    {
        $this->authorizeResponsable($request);

        $validated = $request->validate([
            'userType' => [
                'required',
                Rule::in(['responsable', 'service', 'partenaire', 'etudiant']),
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            'image' => ['nullable', 'image', 'max:2048'],
            'fonction' => ['nullable', 'string', 'max:255'],
            'nom_service' => ['nullable', 'string', 'max:255'],
            'nie' => ['nullable', 'string', 'max:255', 'unique:users,nie'],
            'filiere' => ['nullable', 'string', 'max:255'],
            'niveau' => ['nullable', 'string', 'max:255'],
        ]);

        $role = $validated['userType'];

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('profiles', 'public')
            : null;

        try {
            $user = DB::transaction(function () use ($validated, $imagePath, $role) {

                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'image' => $imagePath,

                    'fonction' => $role === 'partenaire'
                        ? ($validated['fonction'] ?? null) : null,

                    'nom_service' => $role === 'service'
                        ? ($validated['nom_service'] ?? null) : null,

                    'nie' => $role === 'etudiant'
                        ? ($validated['nie'] ?? null) : null,

                    'filiere' => $role === 'etudiant'
                        ? ($validated['filiere'] ?? null) : null,

                    'niveau' => $role === 'etudiant'
                        ? ($validated['niveau'] ?? null) : null,
                ]);

                $user->assignRole($role);

                HistoriqueService::enregistrer(
                    action: 'creation',
                    module: 'utilisateurs',
                    description: "A créé le compte utilisateur {$user->name}",
                    elementId: $user->id
                );

                return $user;
            });

        } catch (\Throwable $e) {

            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $e;
        }

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user->load('roles'),
        ], 201);
    }

    // Modifier un utilisateur
    public function update(Request $request, $id)
    {
        $this->authorizeResponsable($request);

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'password' => ['nullable', 'confirmed', 'min:8'],
            'image' => ['nullable', 'image', 'max:2048'],

            'fonction' => ['nullable', 'string', 'max:255'],
            'nom_service' => ['nullable', 'string', 'max:255'],

            'nie' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('users', 'nie')->ignore($user->id),
            ],

            'filiere' => ['nullable', 'string', 'max:255'],
            'niveau' => ['nullable', 'string', 'max:255'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        if ($user->hasRole('partenaire')) {
            $user->fonction = $validated['fonction'] ?? null;
        }

        if ($user->hasRole('service')) {
            $user->nom_service = $validated['nom_service'] ?? null;
        }

        if ($user->hasRole('etudiant')) {
            $user->nie = $validated['nie'] ?? null;
            $user->filiere = $validated['filiere'] ?? null;
            $user->niveau = $validated['niveau'] ?? null;
        }

        $oldImage = null;
        $newImage = null;

        if ($request->hasFile('image')) {
            $oldImage = $user->image;
            $newImage = $request->file('image')
                ->store('profiles', 'public');

            $user->image = $newImage;
        }

        try {
            DB::transaction(function () use ($user) {

                $user->save();

                HistoriqueService::enregistrer(
                    action: 'modification',
                    module: 'utilisateurs',
                    description: "A modifié le compte utilisateur {$user->name}",
                    elementId: $user->id
                );
            });

        } catch (\Throwable $e) {

            if ($newImage) {
                Storage::disk('public')->delete($newImage);
            }

            throw $e;
        }

        if ($oldImage && $oldImage !== $newImage) {
            Storage::disk('public')->delete($oldImage);
        }

        return response()->json([
            'message' => 'Utilisateur modifié avec succès.',
            'user' => $user->load('roles'),
        ]);
    }

    // Supprimer un utilisateur
    public function destroy(Request $request, $id)
    {
        $this->authorizeResponsable($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 403);
        }

        $image = $user->image;

        DB::transaction(function () use ($user) {

            $user->delete();

            HistoriqueService::enregistrer(
                action: 'suppression',
                module: 'utilisateurs',
                description: "A supprimé le compte utilisateur {$user->name}",
                elementId: $user->id
            );
        });

        // Supprimer la photo après la transaction
        if ($image) {
            Storage::disk('public')->delete($image);
        }

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }
}