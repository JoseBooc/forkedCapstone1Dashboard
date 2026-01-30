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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->after('name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->after('middle_name');
            $table->text('current_address')->after('role');
            $table->string('phone_number', 20)->after('current_address');
            $table->string('telephone_number', 20)->nullable()->after('phone_number');
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated'])->after('telephone_number');
            $table->date('birth_date')->after('civil_status');
            $table->string('region')->after('birth_date');
            $table->string('province')->after('region');
            $table->string('city')->after('province');
            $table->string('course')->after('city');
            $table->string('batch_year', 4)->after('course');
            $table->enum('has_diploma', ['yes', 'no'])->default('no')->after('batch_year');
            $table->string('diploma_file_path')->nullable()->after('has_diploma');
            $table->string('id_type')->after('diploma_file_path');
            $table->string('valid_id_file_path')->after('id_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'current_address',
                'phone_number',
                'telephone_number',
                'civil_status',
                'birth_date',
                'region',
                'province',
                'city',
                'course',
                'batch_year',
                'has_diploma',
                'diploma_file_path',
                'id_type',
                'valid_id_file_path'
            ]);
        });
    }
};
