'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private static instance: CacheManager;

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, data: T, ttlMs: number = 300000): void { // Default 5 minutes
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { data, timestamp: Date.now(), expiry });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

export const cacheManager = CacheManager.getInstance();

// React hook for caching
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Try to get from cache first
      const cachedData = cacheManager.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        cacheManager.set(key, result, ttlMs);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetcher, ttlMs]);

  const invalidate = useCallback(() => {
    cacheManager.invalidate(key);
    setData(null);
  }, [key]);

  return { data, loading, error, invalidate };
}
