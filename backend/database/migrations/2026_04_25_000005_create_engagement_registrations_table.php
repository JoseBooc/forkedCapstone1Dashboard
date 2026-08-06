<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('engagement_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('engagement_activities')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->unsignedInteger('guests_count')->default(0);
            $table->decimal('amount_due', 12, 2)->default(0);
            $table->string('payment_method')->default('cash');
            $table->string('reference_number')->nullable()->unique();
            $table->string('proof_path')->nullable();
            $table->string('payment_status')->default('pending');
            $table->string('status')->default('registered');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_registrations');
    }
};
