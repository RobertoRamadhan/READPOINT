'use client';

import React from 'react';
import { Card, Badge } from '@/components/shared';
import { getTypeIcon, getTypeColor, getTypeBadge } from '@/lib/utils';

interface PointTransaction {
  id: number;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  description: string;
  source: string;
  created_at: string;
  balance_after: number;
}

interface PointHistoryCardProps {
  transaction: PointTransaction;
}

export default function PointHistoryCard({ transaction }: PointHistoryCardProps) {

  return (
    <Card hover className="overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTypeColor(transaction.type)} flex items-center justify-center text-white font-bold text-lg`}>
              {getTypeIcon(transaction.type)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-gray-900">{transaction.description}</h3>
                <Badge variant={getTypeBadge(transaction.type)}>
                  {transaction.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 font-semibold">{transaction.source}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-black ${
              transaction.type === 'spent' || transaction.type === 'penalty' 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {transaction.type === 'spent' || transaction.type === 'penalty' ? '-' : '+'}
              {transaction.amount} pts
            </p>
            <p className="text-xs text-gray-500 font-semibold">
              Balance: {transaction.balance_after}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500 font-semibold">
          {new Date(transaction.created_at).toLocaleString('id-ID')}
        </div>
      </div>
    </Card>
  );
}
