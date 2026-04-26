'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  border = true,
  shadow = 'md',
  variant = 'default',
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl'
  };

  const variantClasses = {
    default: baseClasses,
    elevated: 'bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
    outlined: 'bg-transparent border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200',
    filled: 'bg-gray-50 border border-transparent rounded-lg hover:bg-gray-100 transition-all duration-200'
  };

  const classes = [
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    border ? 'border border-gray-200' : '',
    hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mt-4 pt-4 border-t-2 border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
