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
            'email' => 'admin@readpoint.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create teacher users
        User::create([
            'name' => 'Guru Budi',
            'email' => 'guru.budi@school.com',
            'password' => Hash::make('password123'),
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Guru Siti',
            'email' => 'guru.siti@school.com',
            'password' => Hash::make('password123'),
            'role' => 'guru',
            'email_verified_at' => now(),
        ]);

        // Create student users
        User::create([
            'name' => 'Rina Kusuma',
            'email' => 'rina@student.com',
            'password' => Hash::make('password123'),
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@student.com',
            'password' => Hash::make('password123'),
            'role' => 'siswa',
            'email_verified_at' => now(),
        ]);

        echo "Users seeded successfully!\n";
    }
}
