import { cn } from "../../lib/cn";
import { Card, Skeleton } from "../ui";

export type FeatureTabSkeletonProps = {
  /** Number of placeholder feature rows (split across two columns on md+). */
  count?: number;
  className?: string;
};

const DEFAULT_FEATURE_COUNT = 6;

function FeatureItemSkeleton() {
  return (
    <li className="flex items-center gap-4">
      <Skeleton className="size-10 shrink-0 rounded-lg" variant="default" />
      <Skeleton className="h-4 flex-1 max-w-[12rem]" variant="text" />
    </li>
  );
}

export function FeatureTabSkeleton({
  count = DEFAULT_FEATURE_COUNT,
  className,
}: FeatureTabSkeletonProps) {
  return (
    <section
      className={cn("flex flex-col", className)}
      aria-busy="true"
      aria-label="Loading features and amenities"
    >
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <Skeleton className="h-4 w-44 max-w-full" variant="text" />

        <ul className="mt-5 grid grid-cols-1 gap-y-4 gap-x-12 md:grid-cols-2">
          {Array.from({ length: count }).map((_, index) => (
            <FeatureItemSkeleton key={`feature-tab-skeleton-${index}`} />
          ))}
        </ul>
      </Card>
    </section>
  );
}
