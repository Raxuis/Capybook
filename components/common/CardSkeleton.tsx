import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  variant?: "library" | "wishlist" | "review";
  className?: string;
}

/**
 * Skeleton loader for dashboard cards
 */
export function CardSkeleton({ variant = "library", className }: CardSkeletonProps) {
  if (variant === "review") {
    return (
      <Card className={cn("border border-slate-200 bg-white", className)}>
        <div className="flex gap-3 p-4">
          <Skeleton className="h-28 w-20 shrink-0 rounded" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-12 rounded" />
            </div>
            <Skeleton className="h-16 w-full rounded" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("border border-slate-200 bg-white h-full flex flex-col", className)}>
      {/* Cover skeleton */}
      <Skeleton className="aspect-[2/3] w-full" />

      <CardHeader className="px-4 pb-2.5 pt-3.5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-1.5 pt-1">
            <Skeleton className="size-3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        {variant === "wishlist" ? (
          <Skeleton className="h-6 w-32 rounded-md" />
        ) : (
          <Skeleton className="h-8 w-full rounded" />
        )}
      </CardContent>
    </Card>
  );
}
