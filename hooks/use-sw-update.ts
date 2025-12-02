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

        // Check if service worker is in a valid state before attempting update
        // If it's being unregistered or in an invalid state, skip
        if (reg.installing || reg.waiting) {
          // Service worker is in a transitional state, wait a bit
          setTimeout(checkForUpdates, 1000);
          return;
        }

        // Verify the service worker script exists by attempting a safe update check
        // This will fail if sw.js doesn't exist (e.g., 404 error) or if in invalid state
        try {
          await reg.update();
        } catch (updateError) {
          // Handle different types of errors
          if (updateError instanceof Error) {
            // InvalidStateError means the service worker is in an invalid state
            // This can happen if it's being unregistered or is in a transitional state
            if (updateError.name === "InvalidStateError" || updateError.message.includes("invalid state")) {
              // Silently ignore - the service worker is likely being cleaned up
              return;
            }
            // 404 or other errors - service worker script may not exist
            if (updateError.message.includes("404") || updateError.message.includes("Failed to fetch")) {
              console.warn("Service worker script not found, may not exist in this environment");
              return;
            }
          }
          // For other errors, log in production
          if (isProduction) {
            console.warn("Service worker update failed:", updateError);
          }
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
          // Check if registration is still valid before updating
          if (!reg.installing && !reg.waiting) {
            reg.update().catch((error) => {
              // Silently ignore InvalidStateError and other expected errors
              if (error instanceof Error) {
                const isInvalidState = error.name === "InvalidStateError" ||
                  error.message.includes("invalid state") ||
                  error.message.includes("404") ||
                  error.message.includes("Failed to fetch");
                if (!isInvalidState && isProduction) {
                  console.warn("Periodic service worker update check failed:", error);
                }
              }
            });
          }
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
    if (!registration) {
      return;
    }

    if (!registration.waiting) {
      // Try to update
      try {
        // Check if registration is in a valid state
        if (registration.installing || registration.waiting) {
          // Service worker is in a transitional state
          return;
        }
        await registration.update();
      } catch (error) {
        // Handle InvalidStateError and other expected errors gracefully
        if (error instanceof Error) {
          const isInvalidState = error.name === "InvalidStateError" ||
            error.message.includes("invalid state");
          if (!isInvalidState) {
            console.error("Failed to update service worker:", error);
          }
        } else {
          console.error("Failed to update service worker:", error);
        }
      }
      return;
    }

    setIsUpdating(true);

    try {
      // Send skipWaiting message to waiting service worker
      registration.waiting.postMessage({ type: "SKIP_WAITING" });

      // Wait a bit and reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      setIsUpdating(false);
      console.error("Failed to activate service worker:", error);
    }
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
