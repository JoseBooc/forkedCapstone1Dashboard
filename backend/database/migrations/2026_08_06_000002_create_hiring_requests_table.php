<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hiring_requests', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Job | Internship
            $table->string('title');
            $table->string('company');
            $table->string('location');
            $table->string('work_type');
            $table->string('modality');
            $table->string('salary_range')->nullable();
            $table->text('description');
            $table->string('application_email');
            $table->string('submitted_by_name')->nullable();
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->text('rejection_reason')->nullable();
            $table->string('reviewed_by_name')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('approved_opportunity_id')->nullable()
                ->constrained('career_opportunities')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hiring_requests');
    }
};
