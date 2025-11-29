import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string | ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Reusable empty state component
 */
export function EmptyState({
  icon: Icon,
  title,
  message = "Aucun élément à afficher",
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center",
      className
    )}>
      {Icon && (
        <Icon className="text-muted-foreground mb-4 size-12 opacity-50" />
      )}
      {title && (
        <h3 className="font-semibold text-foreground mb-2">
          {title}
        </h3>
      )}
      <p className="text-muted-foreground text-sm mb-4 max-w-md">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
