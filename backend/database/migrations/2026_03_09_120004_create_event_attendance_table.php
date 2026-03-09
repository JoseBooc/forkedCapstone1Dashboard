<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_attendance', function (Blueprint $table) {
            $table->id();
            
            // Relationships
            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnDelete();
            $table->foreignId('registration_id')
                ->constrained('event_registrations')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            
            // Attendance Details
            $table->timestamp('checked_in_at');
            $table->timestamp('checked_out_at')->nullable();
            $table->foreignId('checked_in_by') // Admin/staff who checked them in
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            
            // Attendance Type
            $table->enum('attendance_type', ['in-person', 'virtual', 'hybrid'])->default('in-person');
            
            // Rating & Feedback
            $table->integer('rating')->nullable(); // 1-5 stars
            $table->text('feedback')->nullable();
            $table->timestamp('feedback_submitted_at')->nullable();
            
            // Additional Data
            $table->string('ip_address', 45)->nullable(); // For virtual events
            $table->string('device_info')->nullable();
            $table->integer('duration_minutes')->nullable(); // Time spent at event
            
            // Timestamps
            $table->timestamps();
            
            // Constraints
            $table->unique(['event_id', 'user_id']); // One attendance record per user per event
            
            // Indexes
            $table->index('checked_in_at');
            $table->index('rating');
            $table->index(['event_id', 'attendance_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendance');
    }
};
