<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('career_postings')) {
            return;
        }

        if (!Schema::hasColumn('career_postings', 'submitted_by_email')) {
            Schema::table('career_postings', function (Blueprint $table) {
                $table->string('submitted_by_email')->nullable()->after('description');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('career_postings') || !Schema::hasColumn('career_postings', 'submitted_by_email')) {
            return;
        }

        Schema::table('career_postings', function (Blueprint $table) {
            $table->dropColumn('submitted_by_email');
        });
    }
};
