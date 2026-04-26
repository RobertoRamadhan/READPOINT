'use client';

import React from 'react';
import { Badge } from '@/components/shared';

interface HistoryTabsProps {
  activeTab: 'points' | 'quiz' | 'activity';
  onTabChange: (tab: 'points' | 'quiz' | 'activity') => void;
  counts: {
    points: number;
    quiz: number;
    activity: number;
  };
}

export default function HistoryTabs({ 
  activeTab, 
  onTabChange, 
  counts 
}: HistoryTabsProps) {
  const tabs = [
    {
      id: 'points' as const,
      label: '💰 Points History',
      icon: '💰',
      count: counts.points
    },
    {
      id: 'quiz' as const,
      label: '📝 Quiz History',
      icon: '📝',
      count: counts.quiz
    },
    {
      id: 'activity' as const,
      label: '📚 Reading Activity',
      icon: '📚',
      count: counts.activity
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.count > 0 && (
            <Badge variant={activeTab === tab.id ? 'secondary' : 'primary'} size="sm">
              {tab.count}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}
