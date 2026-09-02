<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate([
            'name' => 'responsable',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'service',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'etudiant',
            'guard_name' => 'web',
        ]);

        Role::firstOrCreate([
            'name' => 'partenaire',
            'guard_name' => 'web',
        ]);
    }
}