<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
            $table->date('birth_date')->nullable()->change();
            $table->string('region')->nullable()->change();
            $table->string('province')->nullable()->change();
            $table->string('city')->nullable()->change();
            $table->string('course')->nullable()->change();
            $table->string('batch_year', 4)->nullable()->change();
            $table->string('id_type')->nullable()->change();
            $table->string('valid_id_file_path')->nullable()->change();
        });

        // Postgres can't combine a type-change + check-constraint + drop-not-null
        // in one ALTER like Laravel's enum()->change() generates. Just drop NOT NULL
        // directly for these enum-backed columns instead.
        DB::statement('ALTER TABLE users ALTER COLUMN sex DROP NOT NULL');
        DB::statement('ALTER TABLE users ALTER COLUMN religion DROP NOT NULL');
        DB::statement('ALTER TABLE users ALTER COLUMN marital_status DROP NOT NULL');
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