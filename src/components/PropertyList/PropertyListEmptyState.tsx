import { SearchX } from "lucide-react";
import { cn } from "../../lib/cn";

export type PropertyListEmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function PropertyListEmptyState({
  title = "No data found",
  description = "Try adjusting your filters or search criteria.",
  className,
}: PropertyListEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-secondary/15 bg-surface px-6 py-16 text-center",
        className,
      )}
      role="status"
    >
      <SearchX className="size-12 text-muted/60" aria-hidden />
      <p className="mt-4 text-lg font-semibold text-secondary">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
}
