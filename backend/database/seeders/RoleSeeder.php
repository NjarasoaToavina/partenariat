<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $responsable = Role::firstOrCreate([
            'name' => 'Responsable',
            'guard_name' => 'web',
        ]);

        $service = Role::firstOrCreate([
            'name' => 'Service',
            'guard_name' => 'web',
        ]);

        $etudiant = Role::firstOrCreate([
            'name' => 'Etudiant',
            'guard_name' => 'web',
        ]);

        $partenaire = Role::firstOrCreate([
            'name' => 'Partenaire',
            'guard_name' => 'web',
        ]);

        // Responsable
        $responsable->syncPermissions([
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.invite',

            'partenariats.view',
            'partenariats.create',
            'partenariats.update',
            'partenariats.delete',

            'propositions.view',
            'propositions.update',
            'propositions.validate',
            'propositions.reject',
            'propositions.comment',

            'conventions.view',
            'conventions.create',
            'conventions.update',
            'conventions.download',
            'conventions.associate',
            'conventions.renew',

            'ateliers.view',
            'ateliers.create',
            'ateliers.update',
            'ateliers.delete',

            'documents.view',
            'documents.create',
            'documents.update',
            'documents.download',
            'documents.correct',
            'documents.validate',
            'documents.reject',

            'activites.view',
            'activites.create',
            'activites.update',
            'activites.delete',
            'activites.validate',
            'activites.reject',

            'publications.view',
            'publications.update',
            'publications.delete',

            'commentaires.view',
            'commentaires.create',
            'commentaires.update',
            'commentaires.delete',

            'dashboard.view',
            'historique.view',
            'notifications.view',
            'profil.view',
            'profil.update',
        ]);

        // Service
        $service->syncPermissions([
            'propositions.view',
            'propositions.create',
            'propositions.update',

            'partenariats.view',

            'activites.view',

            'publications.view',

            'commentaires.view',
            'commentaires.create',
            'commentaires.update',
            'commentaires.delete',

            'dashboard.view',
            'historique.view',
            'notifications.view',
            'profil.view',
            'profil.update',
        ]);

        // Etudiant
        $etudiant->syncPermissions([
            'ateliers.view',

            'documents.view',
            'documents.create',
            'documents.update',
            'documents.download',

            'publications.view',

            'commentaires.view',
            'commentaires.create',
            'commentaires.update',
            'commentaires.delete',

            'historique.view',
            'notifications.view',
            'profil.view',
            'profil.update',
        ]);

        // Partenaire
        $partenaire->syncPermissions([
            'conventions.view',
            'conventions.download',

            'activites.view',
            'activites.propose',

            'publications.view',
            'publications.create',
            'publications.update',
            'publications.delete',

            'commentaires.view',
            'commentaires.create',
            'commentaires.update',
            'commentaires.delete',

            'historique.view',
            'notifications.view',
            'profil.view',
            'profil.update',
        ]);
    }
}