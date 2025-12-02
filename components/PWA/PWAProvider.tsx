"use client";

import { ReactNode, useEffect } from "react";
import { UpdatePrompt } from "./UpdatePrompt";
import { useSyncQueue } from "@/hooks/use-sync-queue";

const isProduction = process.env.NODE_ENV === "production";

interface PWAProviderProps {
  children: ReactNode;
}

/**
 * Global PWA provider that handles:
 * - Sync queue management
 * - Service worker updates
 */
export function PWAProvider({ children }: PWAProviderProps) {
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

  // Process sync queue on mount and periodically
  useEffect(() => {
    // Process queue on mount
    const timeout = setTimeout(() => {
      processQueue();
    }, 1000);

    // Process queue periodically
    const interval = setInterval(() => {
      processQueue();
    }, 30000); // Every 30 seconds

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [processQueue]);

  return (
    <>
      {children}
      <UpdatePrompt />
    </>
  );
}
