import { cn } from "../../lib/cn";
import { Card, Skeleton } from "../ui";

export type OverviewTabSkeletonProps = {
  className?: string;
};

function HighlightStatSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-page-ghost px-4 py-4">
      <Skeleton className="size-9 shrink-0 rounded-lg" variant="default" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-3 w-16" variant="text" />
        <Skeleton className="h-5 w-12" variant="text" />
      </div>
    </div>
  );
}

export function OverviewTabSkeleton({ className }: OverviewTabSkeletonProps) {
  return (
    <section
      className={cn("flex flex-col gap-2 md:gap-4 lg:gap-6", className)}
      aria-busy="true"
      aria-label="Loading property overview"
    >
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <Skeleton className="h-4 w-32" variant="text" />
        <Skeleton className="mt-2 h-4 w-64 max-w-full" variant="text" />
        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <HighlightStatSkeleton key={`overview-highlight-${index}`} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4 lg:gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={`overview-info-${index}`}
            className="flex flex-col gap-2 border border-secondary/10 p-5 shadow-none"
          >
            <Skeleton className="h-3 w-20" variant="text" />
            <Skeleton className="h-6 w-28" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
          </Card>
        ))}
      </div>

      <div>
        <Skeleton className="h-4 w-24" variant="text" />
        <Card className="mt-3 border border-secondary/10 p-5 shadow-none sm:p-6">
          <div className="flex gap-4">
            <Skeleton className="w-1 shrink-0 self-stretch rounded-full" variant="default" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-4 w-full" variant="text" />
              <Skeleton className="h-4 w-full" variant="text" />
              <Skeleton className="h-4 w-4/5" variant="text" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
