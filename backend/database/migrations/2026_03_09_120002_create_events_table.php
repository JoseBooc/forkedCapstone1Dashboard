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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            
            // Basic Information
            $table->string('title');
            $table->text('description');
            $table->string('image_url')->nullable();
            
            // Category & Type
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('event_categories')
                ->nullOnDelete();
            
            // Location
            $table->string('location_type', 20)->default('physical'); // physical, virtual, hybrid
            $table->string('location_address')->nullable();
            $table->string('location_city')->nullable();
            $table->string('location_venue')->nullable(); // e.g., "Finster Hall"
            $table->string('virtual_meeting_url')->nullable();
            $table->text('location_notes')->nullable();
            
            // Date & Time
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->dateTime('registration_deadline')->nullable();
            
            // Capacity & Registration
            $table->integer('max_participants')->nullable(); // null = unlimited
            $table->integer('current_participants')->default(0);
            $table->boolean('requires_approval')->default(false); // Admin approval needed
            $table->boolean('allow_waitlist')->default(false);
            
            // Status
            $table->enum('status', ['draft', 'published', 'ongoing', 'completed', 'cancelled'])
                ->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_public')->default(true); // Public or alumni-only
            
            // Notifications
            $table->boolean('send_reminders')->default(true);
            $table->integer('reminder_days_before')->default(3);
            
            // Creator & Timestamps
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Soft delete support
            
            // Indexes for performance
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('registration_deadline');
            $table->index('is_featured');
            $table->index('is_public');
            $table->index(['status', 'start_date']);
            $table->index(['category_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
