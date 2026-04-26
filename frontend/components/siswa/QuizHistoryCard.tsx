'use client';

import React from 'react';
import { Card, Badge, Button } from '@/components/shared';

interface QuizAttempt {
  id: number;
  quiz_id: number;
  quiz_title: string;
  ebook_title: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_minutes: number;
  passed: boolean;
  points_earned: number;
  created_at: string;
}

interface QuizHistoryCardProps {
  attempt: QuizAttempt;
  onViewDetails?: (attemptId: number) => void;
  onRetakeQuiz?: (quizId: number) => void;
}

export default function QuizHistoryCard({ 
  attempt, 
  onViewDetails, 
  onRetakeQuiz 
}: QuizHistoryCardProps) {
  const accuracy = Math.round((attempt.correct_answers / attempt.total_questions) * 100);
  const scoreColor = attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card hover className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-black text-gray-900 text-lg">{attempt.quiz_title}</h3>
              <Badge variant={attempt.passed ? 'success' : 'danger'}>
                {attempt.passed ? 'Passed' : 'Failed'}
              </Badge>
            </div>
            <p className="text-sm text-blue-700 font-bold">📚 {attempt.ebook_title}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-black ${scoreColor}`}>{attempt.score}%</p>
            <p className="text-xs text-gray-500 font-semibold">Score</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 font-bold mb-1">✅ Correct</p>
            <p className="font-black text-gray-900 text-lg">{attempt.correct_answers}/{attempt.total_questions}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 font-bold mb-1">🎯 Accuracy</p>
            <p className="font-black text-gray-900 text-lg">{accuracy}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 font-bold mb-1">⏱️ Time</p>
            <p className="font-black text-gray-900 text-lg">{attempt.time_taken_minutes}m</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
            <p className="text-xs text-green-800 font-bold mb-1">💰 Points</p>
            <p className="font-black text-green-700 text-lg">+{attempt.points_earned}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600 font-bold">Progress</p>
            <p className="text-xs text-gray-600 font-bold">{accuracy}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 transition-all duration-300 ${
                attempt.score >= 80 ? 'bg-green-500' : 
                attempt.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500 font-semibold mb-4">
          Completed: {new Date(attempt.created_at).toLocaleString('id-ID')}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(attempt.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              📋 Details
            </Button>
          )}
          
          {onRetakeQuiz && !attempt.passed && (
            <Button
              onClick={() => onRetakeQuiz(attempt.quiz_id)}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              🔄 Retake
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
