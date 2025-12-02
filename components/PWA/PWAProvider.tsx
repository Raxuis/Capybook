"use client";

import { ReactNode, useEffect } from "react";
import { OfflineBanner } from "./OfflineBanner";
import { UpdatePrompt } from "./UpdatePrompt";
import { useSyncQueue } from "@/hooks/use-sync-queue";
import { useOnlineStatus } from "@/hooks/use-online-status";

const isProduction = process.env.NODE_ENV === "production";

interface PWAProviderProps {
  children: ReactNode;
}

/**
 * Global PWA provider that handles:
 * - Offline/online status
 * - Sync queue management
 * - Service worker updates
 * - Offline banners
 */
export function PWAProvider({ children }: PWAProviderProps) {
  const isOnline = useOnlineStatus();
  const { processQueue } = useSyncQueue();

  // Unregister service workers in development to avoid 404 errors
  useEffect(() => {
    if (!isProduction && typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {
            // Silently ignore unregister errors
          });
        }
      });
    }
  }, []);

  // Process sync queue when coming back online
  useEffect(() => {
    if (isOnline) {
      // Small delay to ensure network is stable
      const timeout = setTimeout(() => {
        processQueue();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isOnline, processQueue]);

  return (
    <>
      {children}
      <OfflineBanner />
      <UpdatePrompt />
    </>
  );
}
