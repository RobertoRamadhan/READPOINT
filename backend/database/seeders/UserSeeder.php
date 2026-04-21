<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the users table.
     */
    public function run(): void
    {
        // Prevent duplicate seeding
        if (User::count() > 0) {
            echo "Users table already seeded, skipping...\n";
            return;
        }

        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create teacher users
        User::create([
            'name' => 'Guru Budi',
            'email' => 'gurui@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);


        // Create student users
        User::create([
            'name' => 'Rina Kusuma',
            'email' => 'rina@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);


        echo "Users seeded successfully!\n";
    }
}
