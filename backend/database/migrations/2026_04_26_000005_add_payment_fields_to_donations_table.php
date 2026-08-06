<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->string('frequency')->default('One-Time')->after('amount');
            $table->string('designation')->nullable()->after('frequency');
            $table->string('reference_number')->nullable()->after('payment_method');
            $table->date('transaction_date')->nullable()->after('reference_number');
            $table->string('gcash_number')->nullable()->after('transaction_date');
            $table->string('account_name')->nullable()->after('gcash_number');
            $table->string('bank_name')->nullable()->after('account_name');
            $table->string('card_number')->nullable()->after('bank_name');
            $table->string('proof_path')->nullable()->after('card_number');
            $table->string('payment_status')->default('pending')->after('proof_path');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn([
                'frequency',
                'designation',
                'reference_number',
                'transaction_date',
                'gcash_number',
                'account_name',
                'bank_name',
                'card_number',
                'proof_path',
                'payment_status',
            ]);
        });
    }
};