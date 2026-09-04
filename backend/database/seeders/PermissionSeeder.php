<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Utilisateurs
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.invite',

            // Partenariats
            'partenariats.view',
            'partenariats.create',
            'partenariats.update',
            'partenariats.delete',

            // Propositions
            'propositions.view',
            'propositions.create',
            'propositions.update',
            'propositions.validate',
            'propositions.reject',
            'propositions.comment',

            // Conventions
            'conventions.view',
            'conventions.create',
            'conventions.update',
            'conventions.download',
            'conventions.associate',
            'conventions.renew',

            // Ateliers
            'ateliers.view',
            'ateliers.create',
            'ateliers.update',
            'ateliers.delete',

            // Documents
            'documents.view',
            'documents.create',
            'documents.update',
            'documents.download',
            'documents.correct',
            'documents.validate',
            'documents.reject',

            // Activités
            'activites.view',
            'activites.create',
            'activites.update',
            'activites.delete',
            'activites.propose',
            'activites.validate',
            'activites.reject',

            // Publications
            'publications.view',
            'publications.create',
            'publications.update',
            'publications.delete',

            // Commentaires
            'commentaires.view',
            'commentaires.create',
            'commentaires.update',
            'commentaires.delete',

            // Dashboard
            'dashboard.view',

            // Historique
            'historique.view',

            // Notifications
            'notifications.view',

            // Profil
            'profil.view',
            'profil.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}