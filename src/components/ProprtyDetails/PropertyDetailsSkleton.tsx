import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

export type PropertyDetailsSkletonProps = {
  className?: string;
};

function HeroSkleton() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      <Skeleton className="min-h-[280px] flex-1 rounded-2xl sm:min-h-[360px] lg:min-h-[420px]" />

      <div className="hidden gap-3 lg:flex lg:w-[min(22%,220px)] lg:shrink-0 lg:flex-col">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="min-h-0 flex-1 rounded-2xl lg:basis-0" />
        ))}
      </div>
    </div>
  );
}

function TabsSkleton() {
  return (
    <div className="flex gap-6 border-b border-secondary/15 pb-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn("h-5 rounded", index === 0 ? "w-24" : "w-20")}
        />
      ))}
    </div>
  );
}

function OverviewContentSkleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <Skeleton variant="text" className="h-4 w-32" />
        <Skeleton variant="text" className="mt-2 h-4 w-72 max-w-full" />

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-page-ghost px-4 py-4"
            >
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton variant="text" className="h-3 w-16" />
                <Skeleton variant="text" className="h-5 w-12" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col gap-2 border border-secondary/10 p-5 shadow-none"
          >
            <Skeleton variant="text" className="h-3 w-20" />
            <Skeleton variant="text" className="h-5 w-24" />
            <Skeleton variant="text" className="h-4 w-full max-w-[180px]" />
          </Card>
        ))}
      </div>

      <div>
        <Skeleton variant="text" className="h-4 w-24" />
        <Card className="mt-3 border border-secondary/10 p-5 shadow-none sm:p-6">
          <div className="flex gap-4">
            <Skeleton className="w-1 shrink-0 self-stretch rounded-full" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-4/5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SidebarSkleton() {
  return (
    <Card className="flex flex-col gap-6 p-5 sm:p-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-3 w-24" />
        <Skeleton variant="text" className="h-9 w-40" />
        <Skeleton variant="text" className="h-4 w-full max-w-[240px]" />
        <Skeleton variant="text" className="h-4 w-44" />
      </div>

      <div className="flex gap-6 sm:gap-10">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton variant="text" className="h-3 w-20" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton variant="text" className="h-3 w-28" />
          <Skeleton variant="text" className="h-4 w-14" />
        </div>
      </div>

      <div className="space-y-4 border-t border-secondary/10 pt-6">
        <Skeleton variant="text" className="h-3 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="size-12 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-36" />
            <Skeleton variant="text" className="h-4 w-48 max-w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-[42px] flex-1 rounded-lg" />
          <Skeleton className="h-[42px] flex-1 rounded-lg" />
          <Skeleton className="size-[42px] shrink-0 rounded-lg" />
        </div>
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
      </div>
    </Card>
  );
}

export function PropertyDetailsSkleton({
  className,
}: PropertyDetailsSkletonProps) {
  return (
    <article
      className={cn("flex w-full flex-col gap-8", className)}
      aria-busy="true"
      aria-label="Loading property details"
    >
      <HeroSkleton />
      <TabsSkleton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="min-w-0 lg:col-span-2">
          <OverviewContentSkleton />
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <SidebarSkleton />
        </aside>
      </div>
    </article>
  );
}
