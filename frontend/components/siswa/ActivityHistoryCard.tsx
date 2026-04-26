'use client';

import React from 'react';
import { Card, Badge, Button } from '@/components/shared';
import { getStatusIcon, getStatusVariant } from '@/lib/utils';

interface ReadingActivity {
  id: number;
  ebook_id: number;
  ebook_title: string;
  ebook_author: string;
  pages_read: number;
  total_pages: number;
  reading_time_minutes: number;
  points_earned: number;
  status: 'in_progress' | 'completed' | 'validated';
  started_at: string;
  completed_at?: string;
  validated_at?: string;
}

interface ActivityHistoryCardProps {
  activity: ReadingActivity;
  onViewDetails?: (activityId: number) => void;
  onContinueReading?: (ebookId: number) => void;
}

export default function ActivityHistoryCard({ 
  activity, 
  onViewDetails, 
  onContinueReading 
}: ActivityHistoryCardProps) {
  const progress = Math.round((activity.pages_read / activity.total_pages) * 100);
  const statusColor = activity.status === 'completed' ? 'text-green-600' : 
                     activity.status === 'validated' ? 'text-blue-600' : 'text-yellow-600';

  return (
    <Card hover className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-black text-gray-900 text-lg line-clamp-2">{activity.ebook_title}</h3>
              <Badge variant={getStatusVariant(activity.status)}>
                {getStatusIcon(activity.status)} {activity.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 font-semibold">by {activity.ebook_author}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-blue-600">{progress}%</p>
            <p className="text-xs text-gray-500 font-semibold">Progress</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 font-bold mb-1">📄 Pages</p>
            <p className="font-black text-gray-900 text-lg">{activity.pages_read}/{activity.total_pages}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 font-bold mb-1">⏱️ Time</p>
            <p className="font-black text-gray-900 text-lg">{activity.reading_time_minutes}m</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-800 font-bold mb-1">💰 Points</p>
            <p className="font-black text-blue-700 text-lg">+{activity.points_earned}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 font-bold mb-1">📊 Speed</p>
            <p className="font-black text-gray-900 text-lg">
              {activity.reading_time_minutes > 0 ? Math.round(activity.pages_read / activity.reading_time_minutes * 60) : 0}
              <span className="text-xs">p/h</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600 font-bold">Reading Progress</p>
            <p className="text-xs text-gray-600 font-bold">{progress}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>📅 Started:</span>
            <span className="font-semibold">{new Date(activity.started_at).toLocaleString('id-ID')}</span>
          </div>
          {activity.completed_at && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>✅ Completed:</span>
              <span className="font-semibold">{new Date(activity.completed_at).toLocaleString('id-ID')}</span>
            </div>
          )}
          {activity.validated_at && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <span>🎉 Validated:</span>
              <span className="font-semibold">{new Date(activity.validated_at).toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(activity.id)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              📋 Details
            </Button>
          )}
          
          {onContinueReading && activity.status === 'in_progress' && (
            <Button
              onClick={() => onContinueReading(activity.ebook_id)}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              📖 Continue
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
