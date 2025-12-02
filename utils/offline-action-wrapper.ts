"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { useSyncQueue } from "@/hooks/use-sync-queue";
import { toast } from "@/hooks/use-toast";

/**
 * Wraps a server action to handle offline mode gracefully
 * Queues the action when offline and executes it when connection is restored
 */
export function useOfflineActionWrapper<T extends (...args: any[]) => Promise<any>>() {
  const isOnline = useOnlineStatus();
  const { addToQueue } = useSyncQueue();

  const wrapAction = <TArgs extends any[], TReturn>(
    action: (...args: TArgs) => Promise<TReturn>,
    options?: {
      actionName?: string;
      onOffline?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    return async (...args: TArgs): Promise<TReturn | null> => {
      if (!isOnline) {
        // Queue the action for later
        const actionName = options?.actionName || "action";

        toast({
          title: "Hors ligne",
          description: `${actionName} sera exécuté lorsque la connexion sera rétablie.`,
          variant: "default",
        });

        addToQueue(async () => {
          try {
            await action(...args);
            toast({
              title: "Synchronisé",
              description: `${actionName} a été exécuté avec succès.`,
            });
          } catch (error) {
            console.error(`Failed to execute queued ${actionName}:`, error);
            toast({
              title: "Erreur",
              description: `Impossible d'exécuter ${actionName}. Veuillez réessayer.`,
              variant: "destructive",
            });
            if (options?.onError && error instanceof Error) {
              options.onError(error);
            }
          }
        });

        if (options?.onOffline) {
          options.onOffline();
        }

        return null;
      }

      // Online - execute immediately
      try {
        return await action(...args);
      } catch (error) {
        // Check if it's a network error
        if (error instanceof Error && (
          error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("Failed to fetch")
        )) {
          // Network error - queue the action
          const actionName = options?.actionName || "action";

          toast({
            title: "Erreur de connexion",
            description: `${actionName} sera réessayé lorsque la connexion sera rétablie.`,
            variant: "default",
          });

          addToQueue(async () => {
            try {
              await action(...args);
              toast({
                title: "Synchronisé",
                description: `${actionName} a été exécuté avec succès.`,
              });
            } catch (retryError) {
              console.error(`Failed to retry ${actionName}:`, retryError);
              if (options?.onError && retryError instanceof Error) {
                options.onError(retryError);
              }
            }
          });

          return null;
        }

        // Other error - rethrow
        if (options?.onError && error instanceof Error) {
          options.onError(error);
        }
        throw error;
      }
    };
  };

  return { wrapAction, isOnline };
}
