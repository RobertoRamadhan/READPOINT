'use client';

import React from 'react';
import { Button } from '@/components/shared';

interface QuizFiltersProps {
  activeFilter: 'all' | 'active' | 'inactive';
  onFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddQuiz: () => void;
}

export default function QuizFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onAddQuiz
}: QuizFiltersProps) {
  const filters = [
    { key: 'all' as const, label: 'Semua Quiz' },
    { key: 'active' as const, label: 'Aktif' },
    { key: 'inactive' as const, label: 'Tidak Aktif' }
  ];

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berdasarkan judul quiz atau e-book..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-semibold text-gray-900"
            />
            <div className="absolute left-4 top-3.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              variant={activeFilter === filter.key ? 'primary' : 'outline'}
              size="sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Add Quiz Button */}
        <Button
          onClick={onAddQuiz}
          variant="success"
          size="sm"
        >
          ➕ Buat Quiz
        </Button>
      </div>
    </div>
  );
}
