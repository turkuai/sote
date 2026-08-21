<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Libraries\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run(): void {
        // Create admin user with full permissions
        $admin = User::create([
            'name' => 'Admin User',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'role' => Role::getPermissions('admin'),
            'role_type' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create manager (moderator) - can manage nurses, create groups, approve actions
        $manager = User::create([
            'name' => 'Jane Smith',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'role' => Role::getPermissions('manager'),
            'role_type' => 'manager',
            'email_verified_at' => now(),
        ]);

        // Create nurse (regular user) - read-only access
        $nurse = User::create([
            'name' => 'Bob Johnson',
            'first_name' => 'Bob',
            'last_name' => 'Johnson',
            'email' => 'bob@example.com',
            'password' => Hash::make('password123'),
            'role' => Role::getPermissions('nurse'),
            'role_type' => 'nurse',
            'email_verified_at' => now(),
        ]);

        // Create 1000 additional test users
        for ($i = 1; $i <= 100; $i++) {
            User::create([
                'name' => "Test User $i",
                'first_name' => "Test",
                'last_name' => "User $i",
                'email' => "testuser$i@example.com",
                'password' => Hash::make('password123'),
                'role' => Role::getPermissions('nurse'),
                'role_type' => 'nurse',
                'email_verified_at' => now(),
            ]);
        }
    }
}
