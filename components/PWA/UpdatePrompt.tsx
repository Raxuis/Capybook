"use client";

import { motion, AnimatePresence } from "motion/react";
import { useSWUpdate } from "@/hooks/use-sw-update";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function UpdatePrompt() {
  const { updateAvailable, isUpdating, updateServiceWorker, dismissUpdate } = useSWUpdate();

  if (!updateAvailable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] bg-primary text-primary-foreground shadow-lg",
          "px-4 py-3"
        )}
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium">
              Une nouvelle version de Capybook est disponible
            </p>
            <p className="text-xs opacity-90">
              Cliquez sur Actualiser pour obtenir la dernière version
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={updateServiceWorker}
              disabled={isUpdating}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  Actualisation...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Actualiser
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissUpdate}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
