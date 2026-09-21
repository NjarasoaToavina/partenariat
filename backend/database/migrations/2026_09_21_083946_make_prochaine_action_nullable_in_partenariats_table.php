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
        Schema::table('partenariats', function (Blueprint $table) {
            //
            $table->string('prochaine_action')->nullable()->change();
            $table->string('observation')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partenariats', function (Blueprint $table) {
            //
            $table->string('prochaine_action')->nullable()->change();
            $table->string('observation')->nullable()->change();
        });
    }
};
