"use client";

import { useState, useEffect, useCallback } from "react";
import { useOnlineStatus } from "./use-online-status";

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
}

/**
 * Hook to fetch and cache data with offline support
 * Returns cached data when offline and refetches when online
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isOnline = useOnlineStatus();

  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

  const getCacheKey = (key: string) => `capybook_cache_${key}`;
  const getTimestampKey = (key: string) => `capybook_cache_ts_${key}`;

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(key));
      const timestamp = localStorage.getItem(getTimestampKey(key));

      if (!cached || !timestamp) return null;

      const age = Date.now() - parseInt(timestamp, 10);
      if (age > ttl) {
        // Cache expired
        localStorage.removeItem(getCacheKey(key));
        localStorage.removeItem(getTimestampKey(key));
        return null;
      }

      return JSON.parse(cached) as T;
    } catch (error) {
      console.error(`Failed to get cached data for ${key}:`, error);
      return null;
    }
  }, [key, ttl]);

  const setCachedData = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(getCacheKey(key), JSON.stringify(value));
        localStorage.setItem(getTimestampKey(key), Date.now().toString());
      } catch (error) {
        console.error(`Failed to cache data for ${key}:`, error);
      }
    },
    [key]
  );

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(getCacheKey(key));
      localStorage.removeItem(getTimestampKey(key));
      setData(null);
    } catch (error) {
      console.error(`Failed to clear cache for ${key}:`, error);
    }
  }, [key]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Try to get cached data first
    const cached = getCachedData();
    if (cached && !isOnline) {
      // Offline - use cache
      setData(cached);
      setIsLoading(false);
      return;
    }

    if (cached && staleWhileRevalidate) {
      // Show cached data immediately
      setData(cached);
    }

    try {
      const result = await fetcher();
      setData(result);
      setCachedData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      setError(error);

      // If we have cached data, use it as fallback
      const cached = getCachedData();
      if (cached) {
        setData(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, isOnline, getCachedData, setCachedData, staleWhileRevalidate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch when coming back online
  useEffect(() => {
    if (isOnline && data) {
      // Revalidate stale data
      fetchData();
    }
  }, [isOnline]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    clearCache,
  };
}
