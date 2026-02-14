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
            $table->string('geocode')->after('telephone_number');
            $table->enum('sex', ['male', 'female', 'prefer_not_to_say'])->after('geocode');
            $table->enum('religion', ['roman_catholic', 'protestant', 'iglesia_ni_cristo', 'islam', 'born_again_christian', 'buddhist', 'other', 'prefer_not_to_say'])->after('sex');
            $table->string('religion_other')->nullable()->after('religion');
            $table->enum('marital_status', ['single', 'married', 'living_in', 'separated', 'annulled', 'divorced', 'widowed'])->after('religion_other');
            $table->string('marriage_date')->nullable()->after('marital_status');
            $table->enum('intend_to_marry', ['yes', 'no'])->nullable()->after('marriage_date');
            $table->string('intended_marriage_age')->nullable()->after('intend_to_marry');
            $table->text('no_marriage_reason')->nullable()->after('intended_marriage_age');
            $table->date('birth_date')->after('no_marriage_reason');
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
                'geocode',
                'sex',
                'religion',
                'religion_other',
                'marital_status',
                'marriage_date',
                'intend_to_marry',
                'intended_marriage_age',
                'no_marriage_reason',
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
