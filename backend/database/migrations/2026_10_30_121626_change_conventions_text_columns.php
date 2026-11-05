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
        Schema::table('conventions', function (Blueprint $table) {
            $table->text('preambule')->nullable()->change();
            $table->text('objet_part')->change();
            $table->text('axe_collab')->nullable()->change();
            $table->text('cond_part')->nullable()->change();
            $table->text('cond_finan')->nullable()->change();
            $table->text('resiliation')->nullable()->change();
            $table->text('confidentialite')->nullable()->change();
            $table->text('regle_diff')->nullable()->change();
            $table->text('droit_appli')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
