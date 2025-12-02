"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Check if we're in production environment
 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Hook to detect service worker updates and prompt user to refresh
 * Only works in production where service workers are enabled
 */
export function useSWUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Only run in production where service workers are enabled
    if (!isProduction) {
      return;
    }

    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;
    let updateInterval: NodeJS.Timeout | null = null;

    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;

        // Verify the service worker script exists by attempting a safe update check
        // This will fail if sw.js doesn't exist (e.g., 404 error)
        try {
          await reg.update();
        } catch (updateError) {
          // If update fails (e.g., 404), the service worker script doesn't exist
          // This shouldn't happen in production, but handle it gracefully
          console.warn("Service worker update failed, script may not exist:", updateError);
          return;
        }

        registration = reg;
        setRegistration(reg);

        // Check if there's a waiting service worker
        if (reg.waiting) {
          setUpdateAvailable(true);
          return;
        }

        // Listen for new service worker installing
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New service worker is ready
              setUpdateAvailable(true);
            }
          });
        });

        // Check for updates periodically
        updateInterval = setInterval(() => {
          reg.update().catch(() => {
            // Silently fail if update check fails (e.g., in dev mode)
          });
        }, 60000); // Check every minute
      } catch (error) {
        // Silently handle errors in development or if service worker is not available
        if (isProduction) {
          console.error("Service worker registration error:", error);
        }
      }
    };

    checkForUpdates();

    // Listen for controller change (service worker activated)
    const handleControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const updateServiceWorker = useCallback(async () => {
    if (!registration?.waiting) {
      // Try to update
      try {
        await registration?.update();
      } catch (error) {
        console.error("Failed to update service worker:", error);
      }
      return;
    }

    setIsUpdating(true);

    // Send skipWaiting message to waiting service worker
    registration.waiting.postMessage({ type: "SKIP_WAITING" });

    // Wait a bit and reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, [registration]);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  return {
    updateAvailable,
    isUpdating,
    updateServiceWorker,
    dismissUpdate,
  };
}
