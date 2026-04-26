<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AlumniUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Juan Santos Dela Cruz',
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'last_name' => 'Dela Cruz',
            'email' => 'alumni@addu.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'alumni',
            'is_active' => true,
            'approval_status' => 'approved',
            'current_address' => '123 Roxas Avenue, Poblacion District, Davao City',
            'phone_number' => '09171234567',
            'zipcode' => '8000',
            'sex' => 'male',
            'religion' => 'roman_catholic',
            'marital_status' => 'single',
            'birth_date' => '1995-05-15',
            'region' => 'region-11',
            'province' => 'Davao del Sur',
            'city' => 'City of Davao',
            'course' => 'BS Computer Science',
            'batch_year' => '2017',
            'has_diploma' => 'yes',
            'id_type' => 'drivers-license',
        ]);

        echo "Alumni user created:\n";
        echo "Email: alumni@addu.edu.ph\n";
        echo "Password: password\n";
    }
}
