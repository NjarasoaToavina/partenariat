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
        Schema::table('activites', function (Blueprint $table) {
            //
            $table->renameColumn('date_activ', 'date_debut_activ');

            // Ajouter la date de fin
            $table->dateTime('date_fin_activ');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activites', function (Blueprint $table) {
            //
            $table->dropColumn('date_fin_activ');
            $table->renameColumn('date_debut_activ', 'date_activ');
        });
    }
};
