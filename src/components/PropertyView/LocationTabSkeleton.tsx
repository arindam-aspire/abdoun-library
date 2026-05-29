import { cn } from "../../lib/cn";
import { Card, Skeleton } from "../ui";

export type LocationTabSkeletonProps = {
  className?: string;
};

/** Matches `LocationTab` map frame sizing. */
const mapPreviewHeightClass =
  "h-52 w-full sm:h-56 lg:h-full lg:min-h-60";

function HighlightItemSkeleton() {
  return (
    <li className="flex items-start gap-3">
      <Skeleton className="mt-2 size-1.5 shrink-0 rounded-full" variant="default" />
      <Skeleton className="h-4 flex-1" variant="text" />
    </li>
  );
}

export function LocationTabSkeleton({ className }: LocationTabSkeletonProps) {
  return (
    <section
      className={cn("flex flex-col", className)}
      aria-busy="true"
      aria-label="Loading property location"
    >
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <Skeleton className="h-4 w-32 max-w-full" variant="text" />

        <div className="mt-5 grid grid-cols-1 items-start gap-2 md:gap-4 lg:grid-cols-[3fr_2fr] lg:items-stretch lg:gap-6">
          <div className="min-w-0 lg:h-full">
            <Skeleton
              className={cn(
                "rounded-xl border border-secondary/10",
                mapPreviewHeightClass,
              )}
              variant="default"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2 md:gap-4 lg:h-full lg:gap-6">
            <div>
              <Skeleton className="h-3 w-28" variant="text" />
              <ul className="mt-3 space-y-2.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <HighlightItemSkeleton
                    key={`location-highlight-skeleton-${index}`}
                  />
                ))}
              </ul>
            </div>
            <div>
              <Skeleton className="h-3 w-20" variant="text" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full" variant="text" />
                <Skeleton className="h-4 w-11/12" variant="text" />
                <Skeleton className="h-4 w-4/5" variant="text" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
