<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Regular User (Alumni)
        User::create([
            'name' => 'Regular User',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'role' => 'alumni',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        echo "✓ Test accounts created successfully:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "Admin Account:\n";
        echo "  Email:    admin@test.com\n";
        echo "  Password: password123\n";
        echo "  Role:     admin\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "Regular User Account:\n";
        echo "  Email:    user@test.com\n";
        echo "  Password: password123\n";
        echo "  Role:     alumni\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    }
}
