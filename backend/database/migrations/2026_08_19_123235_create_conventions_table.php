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
        Schema::create('conventions', function (Blueprint $table) {
            $table->id('id_conv');
            $table->string('num_conv');
            $table->string('preambule');
            $table->string('repres_int');
            $table->string('repres_ext');
            $table->string('fct_int');
            $table->string('fct_ext');
            $table->string('objet_part');
            $table->string('axe_collab');
            $table->string('cond_part');
            $table->string('cond_finan');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('resiliation');
            $table->string('confidentialite');
            $table->string('regle_diff');
            $table->string('droit appli');
            $table->string('photo_conv');
            $table->string('scan');
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
        Schema::dropIfExists('conventions');
    }
};
