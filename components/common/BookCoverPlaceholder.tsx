import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCoverPlaceholderProps {
  title: string;
  authors?: string | string[];
  className?: string;
  variant?: "default" | "rose" | "amber";
}

/**
 * Book cover placeholder component
 * Shows a styled placeholder when book cover is not available
 */
export function BookCoverPlaceholder({
  title,
  authors,
  className,
  variant = "default"
}: BookCoverPlaceholderProps) {
  const variantStyles = {
    default: "bg-gradient-to-br from-slate-100 to-slate-200",
    rose: "bg-gradient-to-br from-rose-50 to-rose-100",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100"
  };

  const iconColors = {
    default: "text-slate-300",
    rose: "text-rose-200",
    amber: "text-amber-200"
  };

  const authorText = Array.isArray(authors)
    ? authors.slice(0, 2).join(", ")
    : authors || "";

  // Get initials from title
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);

  return (
    <div className={cn(
      "flex h-full w-full flex-col items-center justify-center p-4 text-center",
      variantStyles[variant],
      className
    )}>
      <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-white/60 shadow-sm backdrop-blur-sm">
        {initials ? (
          <span className="text-lg font-bold text-slate-600">{initials}</span>
        ) : (
          <BookOpen className={cn("size-8", iconColors[variant])} />
        )}
      </div>
      <p className="line-clamp-2 text-xs font-semibold leading-tight text-slate-700">
        {title}
      </p>
      {authorText && (
        <p className="mt-1 line-clamp-1 text-[10px] text-slate-500">
          {authorText}
        </p>
      )}
    </div>
  );
}
