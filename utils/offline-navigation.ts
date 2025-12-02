"use client";

import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useSyncQueue } from "@/hooks/use-sync-queue";

/**
 * Hook for offline-safe navigation
 * Prevents navigation to uncached pages when offline
 * Stores navigation intent for when connection is restored
 */
export function useOfflineSafeNavigation() {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const { addToQueue } = useSyncQueue();

  const navigate = async (path: string, options?: { replace?: boolean }) => {
    if (isOnline) {
      // Online - navigate immediately
      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
      return;
    }

    // Offline - check if page is cached
    try {
      // Try to fetch the page to see if it's cached
      const response = await fetch(path, {
        method: "HEAD",
        cache: "force-cache",
      });

      if (response.ok || response.status === 0) {
        // Page is cached - navigate
        if (options?.replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      } else {
        // Page not cached - queue navigation for when online
        addToQueue(async () => {
          if (options?.replace) {
            router.replace(path);
          } else {
            router.push(path);
          }
        });

        // Show offline fallback
        router.push("/offline");
      }
    } catch (error) {
      // Network error - likely offline
      // Queue navigation and show offline page
      addToQueue(async () => {
        if (options?.replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      });

      router.push("/offline");
    }
  };

  return { navigate };
}

/**
 * Utility function to check if a URL is likely cached
 */
export async function isUrlCached(url: string): Promise<boolean> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return false;
  }

  try {
    const cache = await caches.open("pages");
    const response = await cache.match(url);
    return response !== undefined;
  } catch (error) {
    return false;
  }
}
