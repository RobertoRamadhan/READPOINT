<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin READPOINT',
            'email' => 'admin@readpoint.local',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Guru User
        User::create([
            'name' => 'Ibu Guru Siti',
            'email' => 'guru@readpoint.local',
            'password' => Hash::make('password123'),
            'role' => 'guru',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Siswa User
        User::create([
            'name' => 'Rina Kartika',
            'email' => 'siswa@readpoint.local',
            'password' => Hash::make('password123'),
            'role' => 'siswa',
            'class_name' => '6A',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
