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
        Schema::table('users', function (Blueprint $table) {
            // Add country field after current_address with default value 'Philippines'
            $table->string('country')->default('Philippines')->after('current_address');
            
            // Make region, province, and city nullable since they're only required for Philippines
            $table->string('region')->nullable()->change();
            $table->string('province')->nullable()->change();
            $table->string('city')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove country field
            $table->dropColumn('country');
            
            // Revert region, province, and city back to non-nullable
            $table->string('region')->nullable(false)->change();
            $table->string('province')->nullable(false)->change();
            $table->string('city')->nullable(false)->change();
        });
    }
};
