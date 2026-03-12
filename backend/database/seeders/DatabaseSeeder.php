<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use App\Models\Ebook;
use App\Models\Reward;
use App\Models\QuizQuestion;
use App\Models\ReadingActivity;
use App\Models\PointTransaction;
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
        // ===== CREATE USERS =====
        
        // Create Admins
        User::create([
            'name' => 'Admin Readpoint',
            'email' => 'admin@readpoint.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create Gurus
        $guru1 = User::create([
            'name' => 'Budi Santoso, S.Pd',
            'email' => 'guru.budi@school.com',
            'password' => Hash::make('password123'),
            'role' => 'guru',
            'class_name' => '8A',
        ]);

        $guru2 = User::create([
            'name' => 'Siti Nurhaliza, S.Pd',
            'email' => 'guru.siti@school.com',
            'password' => Hash::make('password123'),
            'role' => 'guru',
            'class_name' => '8B',
        ]);

        // Create Siswa (10 students)
        $siswaNames = [
            ['Rina Kartika', 'rina@student.com', '8A'],
            ['Ahmad Ibrahim', 'ahmad@student.com', '8A'],
            ['Joko Suryanto', 'joko@student.com', '8A'],
            ['Dian Lestari', 'dian@student.com', '8A'],
            ['Farah Fadillah', 'farah@student.com', '8B'],
            ['Rapi Rahardja', 'rapi@student.com', '8B'],
            ['Nisa Pratiwi', 'nisa@student.com', '8B'],
            ['Adi Pratama', 'adi@student.com', '8B'],
            ['Mira Sintia', 'mira@student.com', '8A'],
            ['Hendra Wijaya', 'hendra@student.com', '8B'],
        ];

        $siswaUsers = [];
        foreach ($siswaNames as [$name, $email, $class]) {
            $siswaUsers[] = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => 'siswa',
                'grade_level' => 8,
                'class_name' => $class,
            ]);
        }

        // ===== CREATE EBOOKS =====
        $ebooks = [];
        $ebookData = [
            ['Laskar Pelangi', 'Andrea Hirata', 534, 5, 'Fiksi'],
            ['Negeri 5 Menara', 'A. Fuadi', 487, 5, 'Fiksi Islami'],
            ['Sang Pemimpi', 'Andrea Hirata', 456, 5, 'Fiksi'],
            ['Ayat-Ayat Cinta', 'Habiburrahman El Shirazy', 302, 5, 'Fiksi Islami'],
            ['Kecil-Kecil Tapi Juragannya', 'Deden Makbul', 334, 3, 'Motivasi'],
            ['Filosofi Teras', 'Henry Manampiring', 560, 4, 'Self-Help'],
        ];

        foreach ($ebookData as [$title, $author, $pages, $poin, $category]) {
            $ebooks[] = Ebook::create([
                'title' => $title,
                'author' => $author,
                'pages' => $pages,
                'poin_per_halaman' => $poin,
                'category' => $category,
                'grade_level' => 'smp',
                'file_path' => null,
                'cover_image' => null,
                'is_active' => true,
            ]);
        }

        // ===== CREATE REWARDS =====
        $rewards = [];
        $rewardData = [
            ['Buku Pilihan Gratis', 'Dapatkan buku pilihan dari koleksi kami secara gratis', 500, 50, 'Buku', '📚'],
            ['E-Voucher Belanja', 'Voucher belanja online senilai Rp 100.000', 300, 100, 'Voucher', '🎟️'],
            ['Merchandise READPOINT', 'Kaos dan merchandise eksklusif READPOINT', 250, 75, 'Merchandise', '👕'],
            ['Sertifikat Digital', 'Sertifikat pencapaian membaca digital', 150, 200, 'Sertifikat', '🏆'],
        ];

        foreach ($rewardData as [$name, $desc, $points, $stock, $cat, $icon]) {
            $rewards[] = Reward::create([
                'name' => $name,
                'description' => $desc,
                'points_required' => $points,
                'stock' => $stock,
                'category' => $cat,
                'icon' => $icon,
                'is_active' => true,
            ]);
        }

        // ===== CREATE READING ACTIVITIES & POINTS FOR STUDENTS =====
        foreach ($siswaUsers as $index => $siswa) {
            // Create 2-4 reading activities per student
            for ($i = 0; $i < rand(2, 4); $i++) {
                $ebook = $ebooks[rand(0, count($ebooks) - 1)];
                $pagesRead = rand(50, 300);
                $poinEarned = $pagesRead * $ebook->poin_per_halaman;

                ReadingActivity::create([
                    'user_id' => $siswa->id,
                    'ebook_id' => $ebook->id,
                    'started_at' => now()->subDays(rand(1, 30)),
                    'completed_at' => now()->subDays(rand(0, 20)),
                    'current_page' => 1,
                    'final_page' => $pagesRead,
                    'duration_minutes' => rand(30, 180),
                    'status' => 'completed',
                    'points_earned' => $poinEarned,
                ]);

                // Create point transaction
                PointTransaction::create([
                    'user_id' => $siswa->id,
                    'reading_activity_id' => ReadingActivity::where('user_id', $siswa->id)->latest()->first()?->id,
                    'points' => $poinEarned,
                    'type' => 'reading_completion',
                    'description' => "Membaca buku '{$ebook->title}'",
                ]);
            }
        }

        // ===== CREATE QUIZ QUESTIONS =====
        foreach ($ebooks as $ebook) {
            // Create 5 questions per ebook
            for ($i = 1; $i <= 5; $i++) {
                QuizQuestion::create([
                    'ebook_id' => $ebook->id,
                    'question' => "Pertanyaan {$i} tentang {$ebook->title}?",
                    'option_a' => 'Pilihan A',
                    'option_b' => 'Pilihan B',
                    'option_c' => 'Pilihan C',
                    'option_d' => 'Pilihan D',
                    'correct_answer' => ['a', 'b', 'c', 'd'][rand(0, 3)],
                ]);
            }
        }

        echo "✅ Database seeding completed successfully!\n";
        echo "📊 Created:\n";
        echo "   - 2 Admins\n";
        echo "   - 2 Gurus\n";
        echo "   - 10 Students\n";
        echo "   - 6 E-books\n";
        echo "   - 4 Rewards\n";
        echo "   - 20-40 Reading Activities\n";
        echo "   - 30 Quiz Questions\n";
        echo "\n📝 Test Credentials:\n";
        echo "   Admin: admin@readpoint.com / password123\n";
        echo "   Guru: guru.budi@school.com / password123\n";
        echo "   Siswa: rina@student.com / password123\n";
    }
}

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
