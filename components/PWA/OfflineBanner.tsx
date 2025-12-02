"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show online message briefly
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        setWasOffline(false);
      }, 3000);
    }
  }, [isOnline, wasOffline]);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex items-center justify-center px-4 py-3 text-sm font-medium",
          isOnline
            ? "bg-green-500/90 text-white backdrop-blur-sm"
            : "bg-orange-500/90 text-white backdrop-blur-sm"
        )}
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <div className="container mx-auto flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="size-4" />
              <span>Connexion rétablie. Synchronisation en cours...</span>
            </>
          ) : (
            <>
              <WifiOff className="size-4" />
              <span>Vous êtes hors ligne. Les modifications seront synchronisées lorsque la connexion reviendra.</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
