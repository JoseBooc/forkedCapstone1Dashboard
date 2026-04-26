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
            'name' => 'Admin User',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@addu.edu.ph',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'approval_status' => 'approved',
        ]);

        echo "Admin user created:\n";
        echo "Email: admin@addu.edu.ph\n";
        echo "Password: password\n";
    }
}
