<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'alumni@test.com'],
            [
                'name' => 'Alumni User',
                'password' => Hash::make('alumni123'),
                'email_verified_at' => now(),
            ]
        );

        echo "Seeded local test accounts:\n";
        echo "Admin:  admin@test.com / admin123\n";
        echo "Alumni: alumni@test.com / alumni123\n";
    }
}