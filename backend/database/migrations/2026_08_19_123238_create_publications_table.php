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
        Schema::create('publications', function (Blueprint $table) {
            $table->id('id_pub');
            $table->string('titre_pub');
            $table->string('contenu_pub');
            $table->integer('reaction')->unsigned()->default(0);
            $table->string('photo_pub');
            $table->string('date_pub');
            $table->timestamps();
            // Clé étrangère
            $table->foreignId('user_id')
                    ->nullable()
                    ->constrained()
                    ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
