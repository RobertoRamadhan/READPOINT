'use client';

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`inline-block border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin ${sizeClasses[size]}`}></div>
        {text && (
          <p className="mt-4 text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      ))}
      <div className="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="lg" text="Memuat..." />
    </div>
  );
}
