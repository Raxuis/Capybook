import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable loading state component
 */
export function LoadingState({
  message = "Chargement...",
  className,
  size = "md"
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8",
      className
    )}>
      <Loader2 className={cn(
        "text-primary animate-spin mb-3",
        sizeClasses[size]
      )} />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
