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
            // Make all registration fields nullable
            $table->string('current_address')->nullable()->change();
            $table->string('telephone_number')->nullable()->change();
            $table->string('civil_status')->nullable()->change();
            $table->date('birth_date')->nullable()->change();
            $table->string('region')->nullable()->change();
            $table->string('province')->nullable()->change();
            $table->string('city')->nullable()->change();
            $table->string('diploma_file_path')->nullable()->change();
            $table->string('id_type')->nullable()->change();
            $table->string('valid_id_file_path')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Reverse nullable changes (optional)
        });
    }
};
