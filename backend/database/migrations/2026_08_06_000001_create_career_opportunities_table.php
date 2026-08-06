<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Job | Internship
            $table->string('title');
            $table->string('company');
            $table->string('location');
            $table->string('work_type'); // Full-time, Part-time, Contract, Internship
            $table->string('modality'); // Remote, Hybrid, On-site
            $table->string('salary_range')->nullable();
            $table->text('description');
            $table->string('application_email');
            $table->boolean('is_priority')->default(false);
            $table->string('status')->default('published'); // published | archived
            $table->string('posted_by_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_opportunities');
    }
};
