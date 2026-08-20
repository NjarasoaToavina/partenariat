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
        Schema::create('partenariats', function (Blueprint $table) {
            $table->id('id_part');
            $table->string('nom_part');
            $table->string('campus_part');
            $table->string('statut_part');
            $table->string('type_part');
            $table->integer('nbr_intervenant')->unsigned();
            $table->string('prochaine_action');
            $table->string('contact_part');
            $table->string('observation');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partenariats');
    }
};
