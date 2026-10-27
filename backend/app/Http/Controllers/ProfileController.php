<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        // 1. Validation identique à l'inscription
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'current_password' => ['required', 'string'], 
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

        // Vérifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.',
                'errors' => [
                    'current_password' => [
                        'Le mot de passe actuel est incorrect.'
                    ]
                ]
            ], 422);
        }

        // 2. Modifier les informations communes
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // 3. Modifier les champs selon le rôle
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

        // 4. Modifier le mot de passe uniquement s'il est renseigné
        if (!empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        // 5. Gestion de la photo de profil
        $oldImage = null;

        if ($request->hasFile('image')) {

            // Conserver le chemin de l'ancienne photo
            $oldImage = $user->image;

            // Enregistrer la nouvelle photo
            $imagePath = $request->file('image')
                ->store('profiles', 'public');

            // Mettre à jour le chemin
            $user->image = $imagePath;
        }

        // 6. Enregistrer les modifications
        $user->save();

        // 7. Supprimer l'ancienne photo si elle a été remplacée
        if ($oldImage && $oldImage !== $user->image) {
            Storage::disk('public')->delete($oldImage);
        }

        // 8. Retourner les informations actualisées
        return response()->json([
            'message' => 'Profil modifié avec succès.',
            'user' => $user->fresh(),
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()
                ->pluck('name')
                ->values(),
        ], 200);
    }
}