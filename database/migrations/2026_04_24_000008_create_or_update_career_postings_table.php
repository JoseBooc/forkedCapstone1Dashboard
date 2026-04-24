<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('career_postings')) {
            Schema::create('career_postings', function (Blueprint $table) {
                $table->id();
                $table->string('company_name');
                $table->string('title');
                $table->string('type');
                $table->string('location');
                $table->string('work_type');
                $table->string('modality');
                $table->date('date_from');
                $table->date('date_to');
                $table->date('posting_date');
                $table->unsignedInteger('quantity')->default(1);
                $table->decimal('salary_range_from', 12, 2);
                $table->decimal('salary_range_to', 12, 2);
                $table->text('description');
                $table->string('status')->default('Pending');
                $table->unsignedInteger('applicants_count')->default(0);
                $table->boolean('is_visible')->default(false);
                $table->timestamp('hidden_at')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });

            return;
        }

        Schema::table('career_postings', function (Blueprint $table) {
            if (!Schema::hasColumn('career_postings', 'date_from')) {
                $table->date('date_from')->nullable()->after('modality');
            }

            if (!Schema::hasColumn('career_postings', 'date_to')) {
                $table->date('date_to')->nullable()->after('date_from');
            }

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
    }

    public function down(): void
    {
        if (Schema::hasTable('career_postings')) {
            Schema::table('career_postings', function (Blueprint $table) {
                $drops = [];

                if (Schema::hasColumn('career_postings', 'salary_range_to')) {
                    $drops[] = 'salary_range_to';
                }

                if (Schema::hasColumn('career_postings', 'salary_range_from')) {
                    $drops[] = 'salary_range_from';
                }

                if (Schema::hasColumn('career_postings', 'posting_date')) {
                    $drops[] = 'posting_date';
                }

                if (Schema::hasColumn('career_postings', 'date_to')) {
                    $drops[] = 'date_to';
                }

                if (Schema::hasColumn('career_postings', 'date_from')) {
                    $drops[] = 'date_from';
                }

                if (!empty($drops)) {
                    $table->dropColumn($drops);
                }
            });
        }
    }
};
