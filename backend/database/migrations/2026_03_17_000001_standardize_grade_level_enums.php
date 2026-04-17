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
        // Update users table: change enum from 'sd', 'smp' to '1', '2', '3' (SMK grades)
        DB::statement("ALTER TABLE users MODIFY grade_level ENUM('1', '2', '3') NULLABLE");
        
        // Update ebooks table: ensure it supports SMK grades 1, 2, 3
        DB::statement("ALTER TABLE ebooks MODIFY grade_level ENUM('1', '2', '3', 'all') DEFAULT 'all'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enums
        DB::statement("ALTER TABLE users MODIFY grade_level ENUM('sd', 'smp') NULLABLE");
        DB::statement("ALTER TABLE ebooks MODIFY grade_level ENUM('sd', 'smp') DEFAULT 'smp'");
    }
};
