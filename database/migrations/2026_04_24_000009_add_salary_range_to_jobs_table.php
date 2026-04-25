<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('jobs')) {
            return;
        }

        Schema::table('jobs', function (Blueprint $table) {
            if (!Schema::hasColumn('jobs', 'salary_range_from')) {
                $table->decimal('salary_range_from', 12, 2)->nullable()->after('created_at');
            }

            if (!Schema::hasColumn('jobs', 'salary_range_to')) {
                $table->decimal('salary_range_to', 12, 2)->nullable()->after('salary_range_from');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('jobs')) {
            return;
        }

        Schema::table('jobs', function (Blueprint $table) {
            $drops = [];

            if (Schema::hasColumn('jobs', 'salary_range_to')) {
                $drops[] = 'salary_range_to';
            }

            if (Schema::hasColumn('jobs', 'salary_range_from')) {
                $drops[] = 'salary_range_from';
            }

            if (!empty($drops)) {
                $table->dropColumn($drops);
            }
        });
    }
};
