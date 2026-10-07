<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $responsable = Role::findByName('responsable');
        $service = Role::findByName('service');
        $partenaire = Role::findByName('partenaire');
        $etudiant = Role::findByName('etudiant');

        $responsable->syncPermissions(
            'dashboard.view',
            'partenariats.view',
            'propositions.view',
            'activites.view',
            'ateliers.view',
            'documents.view',
            'publications.view'
        );

        $service->syncPermissions(
            'dashboard.view',
            'partenariats.view',
            'propositions.view',
            'activites.view',
            'publications.view'
        );

        $partenaire->syncPermissions(
            'partenariats.view',
            'propositions.view',
            'activites.view',
            'ateliers.view',
            'publications.view'
        );

        $etudiant->syncPermissions(
            'documents.view',
            'ateliers.view',
            'publications.view'
        );
    }
}
