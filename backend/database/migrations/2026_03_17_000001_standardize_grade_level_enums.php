<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Standardize grade_level enums to use SMK format (1, 2, 3)
     */
    public function up(): void
    {
        // For SQLite, ENUM doesn't exist - just ensure the columns are there
        // For MySQL, this would modify the enum values
        // Since the columns already exist from previous migrations, we just need to update any existing data if needed
        // This migration is mainly for documentation and MySQL compatibility
        
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY grade_level ENUM('1', '2', '3') NULLABLE");
            DB::statement("ALTER TABLE ebooks MODIFY grade_level ENUM('1', '2', '3', 'all') DEFAULT 'all'");
        }
        // SQLite: no action needed - columns were created with TEXT type which works for any values
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enums (only for MySQL)
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE users MODIFY grade_level ENUM('sd', 'smp') NULLABLE");
            DB::statement("ALTER TABLE ebooks MODIFY grade_level ENUM('sd', 'smp') DEFAULT 'smp'");
        }
        // SQLite: no action needed
    }
};
