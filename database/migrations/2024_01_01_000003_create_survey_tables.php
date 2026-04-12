<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->default('');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id');
            $table->text('text');
            $table->string('type'); // text, textarea, radio, checkbox, select, number, date, month
            $table->boolean('required')->default(false);
            $table->string('placeholder')->default('');
            $table->text('help_text')->default('');
            $table->integer('order')->default(0);
            $table->string('condition_question_id')->nullable();
            $table->string('condition_operator')->nullable();
            $table->string('condition_value')->nullable();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

        Schema::create('answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('question_id');
            $table->string('text');
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
        });

        Schema::create('responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('respondent_email')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->unique('respondent_email');
        });

        Schema::create('response_answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('response_id');
            $table->uuid('question_id');
            $table->text('value')->nullable();
            $table->json('values')->nullable();
            $table->timestamps();

            $table->foreign('response_id')->references('id')->on('responses')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
        });

        Schema::create('drafts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('resume_code')->unique();
            $table->json('form_data')->default('{}');
            $table->integer('current_section')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drafts');
        Schema::dropIfExists('response_answers');
        Schema::dropIfExists('responses');
        Schema::dropIfExists('answers');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('categories');
    }
};
