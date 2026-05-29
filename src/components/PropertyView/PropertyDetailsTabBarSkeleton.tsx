import { cn } from "../../lib/cn";
import { Skeleton } from "../ui";

export type PropertyDetailsTabBarSkeletonProps = {
  /** Number of tab placeholders (defaults to 4). */
  count?: number;
  className?: string;
};

export function PropertyDetailsTabBarSkeleton({
  count = 4,
  className,
}: PropertyDetailsTabBarSkeletonProps) {
  return (
    <div
      role="tablist"
      aria-busy="true"
      aria-label="Loading property details sections"
      className={cn(
        "flex w-full min-w-0 border-b border-secondary/15",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`property-details-tab-skeleton-${index}`}
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 border-b-2 border-transparent px-1 py-2 sm:inline-flex sm:shrink-0 sm:flex-none sm:flex-row sm:items-center sm:gap-2 sm:px-4 sm:py-3"
        >
          <Skeleton className="size-4 shrink-0 rounded" variant="default" />
          <Skeleton className="h-3 w-12 sm:h-4 sm:w-16" variant="text" />
        </div>
      ))}
    </div>
  );
}
