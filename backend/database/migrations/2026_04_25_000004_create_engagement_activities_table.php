<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('engagement_activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('venue');
            $table->dateTime('schedule_start');
            $table->dateTime('schedule_end');
            $table->boolean('registration_open')->default(true);
            $table->unsignedInteger('participant_limit')->nullable();
            $table->decimal('fee_amount', 12, 2)->default(0);
            $table->string('status')->default('upcoming');
            $table->string('image_url')->nullable();
            $table->string('created_by_name')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_activities');
    }
};
