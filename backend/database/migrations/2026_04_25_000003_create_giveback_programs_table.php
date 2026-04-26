<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('giveback_programs', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('title');
            $table->text('description');
            $table->string('beneficiary');
            $table->decimal('funding_goal', 12, 2);
            $table->decimal('amount_raised', 12, 2)->default(0);
            $table->unsignedInteger('donor_count')->default(0);
            $table->string('status')->default('ongoing');
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('giveback_programs');
    }
};
