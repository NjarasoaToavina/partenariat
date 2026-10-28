<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historiques', function (Blueprint $table) {
            $table->id('id_hist');

            // Utilisateur ayant effectué l'action
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Type d'action : creation, modification, suppression...
            $table->string('action', 50);

            // Module concerné : partenariats, documents...
            $table->string('module', 100);

            // Description de l'action
            $table->text('description');

            // Identifiant de l'élément concerné
            $table->unsignedBigInteger('element_id')->nullable();

            // Date et heure de l'action
            $table->timestamps();

            // Index pour faciliter les recherches
            $table->index(['module', 'action']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historiques');
    }
};