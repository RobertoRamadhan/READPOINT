<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Ebook;
use App\Models\Reward;
use App\Models\QuizAttempt;
use App\Models\ReadingActivity;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Admin Dashboard Stats
    public function adminStats()
    {
        $stats = [
            'total_siswa' => User::where('role', 'siswa')->count(),
            'total_guru' => User::where('role', 'guru')->count(),
            'total_ebook' => Ebook::count(),
            'total_reward' => Reward::count(),
            'siswa_aktif_hari_ini' => ReadingActivity::whereDate('created_at', today())->distinct('user_id')->count(),
            'buku_dibaca_hari_ini' => ReadingActivity::whereDate('created_at', today())->count(),
            'kuis_dikerjakan_hari_ini' => QuizAttempt::whereDate('created_at', today())->count(),
            'reward_diklaim_hari_ini' => DB::table('redemptions')->whereDate('created_at', today())->count(),
        ];
        return response()->json($stats);
    }

    // Admin - Top Students
    public function topStudents()
    {
        $topStudents = User::where('role', 'siswa')
            ->select('id', 'name', 'email', 'class_name')
            ->get()
            ->map(function ($user) {
                $user->total_points = DB::table('point_transactions')
                    ->where('user_id', $user->id)
                    ->sum('points');
                return $user;
            })
            ->sortByDesc('total_points')
            ->take(10);

        return response()->json($topStudents);
    }

    // Admin - All EBooks
    public function adminBooks()
    {
        $books = Ebook::paginate(10);
        return response()->json($books);
    }

    // Admin - All Rewards
    public function adminRewards()
    {
        $rewards = Reward::get(['id', 'name', 'description', 'points_required', 'stock', 'category', 'is_active']);
        return response()->json($rewards);
    }

    // Admin - All Users
    public function adminUsers($role = null)
    {
        $query = User::query();
        
        if ($role) {
            $query->where('role', $role);
        }
        
        $users = $query->paginate(10);
        return response()->json($users);
    }

    // Guru Dashboard - Stats
    public function guruStats()
    {
        $guru = auth()->user();
        $students = User::where('role', 'siswa')
            ->where(function ($q) use ($guru) {
                $q->where('class_name', $guru->class_name);
                if ($guru->grade_level) {
                    $q->where('grade_level', $guru->grade_level);
                }
            })
            ->pluck('id');

        $stats = [
            'total_siswa' => $students->count(),
            'siswa_aktif' => ReadingActivity::whereIn('user_id', $students)
                ->whereDate('created_at', today())
                ->distinct('user_id')
                ->count(),
            'rata_rata_poin' => DB::table('point_transactions')
                ->whereIn('user_id', $students)
                ->avg('points') ?? 0,
            'total_buku_selesai' => ReadingActivity::whereIn('user_id', $students)
                ->where('status', 'completed')
                ->count(),
        ];

        return response()->json($stats);
    }

    // Guru - Reading Activities Pending Validation
    public function guruValidations()
    {
        $guru = auth()->user();
        $students = User::where('role', 'siswa')
            ->where(function ($q) use ($guru) {
                $q->where('class_name', $guru->class_name);
                if ($guru->grade_level) {
                    $q->where('grade_level', $guru->grade_level);
                }
            })
            ->pluck('id');

        $activities = ReadingActivity::whereIn('user_id', $students)
            ->where('status', 'submitted')
            ->with(['user', 'ebook'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($activities);
    }

    // Guru - My Quizzes
    public function guruQuizzes()
    {
        $guru = auth()->user();
        
        $quizzes = DB::table('quiz_questions')
            ->get();

        return response()->json($quizzes);
    }

    // Guru - My Students
    public function guruStudents()
    {
        $guru = auth()->user();
        
        $students = User::where('role', 'siswa')
            ->where(function ($q) use ($guru) {
                $q->where('class_name', $guru->class_name);
                if ($guru->grade_level) {
                    $q->where('grade_level', $guru->grade_level);
                }
            })
            ->select('id', 'name', 'email', 'class_name')
            ->get();

        $students->each(function ($student) {
            $student->total_points = DB::table('point_transactions')
                ->where('user_id', $student->id)
                ->sum('points');
        });

        return response()->json($students);
    }

    // Siswa Dashboard - My Stats
    public function siswaStats()
    {
        $user = auth()->user();
        
        $stats = [
            'buku_selesai' => ReadingActivity::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count(),
            'halaman_dibaca' => ReadingActivity::where('user_id', $user->id)
                ->sum('pages_read') ?? 0,
            'kuis_diikuti' => QuizAttempt::where('user_id', $user->id)->count(),
            'total_poin' => DB::table('point_transactions')
                ->where('user_id', $user->id)
                ->sum('points') ?? 0,
        ];

        return response()->json($stats);
    }

    // Siswa - My Recent Activities
    public function siswaRecentActivities()
    {
        $user = auth()->user();
        
        $activities = ReadingActivity::where('user_id', $user->id)
            ->with('ebook')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($activities);
    }

    // Siswa - My Quiz Attempts
    public function siswaQuizAttempts()
    {
        $user = auth()->user();
        
        $attempts = QuizAttempt::where('user_id', $user->id)
            ->with('ebook')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attempts);
    }

    // Siswa - My Rewards
    public function siswaRewards()
    {
        $rewards = Reward::where('is_active', true)
            ->get(['id', 'name', 'description', 'points_required', 'stock', 'category']);

        return response()->json($rewards);
    }
}
