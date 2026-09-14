<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'userType' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],

            'image' => ['nullable', 'image', 'max:2048'],

            'fonction' => ['nullable', 'string', 'max:255'],
            'nom_service' => ['nullable', 'string', 'max:255'],
            'filiere' => ['nullable', 'string', 'max:255'],
            'niveau' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'fonction' => $validated['fonction'] ?? null,
            'nom_service' => $validated['nom_service'] ?? null,
            'filiere' => $validated['filiere'] ?? null,
            'niveau' => $validated['niveau'] ?? null,
        ]);

        $role = $this->resolveRole($validated['userType']);

        $user->assignRole($role);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Chercher l'utilisateur par son email
        $user = User::where('email', $validated['email'])->first();

        // Vérifier si l'utilisateur existe et si le mot de passe correspond
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Générer un nouveau jeton d'accès Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        // Supprime le jeton actuel utilisé pour cette requête
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ], 200);
    }

    private function resolveRole(string $userType): string
    {
        return match ($userType) {
            'etudiant' => 'etudiant',
            'partenaire' => 'partenaire',
            'service' => 'service',
            'responsable' => 'responsable',
            default => throw ValidationException::withMessages([
                'userType' => ['Type utilisateur invalide.'],
            ]),
        };
    }
}