<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\HistoriqueService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
            'nie' => ['nullable', 'string', 'max:255'],
            'filiere' => ['nullable', 'string', 'max:255'],
            'niveau' => ['nullable', 'string', 'max:255'],
        ]);

        // 1. Initialiser le chemin de l'image à null
        $imagePath = null;

        // 2. Vérifier si une image a bien été envoyée dans la requête
        if ($request->hasFile('image')) {
            // Sauvegarde le fichier dans storage/app/public/profiles et récupère le chemin abrégé
            $imagePath = $request->file('image')->store('profiles', 'public');
        }

        try {
            [$user, $roles] = DB::transaction(function () use ($validated, $imagePath) {

                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'image' => $imagePath,
                    'fonction' => $validated['fonction'] ?? null,
                    'nom_service' => $validated['nom_service'] ?? null,
                    'nie' => $validated['nie'] ?? null,
                    'filiere' => $validated['filiere'] ?? null,
                    'niveau' => $validated['niveau'] ?? null,
                ]);

                $roles = $this->resolveRole($validated['userType']);

                $user->assignRole($roles);

                HistoriqueService::enregistrer(
                    action: 'inscription',
                    module: 'authentification',
                    description: "Création du compte utilisateur {$user->name}",
                    elementId: $user->id,
                    userId: $user->id
                );

                return [$user, $roles];
            });

        } catch (\Throwable $e) {

            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $e;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $permissions = $user->getAllPermissions() ->pluck('name') ->values();

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $token,
            'roles' => $roles,
            'permissions' => $permissions,
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

        $roles = $user->getRoleNames(); // Récupère les rôles de l'utilisateur

        $permissions = $user->getAllPermissions()->pluck('name')->values(); // Récupère les permissions de l'utilisateur

        $token = DB::transaction(function () use ($user) {

            $token = $user->createToken('auth_token')->plainTextToken;

            HistoriqueService::enregistrer(
                action: 'connexion',
                module: 'authentification',
                description: "S'est connecté à l'application",
                elementId: $user->id,
                userId: $user->id
            );

            return $token;
        });

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'token' => $token,
            'roles' => $roles,
            'permissions' => $permissions,
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        DB::transaction(function () use ($user) {

            HistoriqueService::enregistrer(
                action: 'deconnexion',
                module: 'authentification',
                description: "S'est déconnecté de l'application",
                elementId: $user->id
            );

            // Supprime le jeton actuel utilisé pour cette requête
            $user->currentAccessToken()->delete();
        });

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