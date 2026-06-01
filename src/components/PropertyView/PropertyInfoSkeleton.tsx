import { cn } from "../../lib/cn";
import { Card, Skeleton } from "../ui";

export type PropertyInfoSkeletonProps = {
  className?: string;
  showAgent?: boolean;
  showOwner?: boolean;
};

function ContactActionsSkeleton() {
  return (
    <div className="flex w-full flex-row justify-end gap-2 md:gap-4">
      <Skeleton
        className="h-8 min-w-0 flex-1 rounded-lg sm:h-11"
        variant="default"
      />
      <Skeleton
        className="h-8 min-w-0 flex-1 rounded-lg sm:h-11"
        variant="default"
      />
      <Skeleton
        className="size-8 shrink-0 rounded-lg sm:size-11"
        variant="default"
      />
    </div>
  );
}

function AgentBlockSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <Skeleton className="h-3 w-24" variant="text" />
      <div className="flex items-center gap-3 rounded-md bg-page p-2">
        <Skeleton className="size-10 shrink-0 rounded-full" variant="default" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-28" variant="text" />
          <Skeleton className="h-4 w-36 max-w-full" variant="text" />
        </div>
      </div>
      <ContactActionsSkeleton />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-11/12" variant="text" />
    </section>
  );
}

function OwnerBlockSkeleton({ showAgentAbove = false }: { showAgentAbove?: boolean }) {
  return (
    <section className="flex flex-col gap-4">
      <Skeleton className="h-3 w-24" variant="text" />
      <div
        className={cn(
          "flex flex-col gap-2 rounded-md bg-page p-2",
          showAgentAbove && "sm:pt-4 md:pt-2",
        )}
      >
        <Skeleton className="h-4 w-28" variant="text" />
        <Skeleton className="h-4 w-36 max-w-full" variant="text" />
      </div>
      <ContactActionsSkeleton />
    </section>
  );
}

export function PropertyInfoSkeleton({
  className,
  showAgent = true,
  showOwner = true,
}: PropertyInfoSkeletonProps) {
  const hasContactColumn = showAgent || showOwner;

  return (
    <aside
      className={cn(
        "w-full min-w-0 lg:sticky lg:top-6 lg:self-start",
        className,
      )}
      aria-busy="true"
      aria-label="Loading price and contact details"
    >
      <Card
        className={cn(
          "flex w-full min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-5 md:p-6",
          hasContactColumn &&
            "md:grid md:grid-cols-2 md:items-start md:gap-4 lg:flex lg:flex-col lg:gap-6",
        )}
      >
        <div className="flex min-w-0 flex-col gap-4">
          <section className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20" variant="text" />
            <Skeleton className="h-7 w-32 md:h-8 md:w-36 lg:h-9" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-4/5" variant="text" />
          </section>

          <div className="grid grid-cols-2 divide-x divide-secondary/10 rounded-xl bg-page-ghost px-3 py-3.5 sm:px-4 sm:py-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`property-info-kpi-skeleton-${index}`}
                className={cn(
                  "min-w-0 space-y-2",
                  index === 0 ? "pr-3 sm:pr-4" : "pl-3 sm:pl-4",
                )}
              >
                <Skeleton className="h-3 w-20" variant="text" />
                <Skeleton className="h-5 w-16" variant="text" />
              </div>
            ))}
          </div>
        </div>

        {hasContactColumn ? (
          <div className="flex min-w-0 flex-col gap-4">
            {showAgent ? <AgentBlockSkeleton /> : null}
            {showOwner ? (
              <OwnerBlockSkeleton showAgentAbove={showAgent} />
            ) : null}
          </div>
        ) : null}
      </Card>
    </aside>
  );
}
