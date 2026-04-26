'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  className?: string;
}

export default function InfiniteScroll({ 
  children, 
  hasMore, 
  isLoading, 
  onLoadMore, 
  threshold = 100,
  className = ''
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      setIsIntersecting(true);
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: `${threshold}px`
    });

    if (triggerRef.current) {
      observerRef.current.observe(triggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className={className}>
      {children}
      {hasMore && (
        <div ref={triggerRef} className="flex justify-center py-4">
          {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-gray-600 font-semibold">Memuat lebih banyak...</span>
              </div>
          ) : (
            <div className="text-sm text-gray-500 font-semibold">
              Scroll untuk lebih banyak
            </div>
          )}
        </div>
      )}
    </div>
  );
}
