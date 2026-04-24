<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_postings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('title');
            $table->string('type');
            $table->string('location')->nullable();
            $table->string('work_type')->nullable();
            $table->string('modality')->nullable();
            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->date('date_of_posting');
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('salary_from', 12, 2)->nullable();
            $table->decimal('salary_to', 12, 2)->nullable();
            $table->text('description');
            $table->string('status')->default('Pending');
            $table->unsignedInteger('applicants_count')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamp('hidden_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('career_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('career_posting_id')->constrained('career_postings')->cascadeOnDelete();
            $table->string('applicant_name');
            $table->string('applicant_email');
            $table->string('applicant_phone')->nullable();
            $table->text('cover_letter')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_applications');
        Schema::dropIfExists('career_postings');
    }
};