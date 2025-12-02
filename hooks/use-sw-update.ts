"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hook to detect service worker updates and prompt user to refresh
 */
export function useSWUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;

    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;

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
        setInterval(() => {
          reg.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.error("Service worker registration error:", error);
      }
    };

    checkForUpdates();

    // Listen for controller change (service worker activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
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
