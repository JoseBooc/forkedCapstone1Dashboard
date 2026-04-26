<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create sample alumni user
        User::create([
            'name' => 'Juan Santos Dela Cruz',
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'last_name' => 'Dela Cruz',
            'email' => 'alumni@addu.edu.ph',
            'password' => bcrypt('alumni123'),
            'role' => 'alumni',
            'email_verified_at' => now(),
            'is_active' => 1,
            'current_address' => '123 Roxas Avenue, Poblacion District, Davao City, 8000',
            'phone_number' => '+639171234567',
            'telephone_number' => '(082) 221-2411',
            'zipcode' => '7.0731,125.6128',
            'sex' => 'male',
            'religion' => 'roman_catholic',
            'marital_status' => 'single',
            'birth_date' => '1995-05-15',
            'region' => 'region-11',
            'province' => 'Davao del Sur',
            'city' => 'Davao City',
            'course' => 'bs-computer-science',
            'batch_year' => '2017',
            'has_diploma' => 'yes',
            'diploma_file_path' => 'diplomas/juan_diploma.jpg',
            'id_type' => 'drivers-license',
            'valid_id_file_path' => 'valid_ids/juan_id.jpg',
        ]);

        // Create sample admin user
        User::create([
            'name' => 'Admin System User',
            'first_name' => 'Admin',
            'middle_name' => 'System',
            'last_name' => 'User',
            'email' => 'admin@addu.edu.ph',
            'password' => bcrypt('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_active' => 1,
            'current_address' => 'Ateneo de Davao University, E. Jacinto St, Davao City, 8000',
            'phone_number' => '+639189876543',
            'telephone_number' => '(082) 221-2411',
            'zipcode' => '7.0722,125.6131',
            'sex' => 'male',
            'religion' => 'roman_catholic',
            'marital_status' => 'married',
            'birth_date' => '1985-03-20',
            'region' => 'region-11',
            'province' => 'Davao del Sur',
            'city' => 'Davao City',
            'course' => 'bs-information-technology',
            'batch_year' => '2007',
            'has_diploma' => 'yes',
            'diploma_file_path' => 'diplomas/admin_diploma.jpg',
            'id_type' => 'national-id',
            'valid_id_file_path' => 'valid_ids/admin_id.jpg',
        ]);
    }
}
