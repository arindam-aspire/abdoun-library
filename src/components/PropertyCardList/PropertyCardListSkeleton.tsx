import { cn } from "../../lib/cn";
import { GridCardSkeleton } from "../PropertyListCard/GridCardSkeleton";
import { ListCardSkeleton } from "../PropertyListCard/ListCardSkeleton";
import { ListToolbarSkleton } from "./ListToolbarSkleton";
import { PaginitionSkeleton } from "./PaginitionSkeleton";
import type { CardLayoutVariant } from "./types";

export type PropertyCardListSkeletonProps = {
  layoutVariant?: CardLayoutVariant;
  loadingCount?: number;
  canViewOwners?: boolean;
  canViewAgents?: boolean;
  showPagination?: boolean;
  className?: string;
};

export function PropertyCardListSkeleton({
  layoutVariant = "grid",
  loadingCount,
  canViewOwners = true,
  canViewAgents = true,
  showPagination = true,
  className,
}: PropertyCardListSkeletonProps) {
  const skeletonCount = Math.max(1, loadingCount ?? (layoutVariant === "list" ? 4 : 6));

  return (
    <section
      className={cn("space-y-2 md:space-y-4 lg:space-y-6", className)}
      aria-busy="true"
      aria-label="Loading property listings"
    >
      <ListToolbarSkleton />

      {layoutVariant === "list" ? (
        <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <ListCardSkeleton
              key={`list-skeleton-${index}`}
              canViewOwners={canViewOwners}
              canViewAgents={canViewAgents}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <GridCardSkeleton
              key={`grid-skeleton-${index}`}
              canViewOwners={canViewOwners}
              canViewAgents={canViewAgents}
            />
          ))}
        </div>
      )}

      {showPagination ? <PaginitionSkeleton /> : null}
    </section>
  );
}
