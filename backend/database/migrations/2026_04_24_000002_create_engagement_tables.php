<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('engagement_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('event_group')->default('engagement');
            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->unsignedInteger('capacity')->default(0);
            $table->unsignedInteger('participants_count')->default(0);
            $table->unsignedInteger('guest_count')->default(0);
            $table->decimal('registration_fee', 12, 2)->default(0);
            $table->string('status')->default('Approved');
            $table->string('posted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engagement_event_id')->constrained('engagement_events')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->boolean('is_guest')->default(false);
            $table->unsignedInteger('guest_count')->default(0);
            $table->decimal('fee_amount', 12, 2)->default(0);
            $table->string('payment_status')->default('Unpaid');
            $table->timestamps();
        });

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engagement_event_id')->constrained('engagement_events')->cascadeOnDelete();
            $table->foreignId('event_registration_id')->nullable()->constrained('event_registrations')->nullOnDelete();
            $table->string('attendee_name');
            $table->string('attendee_email')->nullable();
            $table->boolean('attended')->default(true);
            $table->timestamp('attended_at')->nullable();
            $table->timestamps();
        });

        Schema::create('event_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('engagement_event_id')->constrained('engagement_events')->cascadeOnDelete();
            $table->foreignId('event_registration_id')->nullable()->constrained('event_registrations')->nullOnDelete();
            $table->string('payer_name');
            $table->string('payer_email')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('status')->default('Paid');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_payments');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('engagement_events');
    }
};