<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@addu.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'graduation_year' => 2026,
            'degree' => 'Computer Science',
            'is_active' => true,
        ]);

        echo "Admin user created:\n";
        echo "Email: admin@addu.edu.ph\n";
        echo "Password: password\n";
    }
}
