<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Makes all optional user profile fields nullable so admin can create
     * users without requiring every registration field.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->change();
            $table->string('last_name')->nullable()->change();
            $table->text('current_address')->nullable()->change();
            $table->string('phone_number', 20)->nullable()->change();
            $table->string('country')->nullable()->default(null)->change();
            $table->string('geocode')->nullable()->change();
            $table->enum('sex', ['male', 'female', 'prefer_not_to_say'])->nullable()->change();
            $table->enum('religion', ['roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again_christian', 'buddhist', 'other', 'prefer_not_to_say'])->nullable()->change();
            $table->enum('marital_status', ['single', 'married', 'living_in', 'separated', 'annulled', 'divorced', 'widowed'])->nullable()->change();
            $table->date('birth_date')->nullable()->change();
            $table->string('region')->nullable()->change();
            $table->string('province')->nullable()->change();
            $table->string('city')->nullable()->change();
            $table->string('course')->nullable()->change();
            $table->string('batch_year', 4)->nullable()->change();
            $table->string('id_type')->nullable()->change();
            $table->string('valid_id_file_path')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: reversing nullable changes would require knowing original defaults
        // and could break data - intentionally left as no-op
    }
};
