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
  // Add a small delay to ensure other hooks have initialized first
  useEffect(() => {
    if (!isProduction && typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Small delay to avoid race conditions with other service worker code
      const timeout = setTimeout(() => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            // Check if registration is in a valid state before unregistering
            if (registration.active || registration.waiting || registration.installing) {
              registration.unregister().catch(() => {
                // Silently ignore unregister errors (e.g., already unregistered)
              });
            }
          }
        }).catch(() => {
          // Silently ignore if getRegistrations fails
        });
      }, 500);

      return () => clearTimeout(timeout);
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
