<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('career_postings', function (Blueprint $table) {
            if (!Schema::hasColumn('career_postings', 'posting_date')) {
                $table->date('posting_date')->nullable()->after('date_to');
            }

            if (!Schema::hasColumn('career_postings', 'salary_range_from')) {
                $table->decimal('salary_range_from', 12, 2)->nullable()->after('quantity');
            }

            if (!Schema::hasColumn('career_postings', 'salary_range_to')) {
                $table->decimal('salary_range_to', 12, 2)->nullable()->after('salary_range_from');
            }
        });

        DB::table('career_postings')->update([
            'posting_date' => DB::raw('COALESCE(posting_date, date_of_posting)'),
            'salary_range_from' => DB::raw('COALESCE(salary_range_from, salary_from)'),
            'salary_range_to' => DB::raw('COALESCE(salary_range_to, salary_to)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('career_postings', function (Blueprint $table) {
            $drops = [];

            if (Schema::hasColumn('career_postings', 'posting_date')) {
                $drops[] = 'posting_date';
            }

            if (Schema::hasColumn('career_postings', 'salary_range_from')) {
                $drops[] = 'salary_range_from';
            }

            if (Schema::hasColumn('career_postings', 'salary_range_to')) {
                $drops[] = 'salary_range_to';
            }

            if (!empty($drops)) {
                $table->dropColumn($drops);
            }
        });
    }
};
