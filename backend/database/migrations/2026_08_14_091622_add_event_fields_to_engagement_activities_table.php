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
        Schema::table('engagement_activities', function (Blueprint $table) {
            $table->string('event_type')->default('giveback')->after('id');
            $table->string('category')->nullable()->after('event_type');
            $table->dateTime('registration_start_at')->nullable()->after('schedule_end');
            $table->dateTime('registration_end_at')->nullable()->after('registration_start_at');
            $table->string('approval_status')->default('approved')->after('status');
            $table->text('rejection_reason')->nullable()->after('approval_status');
            $table->string('submitted_by_email')->nullable()->after('created_by_name');
            $table->dateTime('posted_at')->nullable()->after('submitted_by_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('engagement_activities', function (Blueprint $table) {
            $table->dropColumn([
                'event_type',
                'category',
                'registration_start_at',
                'registration_end_at',
                'approval_status',
                'rejection_reason',
                'submitted_by_email',
                'posted_at',
            ]);
        });
    }
};
