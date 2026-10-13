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
        Schema::table('propositions', function (Blueprint $table) {
            //
            $table->string('campus_propos')->nullable();
            $table->string('contact_propos')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('propositions', function (Blueprint $table) {
            //
            $table->dropColumn(['campus_propos', 'contact_propos']);
        });
    }
};
