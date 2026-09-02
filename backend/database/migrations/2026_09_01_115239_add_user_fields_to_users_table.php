<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('image')->nullable();
            $table->string('role')->default('etudiant');
            
            $table->string('nom_service')->nullable();
            
            $table->string('filiere')->nullable();
            $table->string('niveau')->nullable();
            
            $table->string('fonction')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('image');
            $table->dropColumn('role');
            $table->dropColumn('nom_service');
            $table->dropColumn('filiere');
            $table->dropColumn('niveau');
            $table->dropColumn('fonction');
        });
    }
};
