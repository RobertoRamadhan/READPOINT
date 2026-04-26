'use client';

import React from 'react';
import { Card } from '@/components/shared';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  color = 'blue', 
  loading = false 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    red: 'from-red-400 to-red-600',
    purple: 'from-purple-400 to-purple-600',
    yellow: 'from-yellow-400 to-yellow-600'
  };

  const changeColorClasses = {
    increase: 'text-green-600',
    decrease: 'text-red-600'
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-lg`}>
            {icon}
          </div>
        </div>
        
        <div className="mb-2">
          <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
        
        {change && (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${changeColorClasses[change.type]}`}>
              {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
            </span>
            <span className="text-xs text-gray-500">{change.period}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
