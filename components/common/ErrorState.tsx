import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "warning";
}

/**
 * Reusable error state component
 */
export function ErrorState({
  title = "Erreur",
  message = "Une erreur est survenue",
  onRetry,
  className,
  variant = "default"
}: ErrorStateProps) {
  const variantClasses = {
    default: "text-muted-foreground",
    destructive: "text-destructive",
    warning: "text-amber-500"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <AlertCircle className={cn(
        "mb-4 size-8",
        variantClasses[variant]
      )} />
      <h3 className={cn(
        "font-semibold mb-2",
        variantClasses[variant]
      )}>
        {title}
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md text-sm">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
        >
          Réessayer
        </Button>
      )}
    </div>
  );
}
