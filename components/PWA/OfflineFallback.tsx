"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface OfflineFallbackProps {
  message?: string;
  showRetry?: boolean;
}

export function OfflineFallback({
  message = "Vous êtes hors ligne. Veuillez vérifier votre connexion internet.",
  showRetry = true
}: OfflineFallbackProps) {
  const isOnline = useOnlineStatus();
  const router = useRouter();

  const handleRetry = () => {
    if (isOnline) {
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="size-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Hors ligne</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {showRetry && (
          <Button
            onClick={handleRetry}
            disabled={!isOnline}
            className="mt-4"
          >
            <RefreshCw className={cn(
              "mr-2 size-4",
              !isOnline && "animate-spin"
            )} />
            {isOnline ? "Réessayer" : "En attente de connexion..."}
          </Button>
        )}

        <p className="text-sm text-muted-foreground">
          Les données mises en cache peuvent être disponibles. Vérifiez votre connexion pour accéder aux dernières informations.
        </p>
      </div>
    </div>
  );
}
