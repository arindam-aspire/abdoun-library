"use client";

import { cn } from "../../lib/cn";
import { PaginitionSkeleton } from "../PropertyCardList/PaginitionSkeleton";
import { Card } from "../ui/Card";
import { progressBarInheritTrackClassName } from "../ui/ProgressBar";
import { Skeleton } from "../ui/Skeleton";
import {
  draftListCardClassName,
  draftListPaginationClassName,
} from "./draftListLayout";

function DraftListCardSkeleton({ className }: { className?: string }) {
  return (
    <Card role="article" className={cn(draftListCardClassName, className)}>
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5 md:p-5">
        <div className="min-w-0 flex-1 md:max-w-[16rem] lg:max-w-[18rem]">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-4 w-2/5 max-w-[10rem]" />
            <Skeleton className="h-5 w-16 shrink-0 rounded-full md:hidden" />
          </div>
          <Skeleton className="mt-2 h-3.5 w-3/5 max-w-[12rem]" />
          <Skeleton className="mt-2 h-3.5 w-1/4 max-w-[6rem] md:hidden" />
        </div>

        <div className="hidden shrink-0 space-y-2 md:block lg:min-w-[6.5rem]">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="min-w-0 md:min-w-[10rem] md:flex-1 md:max-w-xs lg:max-w-sm">
          <div className="mb-1.5 flex items-center justify-between gap-3 md:hidden">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="mb-1.5 hidden items-center justify-between gap-3 md:flex">
            <Skeleton className="h-3.5 w-10" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div
            className={cn(
              "h-1.5 w-full overflow-hidden rounded-full",
              progressBarInheritTrackClassName,
            )}
          >
            <Skeleton className="h-full w-1/2 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-secondary/15 pt-4 md:shrink-0 md:border-t-0 md:pt-0">
          <Skeleton className="size-9 shrink-0 rounded-lg" />
          <Skeleton className="h-9 min-w-0 flex-1 rounded-lg md:w-24 md:flex-none" />
        </div>
      </div>
    </Card>
  );
}

export interface DraftListSkeletonProps {
  rowCount?: number;
  showPagination?: boolean;
  className?: string;
}

export function DraftListSkeleton({
  rowCount = 4,
  showPagination = false,
  className,
}: DraftListSkeletonProps) {
  const safeRowCount = Math.max(1, rowCount);

  return (
    <div
      className={cn("w-full", className)}
      aria-busy="true"
      aria-label="Loading property drafts"
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0 md:gap-4" aria-hidden>
        {Array.from({ length: safeRowCount }).map((_, index) => (
          <li key={`draft-card-skeleton-${index}`}>
            <DraftListCardSkeleton />
          </li>
        ))}
      </ul>
      {showPagination ? (
        <PaginitionSkeleton className={draftListPaginationClassName} />
      ) : null}
    </div>
  );
}
