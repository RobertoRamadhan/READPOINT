'use client';

import React from 'react';
import { Badge } from '@/components/shared';

interface TabNavigationProps {
  activeTab: 'overview' | 'ebooks' | 'rewards' | 'quizzes';
  onTabChange: (tab: 'overview' | 'ebooks' | 'rewards' | 'quizzes') => void;
  ebooksCount: number;
  rewardsCount: number;
  quizzesCount: number;
  isMobile?: boolean;
}

export default function TabNavigation({ 
  activeTab, 
  onTabChange, 
  ebooksCount, 
  rewardsCount,
  quizzesCount,
  isMobile = false 
}: TabNavigationProps) {
  const tabs = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: '📊'
    },
    {
      id: 'ebooks' as const,
      label: 'E-Books',
      icon: '📚',
      count: ebooksCount
    },
    {
      id: 'quizzes' as const,
      label: 'Kuis',
      icon: '❓',
      count: quizzesCount
    },
    {
      id: 'rewards' as const,
      label: 'Rewards',
      icon: '🎁',
      count: rewardsCount
    }
  ];

  return (
    <nav className="flex items-center justify-center gap-2 md:gap-4 animate-fade-in w-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-3 py-2 md:px-5 md:py-3 text-xs md:text-sm lg:text-base font-bold transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 border transform hover:scale-105 hover:-translate-y-0.5 ${
            activeTab === tab.id
              ? 'bg-amber-700 text-white shadow-md border-amber-800 hover:shadow-lg hover:bg-amber-800'
              : 'bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-600 hover:text-amber-800 hover:bg-amber-200'
          }`}
        >
          <span className="text-base md:text-lg lg:text-xl">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
          {tab.count !== undefined && (
            <Badge variant="secondary" size="sm">
              {tab.count}
            </Badge>
          )}
        </button>
      ))}
    </nav>
  );
}

function MobileTabNavigation({ 
  activeTab, 
  onTabChange, 
  tabs 
}: { 
  activeTab: string; 
  onTabChange: (tab: any) => void; 
  tabs: any[];
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg flex items-center justify-between font-bold text-slate-900 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
      >
        <span className="flex items-center gap-3 text-lg">
          <span>{currentTab?.icon}</span>
          <span className="text-base">{currentTab?.label}</span>
        </span>
        <span className={`transform transition-transform text-sm ${menuOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {menuOpen && (
        <div className="mt-2 bg-white border border-slate-300 rounded-lg overflow-hidden shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setMenuOpen(false);
              }}
              className={`w-full py-3 px-4 text-left font-bold transition-all flex items-center justify-between border-t border-slate-200 first:border-t-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              {tab.count !== undefined && (
                <Badge variant="secondary" size="sm">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
