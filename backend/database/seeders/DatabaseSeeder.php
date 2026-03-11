<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ebook;
use App\Models\Reward;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'grade_level' => null,
            'class_name' => null,
        ]);

        // Buat Guru SMP
        User::create([
            'name' => 'Guru Budi',
            'email' => 'guru@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
            'grade_level' => 'smp',
            'class_name' => '8A',
        ]);

        // Buat Siswa
        User::create([
            'name' => 'Rina Kartika',
            'email' => 'rina@example.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'grade_level' => 'smp',
            'class_name' => '8A',
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'grade_level' => 'smp',
            'class_name' => '8A',
        ]);

        User::create([
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'grade_level' => 'smp',
            'class_name' => '8B',
        ]);

        User::create([
            'name' => 'Ahmad Ibrahim',
            'email' => 'ahmad@example.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'grade_level' => 'smp',
            'class_name' => '8B',
        ]);

        // Create sample e-books (tanpa file path, nanti upload via admin)
        Ebook::create([
            'title' => 'Laskar Pelangi',
            'author' => 'Andrea Hirata',
            'pages' => 534,
            'poin_per_halaman' => 5,
            'category' => 'Fiksi',
            'grade_level' => 'smp',
            'file_path' => null,
            'cover_image' => null,
            'is_active' => true,
        ]);

        Ebook::create([
            'title' => 'Negeri 5 Menara',
            'author' => 'A. Fuadi',
            'pages' => 487,
            'poin_per_halaman' => 5,
            'category' => 'Fiksi Islami',
            'grade_level' => 'smp',
            'file_path' => null,
            'cover_image' => null,
            'is_active' => true,
        ]);

        Ebook::create([
            'title' => 'Sang Pemimpi',
            'author' => 'Andrea Hirata',
            'pages' => 456,
            'poin_per_halaman' => 5,
            'category' => 'Fiksi',
            'grade_level' => 'smp',
            'file_path' => null,
            'cover_image' => null,
            'is_active' => true,
        ]);

        Ebook::create([
            'title' => 'Ayat-Ayat Cinta',
            'author' => 'Habiburrahman El Shirazy',
            'pages' => 302,
            'poin_per_halaman' => 5,
            'category' => 'Fiksi Islami',
            'grade_level' => 'smp',
            'file_path' => null,
            'cover_image' => null,
            'is_active' => true,
        ]);

        // Create sample rewards
        Reward::create([
            'name' => 'Buku Pilihan Gratis',
            'description' => 'Dapatkan buku pilihan dari koleksi kami secara gratis',
            'points_required' => 500,
            'stock' => 50,
            'category' => 'Buku',
            'icon' => '📚',
            'is_active' => true,
        ]);

        Reward::create([
            'name' => 'E-Voucher Belanja',
            'description' => 'Voucher belanja online senilai Rp 100.000',
            'points_required' => 300,
            'stock' => 100,
            'category' => 'Voucher',
            'icon' => '🎟️',
            'is_active' => true,
        ]);

        Reward::create([
            'name' => 'Merchandise READPOINT',
            'description' => 'Kaos dan merchandise eksklusif READPOINT',
            'points_required' => 1000,
            'stock' => 30,
            'category' => 'Merchandise',
            'icon' => '👕',
            'is_active' => true,
        ]);

        Reward::create([
            'name' => 'Pensil Mewah Set',
            'description' => 'Set pensil premium untuk menulis dan menggambar',
            'points_required' => 200,
            'stock' => 75,
            'category' => 'Alat Tulis',
            'icon' => '✏️',
            'is_active' => true,
        ]);

        Reward::create([
            'name' => 'Bookmark Edisi Khusus',
            'description' => 'Bookmark cantik dengan desain eksklusif',
            'points_required' => 100,
            'stock' => 200,
            'category' => 'Aksesori',
            'icon' => '🔖',
            'is_active' => true,
        ]);
    }
}
