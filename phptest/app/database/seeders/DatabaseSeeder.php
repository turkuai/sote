<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Group;
use App\Libraries\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create some groups
        $adminGroup = Group::create(['name' => 'Administrators']);
        $userGroup = Group::create(['name' => 'Users']);
        $moderatorGroup = Group::create(['name' => 'Moderators']);

        // Create admin user with full permissions
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'role' => Role::getRoleValue('admin'),
            'role_type' => 'admin',
        ]);

        // Create manager (moderator) - can manage nurses, create groups, approve actions
        $manager = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'role' => Role::getRoleValue('manager'),
            'role_type' => 'manager',
        ]);

        // Create nurse (regular user) - read-only access
        $nurse = User::create([
            'first_name' => 'Bob',
            'last_name' => 'Johnson',
            'email' => 'bob@example.com',
            'role' => Role::getRoleValue('nurse'),
            'role_type' => 'nurse',
        ]);

        // Assign users to groups
        $admin->groups()->attach([$adminGroup->id, $userGroup->id]);
        $manager->groups()->attach([$userGroup->id, $moderatorGroup->id]);
        $nurse->groups()->attach([$userGroup->id]);
    }
}

