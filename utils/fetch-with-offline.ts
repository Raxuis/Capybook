"use client";

/**
 * Enhanced fetch wrapper that handles offline mode gracefully
 * Falls back to cache when offline and network fails
 */
export async function fetchWithOffline(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

  // If offline, try cache first
  if (!isOnline && typeof window !== "undefined" && "caches" in window) {
    try {
      const cache = await caches.open("pages");
      const cachedResponse = await cache.match(input as RequestInfo);

      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (error) {
      console.warn("Failed to check cache:", error);
    }
  }

  try {
    const response = await fetch(input, {
      ...init,
      // Add cache control for better offline support
      cache: init?.cache || (isOnline ? "default" : "force-cache"),
    });

    // If request failed and we're offline, try cache
    if (!response.ok && !isOnline) {
      if (typeof window !== "undefined" && "caches" in window) {
        try {
          const cache = await caches.open("pages");
          const cachedResponse = await cache.match(input as RequestInfo);

          if (cachedResponse) {
            return cachedResponse;
          }
        } catch (error) {
          console.warn("Failed to check cache:", error);
        }
      }
    }

    return response;
  } catch (error) {
    // Network error - try cache if available
    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const cache = await caches.open("pages");
        const cachedResponse = await cache.match(input as RequestInfo);

        if (cachedResponse) {
          return cachedResponse;
        }
      } catch (cacheError) {
        console.warn("Failed to check cache:", cacheError);
      }
    }

    // Re-throw if no cache available
    throw error;
  }
}
