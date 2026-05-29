import { cn } from "../../lib/cn";
import { Card, Skeleton } from "../ui";

export type HeroSectionSkeletonProps = {
  className?: string;
};

const SIDE_THUMBNAIL_COUNT = 3;

const lgSideThumbnailClass =
  "lg:h-[calc((min(420px,70vh)-3rem)/3)] lg:min-h-[88px] lg:w-full lg:shrink-0 lg:flex-none";

export function HeroSectionSkeleton({
  className,
}: HeroSectionSkeletonProps) {
  return (
    <section
      className={cn("w-full", className)}
      aria-busy="true"
      aria-label="Loading property hero"
    >
      <Card className="overflow-hidden p-0 lg:overflow-visible lg:bg-transparent lg:shadow-none">
        <div className="flex flex-col gap-2 md:gap-4 lg:flex-row lg:items-stretch lg:gap-6 lg:overflow-visible">
          <div className="relative min-h-[280px] flex-1 overflow-hidden sm:min-h-[360px] md:min-h-[400px] lg:min-h-[420px] lg:rounded-2xl">
            <Skeleton
              className="absolute inset-0 rounded-none lg:rounded-2xl"
              variant="default"
            />

            <Skeleton className="absolute top-3 left-3 z-10 h-7 w-20 rounded-md sm:top-4 sm:left-4" />
            <Skeleton
              variant="circular"
              className="absolute top-3 right-4 z-10 size-10 shrink-0 sm:top-4"
            />

            <div className="absolute right-3 bottom-3 left-3 z-10 flex flex-col gap-2 pb-1 sm:right-4 sm:bottom-4 sm:left-4 sm:flex-row sm:items-end sm:justify-between md:gap-4 lg:gap-6">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton variant="text" className="h-3 w-28 max-w-[40%]" />
                <Skeleton
                  variant="text"
                  className="h-8 w-4/5 max-w-md sm:h-9"
                />
                <Skeleton variant="text" className="h-4 w-1/2 max-w-xs sm:h-5" />
              </div>

              <Skeleton className="h-11 w-full max-w-full shrink-0 rounded-full sm:w-[17.5rem] sm:self-end" />
            </div>
          </div>

          <div
            className={cn(
              "flex max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1 md:gap-4 lg:gap-6",
              "md:max-h-none md:overflow-visible",
              "lg:w-[min(22%,220px)] lg:shrink-0 lg:snap-none lg:flex-col lg:pb-0",
              "lg:min-h-[min(420px,70vh)] lg:max-h-none lg:overflow-visible",
            )}
            aria-hidden
          >
            {Array.from({ length: SIDE_THUMBNAIL_COUNT }).map((_, index) => (
              <div
                key={`hero-thumb-skeleton-${index}`}
                className={cn(
                  "shrink-0 grow-0 snap-start rounded-2xl p-0.5",
                  "aspect-square size-[4.5rem]",
                  "lg:aspect-auto lg:size-auto",
                  lgSideThumbnailClass,
                )}
              >
                <Skeleton
                  className="size-full rounded-[0.875rem]"
                  variant="default"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
