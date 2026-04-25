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

        if (!Schema::hasColumn('career_postings', 'submitted_by_email')) {
            Schema::table('career_postings', function (Blueprint $table) {
                $table->string('submitted_by_email')->nullable()->after('description');
            });
        }

        $indexName = 'career_postings_submitted_by_email_index';
        $hasIndex = DB::table('information_schema.statistics')
            ->whereRaw('table_schema = database()')
            ->where('table_name', 'career_postings')
            ->where('index_name', $indexName)
            ->exists();

        if (!$hasIndex) {
            Schema::table('career_postings', function (Blueprint $table) use ($indexName) {
                $table->index('submitted_by_email', $indexName);
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('career_postings')) {
            return;
        }

        $indexName = 'career_postings_submitted_by_email_index';
        $hasIndex = DB::table('information_schema.statistics')
            ->whereRaw('table_schema = database()')
            ->where('table_name', 'career_postings')
            ->where('index_name', $indexName)
            ->exists();

        if ($hasIndex) {
            Schema::table('career_postings', function (Blueprint $table) use ($indexName) {
                $table->dropIndex($indexName);
            });
        }
    }
};
