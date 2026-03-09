<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User (if doesn't exist)
        if (!User::where('email', 'admin@addu.edu.ph')->exists()) {
            User::create([
                'name' => 'Admin User',
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@addu.edu.ph',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'is_active' => true,
                'approval_status' => 'approved',
            ]);
            echo "✓ Admin account created\n";
        } else {
            echo "✓ Admin account already exists\n";
        }

        // Create Alumni User (if doesn't exist)
        if (!User::where('email', 'alumni@addu.edu.ph')->exists()) {
            User::create([
                'name' => 'Alumni User',
                'first_name' => 'Alumni',
                'last_name' => 'User',
                'email' => 'alumni@addu.edu.ph',
                'password' => Hash::make('alumni123'),
                'role' => 'alumni',
                'phone_number' => '09123456789',
                'sex' => 'Male',
                'birth_date' => '2000-01-01',
                'current_address' => '123 Sample Street, Davao City',
                'country' => 'Philippines',
                'course' => 'Computer Science',
                'batch_year' => 2022,
                'is_active' => true,
                'approval_status' => 'approved',
            ]);
            echo "✓ Alumni account created\n";
        } else {
            echo "✓ Alumni account already exists\n";
        }

        echo "\n=== Test Users Created ===\n";
        echo "\nAdmin Account:\n";
        echo "Email: admin@addu.edu.ph\n";
        echo "Password: admin123\n";
        echo "\nAlumni Account:\n";
        echo "Email: alumni@addu.edu.ph\n";
        echo "Password: alumni123\n";
        echo "==========================\n\n";
    }
}
