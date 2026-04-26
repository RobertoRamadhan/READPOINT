'use client';

import React from 'react';
import { Card, Button, Badge } from '@/components/shared';

export interface CardAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface CardData {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  status?: string;
  statusVariant?: 'primary' | 'secondary' | 'success' | 'danger';
  metadata?: Array<{
    label: string;
    value: string | number;
    icon?: string;
  }>;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

interface GenericCardProps {
  data: CardData;
  actions?: CardAction[];
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  hover?: boolean;
  loading?: boolean;
  className?: string;
  renderHeader?: (data: CardData) => React.ReactNode;
  renderContent?: (data: CardData) => React.ReactNode;
  renderFooter?: (data: CardData, actions: CardAction[]) => React.ReactNode;
}

export default function GenericCard({
  data,
  actions = [],
  variant = 'default',
  hover = false,
  loading = false,
  className = '',
  renderHeader,
  renderContent,
  renderFooter
}: GenericCardProps) {
  const defaultHeader = (cardData: CardData) => (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{cardData.title}</h3>
        {cardData.subtitle && (
          <p className="text-sm text-gray-600 font-medium">{cardData.subtitle}</p>
        )}
      </div>
      {cardData.status && (
        <Badge variant={cardData.statusVariant || 'primary'} size="sm">
          {cardData.status}
        </Badge>
      )}
    </div>
  );

  const defaultContent = (cardData: CardData) => (
    <div className="space-y-4">
      {cardData.description && (
        <p className="text-gray-700 text-sm font-medium line-clamp-3">
          {cardData.description}
        </p>
      )}
      
      {cardData.metadata && cardData.metadata.length > 0 && (
        <div className="space-y-2">
          {cardData.metadata.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
              <span className="text-gray-900 font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {cardData.stats && cardData.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {cardData.stats.map((stat, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold" style={{ color: stat.color || 'var(--primary-600)' }}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const defaultFooter = (cardData: CardData, cardActions: CardAction[]) => (
    <div className="flex gap-2 pt-4 border-t border-gray-200">
      {cardActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'secondary'}
          size="sm"
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          loading={action.loading}
          className="flex-1"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );

  return (
    <Card variant={variant} hover={hover} className={className}>
      <div className="space-y-4">
        {/* Header */}
        {renderHeader ? renderHeader(data) : defaultHeader(data)}
        
        {/* Content */}
        <div className="min-h-[100px]">
          {renderContent ? renderContent(data) : defaultContent(data)}
        </div>
        
        {/* Footer */}
        {actions.length > 0 && (
          renderFooter ? renderFooter(data, actions) : defaultFooter(data, actions)
        )}
      </div>
    </Card>
  );
}
