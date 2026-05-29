import { cn } from "../../lib/cn";
import { Card, Skeleton } from "../ui";

export type DocumentsTabSkeletonProps = {
  /** Placeholder document rows. */
  documentCount?: number;
  /** Placeholder floor plan cards. */
  floorPlanCount?: number;
  className?: string;
};

const DEFAULT_DOCUMENT_COUNT = 2;
const DEFAULT_FLOOR_PLAN_COUNT = 2;

function DocumentRowSkeleton() {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-secondary/10 bg-page-ghost px-4 py-3.5">
      <Skeleton className="size-10 shrink-0 rounded-lg" variant="default" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40 max-w-full" variant="text" />
        <Skeleton className="h-3 w-20" variant="text" />
      </div>
      <Skeleton className="size-9 shrink-0 rounded-lg sm:h-9 sm:w-24" variant="default" />
    </li>
  );
}

function FloorPlanItemSkeleton() {
  return (
    <li className="overflow-hidden rounded-xl border border-secondary/10 bg-surface">
      <div className="relative aspect-[4/3] overflow-hidden bg-page-ghost">
        <Skeleton className="absolute inset-0 rounded-none" variant="default" />
        <Skeleton
          className="absolute right-3 top-3 h-7 w-[4.5rem] rounded-lg"
          variant="default"
        />
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="size-9 shrink-0 rounded-lg" variant="default" />
        <Skeleton className="h-4 min-w-0 flex-1 max-w-[10rem]" variant="text" />
      </div>
    </li>
  );
}

export function DocumentsTabSkeleton({
  documentCount = DEFAULT_DOCUMENT_COUNT,
  floorPlanCount = DEFAULT_FLOOR_PLAN_COUNT,
  className,
}: DocumentsTabSkeletonProps) {
  return (
    <section
      className={cn("flex flex-col", className)}
      aria-busy="true"
      aria-label="Loading property documents"
    >
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <Skeleton className="h-4 w-28" variant="text" />

        <div className="mt-5 flex flex-col gap-8">
          <div>
            <Skeleton className="h-3 w-36" variant="text" />
            <Skeleton className="mt-2 h-4 w-full max-w-md" variant="text" />
            <ul className="mt-4 flex flex-col gap-3">
              {Array.from({ length: documentCount }).map((_, index) => (
                <DocumentRowSkeleton key={`documents-row-${index}`} />
              ))}
            </ul>
          </div>

          <div>
            <Skeleton className="h-3 w-24" variant="text" />
            <Skeleton className="mt-2 h-4 w-full max-w-sm" variant="text" />
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: floorPlanCount }).map((_, index) => (
                <FloorPlanItemSkeleton key={`documents-floor-${index}`} />
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}
