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
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            
            // Relationships
            $table->foreignId('event_id')
                ->constrained('events')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            
            // Registration Details
            $table->enum('status', ['pending', 'confirmed', 'waitlist', 'cancelled', 'rejected'])
                ->default('confirmed');
            $table->text('notes')->nullable(); // User notes/questions during registration
            $table->text('dietary_requirements')->nullable();
            $table->text('special_needs')->nullable();
            
            // Guest Information (if bringing guests)
            $table->integer('number_of_guests')->default(0);
            $table->json('guest_details')->nullable(); // Store guest names/emails as JSON
            
            // Approval & Cancellation
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            // Check-in/Attendance (basic tracking)
            $table->boolean('attended')->default(false);
            $table->timestamp('checked_in_at')->nullable();
            
            // Notifications
            $table->boolean('reminder_sent')->default(false);
            $table->timestamp('reminder_sent_at')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Constraints
            $table->unique(['event_id', 'user_id']); // One registration per user per event
            
            // Indexes
            $table->index('status');
            $table->index('attended');
            $table->index(['event_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
