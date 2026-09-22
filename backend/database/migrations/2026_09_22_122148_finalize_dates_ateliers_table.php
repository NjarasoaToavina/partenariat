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
        //
        Schema::table('ateliers', function (Blueprint $table) {
            $table->dateTime('date_debut_atel')->nullable(false)->change();
            $table->dateTime('date_fin_atel')->nullable(false)->change();
            $table->dropColumn('date_atel');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('ateliers', function (Blueprint $table) {
        // On fait l'inverse en cas de rollback : on recrée la colonne supprimée
        $table->date('date_atel')->nullable(); 
            
        // Si vos colonnes étaient nullables avant, remettez-les comme à l'origine
        $table->dateTime('date_debut_atel')->nullable()->change();
        $table->dateTime('date_fin_atel')->nullable()->change();
        });
    }
};
