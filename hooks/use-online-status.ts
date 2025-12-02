"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hook to track online/offline status
 * Returns a boolean indicating if the user is online
 * Automatically subscribes to navigator.onLine events
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Also check periodically in case events don't fire
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
    };
    const interval = setInterval(checkOnline, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
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
