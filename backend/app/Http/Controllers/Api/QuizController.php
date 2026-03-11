<?php

namespace App\Http\Controllers\Api;

use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\PointTransaction;
use App\Models\Validation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class QuizController extends Controller
{
    // Get quiz untuk validasi membaca
    public function getQuizForBook(Request $request, $ebookId)
    {
        $questions = QuizQuestion::where('ebook_id', $ebookId)
            ->select('id', 'question', 'option_a', 'option_b', 'option_c', 'option_d')
            ->limit(5)
            ->get();

        return response()->json([
            'data' => $questions,
            'total_questions' => count($questions),
        ]);
    }

    // Submit jawaban kuis
    public function submitQuiz(Request $request)
    {
        $validated = $request->validate([
            'reading_activity_id' => 'required|exists:reading_activities,id',
            'answers' => 'required|array',
            'answers.*' => 'required|in:a,b,c,d',
        ]);

        $readingActivity = \App\Models\ReadingActivity::findOrFail($validated['reading_activity_id']);
        
        // Verify ownership
        if ($readingActivity->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ebook = $readingActivity->ebook;
        $questions = QuizQuestion::where('ebook_id', $ebook->id)->limit(5)->get();
        
        $correctAnswers = 0;
        
        // Hitung jawaban yang benar
        foreach ($questions as $index => $question) {
            $submittedAnswer = $validated['answers'][$index] ?? null;
            if ($submittedAnswer === $question->correct_answer) {
                $correctAnswers++;
            }
        }

        $score = count($questions) > 0 ? ($correctAnswers / count($questions)) * 100 : 0;
        $passed = $score >= 70; // 70% adalah passing grade

        // Record quiz attempt
        $attempt = QuizAttempt::create([
            'user_id' => $request->user()->id,
            'ebook_id' => $ebook->id,
            'reading_activity_id' => $readingActivity->id,
            'total_questions' => count($questions),
            'correct_answers' => $correctAnswers,
            'score' => $score,
            'passed' => $passed,
        ]);

        if ($passed) {
            // Hitung poin: (halaman dibaca) × (poin per halaman dari ebook)
            $pagesRead = $readingActivity->final_page - $readingActivity->current_page + 1;
            $pointsEarned = $pagesRead * ($ebook->poin_per_halaman ?? 5);

            // Create point transaction
            PointTransaction::create([
                'user_id' => $request->user()->id,
                'reading_activity_id' => $readingActivity->id,
                'points' => $pointsEarned,
                'type' => 'reading_validation',
                'description' => "Bonus poin dari membaca '{$ebook->title}' ({$pagesRead} halaman)",
            ]);

            // Update reading activity status
            $readingActivity->update([
                'status' => 'completed',
                'points_earned' => $pointsEarned,
            ]);

            // Create validation record
            Validation::create([
                'reading_activity_id' => $readingActivity->id,
                'validated_by' => null, // Otomatis tervalidasi via quiz
                'status' => 'approved',
                'validated_at' => now(),
                'notes' => 'Otomatis tervalidasi melalui kuis dengan skor ' . round($score, 2) . '%',
            ]);

            return response()->json([
                'message' => 'Quiz passed! Points awarded.',
                'quiz_attempt' => $attempt,
                'points_earned' => $pointsEarned,
                'reading_activity_updated' => true,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Quiz score below 70%. Please try again.',
                'quiz_attempt' => $attempt,
                'can_retry' => true,
            ], 200);
        }
    }

    // Get quiz attempts siswa
    public function getMyAttempts(Request $request)
    {
        $attempts = QuizAttempt::where('user_id', $request->user()->id)
            ->with('ebook', 'readingActivity')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $attempts,
        ]);
    }
}
