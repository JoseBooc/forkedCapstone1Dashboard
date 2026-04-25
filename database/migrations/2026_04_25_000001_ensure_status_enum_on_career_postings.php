<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('career_postings')) {
            return;
        }

        if (!Schema::hasColumn('career_postings', 'status')) {
            Schema::table('career_postings', function (Blueprint $table) {
                $table->enum('status', ['pending', 'approved', 'rejected'])
                    ->default('pending')
                    ->after('description');
            });

            return;
        }

        // Normalize existing values before constraining to enum.
        DB::statement("UPDATE career_postings
            SET status = CASE
                WHEN LOWER(status) = 'approved' THEN 'approved'
                WHEN LOWER(status) IN ('rejected', 'declined') THEN 'rejected'
                ELSE 'pending'
            END");

        DB::statement("ALTER TABLE career_postings
            MODIFY COLUMN status ENUM('pending','approved','rejected')
            NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        if (!Schema::hasTable('career_postings') || !Schema::hasColumn('career_postings', 'status')) {
            return;
        }

        DB::statement("ALTER TABLE career_postings
            MODIFY COLUMN status VARCHAR(255)
            NOT NULL DEFAULT 'pending'");
    }
};
