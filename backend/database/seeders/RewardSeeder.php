<?php

namespace Database\Seeders;

use App\Models\Reward;
use Illuminate\Database\Seeder;

class RewardSeeder extends Seeder
{
    /**
     * Seed the rewards table.
     */
    public function run(): void
    {
        // Prevent duplicate seeding
        if (Reward::count() > 0) {
            echo "Rewards table already seeded, skipping...\n";
            return;
        }

        $rewards = [
            [
                'name' => 'Buku Tulis Premium',
                'description' => 'Buku tulis berkualitas tinggi dengan sampul mewah',
                'points_required' => 100,
                'quantity_available' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Pensil Set Warna',
                'description' => 'Set pensil warna 24 warna profesional',
                'points_required' => 150,
                'quantity_available' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Kumcer Eksklusif',
                'description' => 'Kumcer branded dengan logo READPOINT',
                'points_required' => 200,
                'quantity_available' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Voucher Tokopedia Rp 50.000',
                'description' => 'Voucher belanja Tokopedia senilai Rp 50.000',
                'points_required' => 250,
                'quantity_available' => 100,
                'is_active' => true,
            ],
        ];

        foreach ($rewards as $reward) {
            Reward::create($reward);
        }

        echo "Rewards seeded successfully!\n";
    }
}
