"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useOnlineStatus } from "./use-online-status";

export interface QueuedAction {
  id: string;
  action: () => Promise<void>;
  timestamp: number;
  retries: number;
  maxRetries?: number;
}

const SYNC_QUEUE_KEY = "capybook_sync_queue";
const MAX_RETRIES = 3;

/**
 * Hook to manage a queue of actions that need to be synced when online
 * Actions are stored in localStorage and automatically retried when connection is restored
 */
export function useSyncQueue() {
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useOnlineStatus();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load queue from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only restore metadata, not the actual functions
        setQueue(parsed.map((item: Omit<QueuedAction, "action">) => ({
          ...item,
          action: async () => {
            console.warn("Queued action restored but action function not available");
          },
        })));
      }
    } catch (error) {
      console.error("Failed to load sync queue:", error);
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    try {
      const serializable = queue.map(({ id, timestamp, retries, maxRetries }) => ({
        id,
        timestamp,
        retries,
        maxRetries,
      }));
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error("Failed to save sync queue:", error);
    }
  }, [queue]);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      // Small delay to ensure network is stable
      syncTimeoutRef.current = setTimeout(() => {
        processQueue();
      }, 1000);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isOnline, queue.length, isSyncing]);

  const processQueue = useCallback(async () => {
    if (queue.length === 0 || isSyncing || !isOnline) return;

    setIsSyncing(true);

    const remaining: QueuedAction[] = [];

    for (const item of queue) {
      try {
        await item.action();
        // Success - remove from queue
      } catch (error) {
        console.error(`Failed to sync action ${item.id}:`, error);

        // Increment retries
        const newRetries = item.retries + 1;
        const maxRetries = item.maxRetries ?? MAX_RETRIES;

        if (newRetries < maxRetries) {
          // Retry later
          remaining.push({
            ...item,
            retries: newRetries,
          });
        } else {
          // Max retries reached - remove from queue
          console.warn(`Action ${item.id} exceeded max retries, removing from queue`);
        }
      }
    }

    setQueue(remaining);
    setIsSyncing(false);
  }, [queue, isOnline, isSyncing]);

  const addToQueue = useCallback(
    (action: () => Promise<void>, options?: { maxRetries?: number }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newItem: QueuedAction = {
        id,
        action,
        timestamp: Date.now(),
        retries: 0,
        maxRetries: options?.maxRetries ?? MAX_RETRIES,
      };

      setQueue((prev) => [...prev, newItem]);

      // If online, try to process immediately
      if (isOnline && !isSyncing) {
        setTimeout(() => processQueue(), 100);
      }

      return id;
    },
    [isOnline, isSyncing, processQueue]
  );

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    try {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (error) {
      console.error("Failed to clear sync queue from localStorage:", error);
    }
  }, []);

  return {
    queue,
    isSyncing,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processQueue,
    queueLength: queue.length,
  };
}
