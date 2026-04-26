<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('giveback_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('collaboration')->nullable();
            $table->decimal('target_amount', 12, 2);
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
        Schema::dropIfExists('giveback_projects');
    }
};
