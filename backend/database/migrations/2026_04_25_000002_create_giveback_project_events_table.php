<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('giveback_project_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('giveback_projects')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('location')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('upcoming');
            $table->string('image_url')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('giveback_project_events');
    }
};
