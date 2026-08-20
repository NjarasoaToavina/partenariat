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
        Schema::create('ateliers', function (Blueprint $table) {
            $table->id('id_atel');
            $table->datetime('date_atel');
            $table->string('campus_atel');
            $table->string('groupe');
            $table->string('contenu_atel');
            $table->string('intervenant');
            $table->string('statut_atel');
            $table->timestamps();

              // Clé étrangère
            $table->foreignId('id_part')
                    ->nullable()
                    ->constrained('partenariats', 'id_part')
                    ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ateliers');
    }
};
