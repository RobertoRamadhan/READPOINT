'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200';
      case 'outline':
        return 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200';
      case 'ghost':
        return 'bg-transparent text-gray-600 hover:bg-gray-100 transition-all duration-200';
      case 'muted':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200';
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = [
    baseClasses,
    getVariantClasses(variant),
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
