<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Patient;
use App\Models\CareCategory;
use App\Models\CareProblem;
use App\Libraries\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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

        // Create 100 test patients
        for ($i = 1; $i <= 100; $i++) {
            Patient::create([
                'first_name' => "Test",
                'last_name' => "Patient $i",
                'social_id' => "$i",
                'arrival_date' => now(),
                'remarks' => "test",
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            // Create the main parent category
            $parentCategory = CareCategory::create([
                'parent_category_id' => null,
                'name' => "Main Category $i",
                'description' => "Description for main category $i",
            ]);

            // Create 2 subcategories for each main category
            for ($j = 1; $j <= 2; $j++) {
                CareCategory::create([
                    'parent_category_id' => $parentCategory->id,
                    'name' => "Subcategory $j (Main $i)",
                    'description' => "Description for subcategory $j of main category $i",
                ]);
            }
        }
    }
}
