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
            ->select('id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer')
            ->limit(5)
            ->get();

        // Map 'question' to 'question_text' for frontend compatibility
        $formattedQuestions = $questions->map(function($q) {
            return [
                'id' => $q->id,
                'question_text' => $q->question,
                'option_a' => $q->option_a,
                'option_b' => $q->option_b,
                'option_c' => $q->option_c,
                'option_d' => $q->option_d,
                'correct_answer' => $q->correct_answer,
            ];
        });

        return response()->json([
            'data' => $formattedQuestions,
            'total_questions' => count($formattedQuestions),
        ]);
    }

    // Submit jawaban kuis
    public function submitQuiz(Request $request)
    {
        $validated = $request->validate([
            'ebook_id' => 'required|exists:ebooks,id',
            'answers' => 'required|array',
            'answers.*' => 'required|in:a,b,c,d',
            'score' => 'nullable|numeric|min:0|max:100',
        ]);

        $ebook = \App\Models\Ebook::findOrFail($validated['ebook_id']);
        $user = $request->user();
        
        // Get all questions for this ebook
        $questions = QuizQuestion::where('ebook_id', $ebook->id)->orderBy('id')->limit(5)->get();
        
        $correctAnswers = 0;
        $totalQuestions = count($questions);
        
        // Hitung jawaban yang benar - answers array uses question ID as key
        foreach ($questions as $question) {
            $submittedAnswer = $validated['answers'][$question->id] ?? null;
            if ($submittedAnswer && strtolower($submittedAnswer[0]) === $question->correct_answer) {
                $correctAnswers++;
            }
        }

        $score = $totalQuestions > 0 ? ($correctAnswers / $totalQuestions) * 100 : 0;
        $passed = $score >= 70; // 70% adalah passing grade

        // Record quiz attempt
        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'ebook_id' => $ebook->id,
            'reading_activity_id' => null, // Optional
            'total_questions' => $totalQuestions,
            'correct_answers' => $correctAnswers,
            'score' => $score,
            'passed' => $passed,
        ]);

        // Award points regardless of pass/fail for frontend quiz purposes
        // Points are based on questions answered correctly
        $pointsEarned = $correctAnswers * 10; // 10 points per correct answer

        // Create point transaction
        PointTransaction::create([
            'user_id' => $user->id,
            'reading_activity_id' => null,
            'points' => $pointsEarned,
            'type' => 'quiz_completed',
            'description' => "Poin dari mengerjakan kuis '{$ebook->title}' ({$correctAnswers}/{$totalQuestions} benar)",
        ]);

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'quiz_attempt' => $attempt,
            'points_earned' => $pointsEarned,
            'score' => round($score, 2),
            'passed' => $passed,
        ], 200);
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
