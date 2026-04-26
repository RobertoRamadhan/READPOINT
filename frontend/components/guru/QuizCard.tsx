'use client';

import React from 'react';
import { GenericCard, Button } from '@/components/shared';
import type { CardAction, CardData } from '@/components/shared/GenericCard';
import { getDifficultyVariant } from '@/lib/utils';

interface Quiz {
  id: number;
  ebook_id: number;
  ebook_title?: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points_reward: number;
  time_limit_minutes: number;
  passing_score: number;
  total_questions: number;
  created_at: string;
  is_active: boolean;
}

interface QuizCardProps {
  quiz: Quiz;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: number) => void;
  onViewResults: (quizId: number) => void;
  onToggleStatus: (quizId: number, active: boolean) => void;
  loading?: boolean;
}

export default function QuizCard({
  quiz,
  onEdit,
  onDelete,
  onViewResults,
  onToggleStatus,
  loading = false
}: QuizCardProps) {
  const cardData: CardData = {
    title: quiz.title,
    subtitle: quiz.ebook_title || 'No Book',
    description: quiz.description,
    status: quiz.is_active ? 'Active' : 'Inactive',
    statusVariant: quiz.is_active ? 'success' : 'secondary',
    metadata: [
      { label: 'Difficulty', value: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1), icon: '📊' },
      { label: 'Questions', value: quiz.total_questions, icon: '❓' },
      { label: 'Passing Score', value: `${quiz.passing_score}%`, icon: '🎯' },
      { label: 'Time Limit', value: `${quiz.time_limit_minutes} minutes`, icon: '⏱️' },
      { label: 'Created', value: new Date(quiz.created_at).toLocaleDateString(), icon: '📅' }
    ],
    stats: [
      { label: 'Points Reward', value: quiz.points_reward, color: 'var(--primary-600)' },
      { label: 'Time Limit', value: `${quiz.time_limit_minutes}m`, color: 'var(--primary-600)' }
    ]
  };

  const actions: CardAction[] = [
    { label: 'Edit', onClick: () => onEdit(quiz), variant: 'outline', disabled: loading },
    { label: 'Results', onClick: () => onViewResults(quiz.id), variant: 'outline', disabled: loading },
    { label: quiz.is_active ? 'Deactivate' : 'Activate', onClick: () => onToggleStatus(quiz.id, !quiz.is_active), variant: 'outline', disabled: loading },
    { label: 'Delete', onClick: () => onDelete(quiz.id), variant: 'danger', disabled: loading }
  ];

  return (
    <GenericCard
      data={cardData}
      actions={actions}
      hover
      loading={loading}
    />
  );
}
