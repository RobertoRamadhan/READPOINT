'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-full border-2';
  
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'success':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'warning':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'muted':
        return 'bg-gray-50 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const classes = [
    baseClasses,
    getVariantClasses(variant),
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' | 'completed' | 'active' | 'inactive' }) {
  const statusConfig = {
    pending: { variant: 'warning' as const, text: 'Pending' },
    approved: { variant: 'success' as const, text: 'Approved' },
    rejected: { variant: 'danger' as const, text: 'Rejected' },
    completed: { variant: 'success' as const, text: 'Completed' },
    active: { variant: 'success' as const, text: 'Active' },
    inactive: { variant: 'secondary' as const, text: 'Inactive' }
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
}
