"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Hook to track online/offline status
 * Returns a boolean indicating if the user is online
 * Automatically subscribes to navigator.onLine events
 *
 * Note: Starts with optimistic assumption (true) to avoid false offline
 * detection on initial load, especially with service workers
 */
export function useOnlineStatus(): boolean {
  // Start with true to avoid false offline detection on initial load
  // This is especially important with service workers that might
  // cause navigator.onLine to be unreliable during hydration
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const isMountedRef = useRef(false);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Initial check after mount - wait a bit for service worker to stabilize
    const initialCheck = () => {
      // Use navigator.onLine but be optimistic
      // If navigator says offline, we'll verify it's not a false positive
      const navigatorOnline = navigator.onLine;

      if (navigatorOnline) {
        setIsOnline(true);
      } else {
        // Navigator says offline - but this might be a false positive
        // especially during navigation with service workers
        // Wait a moment and check again
        if (checkTimeoutRef.current) {
          clearTimeout(checkTimeoutRef.current);
        }
        checkTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setIsOnline(navigator.onLine);
          }
        }, 500);
      }
    };

    // Small delay to let service worker and navigation settle
    const initTimeout = setTimeout(initialCheck, 100);

    const handleOnline = () => {
      setIsOnline(true);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };

    const handleOffline = () => {
      // Only set offline if we're sure - navigator.offline is more reliable
      setIsOnline(false);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodic check to catch cases where events don't fire
    // But be conservative - only set offline if navigator consistently says so
    const checkOnline = () => {
      const navigatorOnline = navigator.onLine;
      setIsOnline(navigatorOnline);
    };

    const interval = setInterval(checkOnline, 5000);

    return () => {
      isMountedRef.current = false;
      clearTimeout(initTimeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

  return isOnline;
}

/**
 * Hook that provides both online status and a callback to manually check
 */
export function useOnlineStatusWithCheck(): {
  isOnline: boolean;
  checkOnline: () => boolean;
} {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });

  const checkOnline = useCallback(() => {
    const online = navigator.onLine;
    setIsOnline(online);
    return online;
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, checkOnline };
}
