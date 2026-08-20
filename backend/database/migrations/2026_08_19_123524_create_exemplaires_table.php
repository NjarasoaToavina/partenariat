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
        Schema::create('exemplaires', function (Blueprint $table) {
            $table->id('id_exe');
            $table->string('doc_exe');
            $table->timestamps();
            // Clé étrangère
            $table->foreignId('id_atel')
                    ->nullable()
                    ->constrained('ateliers', 'id_atel')
                    ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exemplaires');
    }
};
