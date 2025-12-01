"use client";

import { OfflineFallback } from "@/components/PWA/OfflineFallback";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const isOnline = useOnlineStatus();
  const router = useRouter();

  useEffect(() => {
    if (isOnline) {
      // Redirect to home when connection is restored
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isOnline, router]);

  return (
    <div className="min-h-screen">
      <OfflineFallback
        message="Cette page nécessite une connexion internet. Vous serez redirigé automatiquement lorsque la connexion sera rétablie."
        showRetry={false}
      />
    </div>
  );
}
