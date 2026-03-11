<?php

namespace App\Http\Controllers\Api;

use App\Models\ReadingActivity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReadingActivityController extends Controller
{
    // Mulai membaca buku
    public function startReading(Request $request)
    {
        $validated = $request->validate([
            'ebook_id' => 'required|exists:ebooks,id',
        ]);

        $activity = ReadingActivity::create([
            'user_id' => $request->user()->id,
            'ebook_id' => $validated['ebook_id'],
            'started_at' => now(),
            'current_page' => 1,
            'duration_minutes' => 0,
            'status' => 'ongoing',
        ]);

        return response()->json([
            'message' => 'Reading session started',
            'data' => $activity,
        ], 201);
    }

    // Update progress membaca
    public function updateProgress(Request $request, $activityId)
    {
        $validated = $request->validate([
            'current_page' => 'required|integer|min:1',
            'duration_minutes' => 'required|integer|min:0',
        ]);

        $activity = ReadingActivity::where('id', $activityId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $activity->update([
            'current_page' => $validated['current_page'],
            'duration_minutes' => $validated['duration_minutes'],
        ]);

        return response()->json([
            'message' => 'Progress updated',
            'data' => $activity,
        ]);
    }

    // Selesai membaca (submit untuk validasi)
    public function completeReading(Request $request, $activityId)
    {
        $validated = $request->validate([
            'final_page' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $activity = ReadingActivity::where('id', $activityId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $ebook = $activity->ebook;
        
        // Set status pending validasi
        $activity->update([
            'final_page' => $validated['final_page'],
            'notes' => $validated['notes'] ?? null,
            'completed_at' => now(),
            'status' => 'pending_validation',
        ]);

        return response()->json([
            'message' => 'Reading activity submitted for validation',
            'data' => $activity,
            'required_quiz' => true, // Siswa perlu mengerjakan quiz untuk validasi
        ]);
    }

    // Get aktivitas membaca siswa
    public function getMyActivities(Request $request)
    {
        $activities = ReadingActivity::where('user_id', $request->user()->id)
            ->with('ebook')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $activities,
        ]);
    }

    // Get aktivitas membaca by ID
    public function getActivity(Request $request, $activityId)
    {
        $activity = ReadingActivity::where('id', $activityId)
            ->where('user_id', $request->user()->id)
            ->with('ebook')
            ->firstOrFail();

        return response()->json([
            'data' => $activity,
        ]);
    }
}
