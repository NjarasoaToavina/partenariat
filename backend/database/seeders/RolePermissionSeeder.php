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
            'partenariats.update',
            'partenariats.delete',
            'conventions.create',
            'conventions.update',
            'conventions.delete',
            'propositions.view',
            'propositions.validate',
            'propositions.reject',
            'activites.view',
            'activites.create',
            'ateliers.view',
            'ateliers.create',
            'ateliers.update',
            'ateliers.delete',
            'documents.view',
            'documents.validate',//ajouter
            'documents.reject', //ajouter
            'publications.view'
        );

        $service->syncPermissions(
            'dashboard.view',
            'partenariats.view',
            'propositions.view',
            'propositions.create',
            'propositions.update',
            'propositions.delete',
            'activites.view',
            'publications.view'
        );

        $partenaire->syncPermissions(
            'partenariats.view',
            'propositions.view',
            'activites.view',
            'activites.create',
            'ateliers.view',
            'publications.view'
        );

        $etudiant->syncPermissions(
            'documents.view',
            'documents.create', //ajouter
            'documents.update', //ajouter
            'documents.delete',
            'ateliers.view',
            'publications.view'
        );
    }
}
