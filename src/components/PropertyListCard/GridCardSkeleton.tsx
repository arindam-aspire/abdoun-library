import { Card, Skeleton } from "../ui";
import type { GridCardSkeletonProps } from "./types";

export function GridCardSkeleton({
  canViewOwners = true,
  canViewAgents = true,
}: GridCardSkeletonProps) {
  return (
    <Card role="article" className="flex h-full flex-col overflow-hidden">
      <div className="relative h-0 overflow-hidden rounded-t-xl pb-[67%]">
        <Skeleton className="absolute inset-0 rounded-none" variant="default" />
      </div>

      <div className="flex flex-col p-4">
        <Skeleton variant="text" className="h-6 w-2/5 max-w-[140px]" />
        <Skeleton variant="text" className="mt-2 h-5 w-4/5" />

        <div className="mt-2 flex items-center gap-1.5">
          <Skeleton variant="circular" className="size-4 shrink-0" />
          <Skeleton variant="text" className="h-4 w-40" />
        </div>

        {canViewAgents ? (
          <div className="mt-2 flex items-center gap-3 rounded-md bg-page p-2">
            <Skeleton variant="circular" className="size-10 shrink-0" />
            <div className="min-w-0 flex-1">
              <Skeleton variant="text" className="h-4 w-32" />
              <Skeleton variant="text" className="mt-1 h-4 w-36" />
            </div>
          </div>
        ) : null}

        {canViewOwners ? (
          <div className="mt-2">
            <Skeleton variant="text" className="mb-1.5 h-3 w-16" />
            <div className="grid grid-cols-1 gap-1.5">
            <div className="rounded-md bg-page p-2">
              <Skeleton variant="text" className="h-4 w-28" />
              <Skeleton variant="text" className="mt-1 h-4 w-40" />
            </div>
            <div className="rounded-md bg-page p-2">
              <Skeleton variant="text" className="h-4 w-24" />
              <Skeleton variant="text" className="mt-1 h-4 w-36" />
            </div>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex w-full justify-end gap-2 md:gap-4 lg:hidden">
          <Skeleton className="h-11 w-11 rounded-[10px]" />
          <Skeleton className="h-11 w-11 rounded-[10px]" />
          <Skeleton className="h-11 w-11 rounded-[10px]" />
        </div>
        <div className="mt-4 hidden w-full flex-col gap-2 lg:flex lg:flex-row lg:gap-4">
          <Skeleton className="h-11 w-full flex-1 rounded-[10px]" />
          <Skeleton className="h-11 w-full flex-1 rounded-[10px]" />
          <Skeleton className="h-11 w-11 rounded-[10px]" />
        </div>
      </div>
    </Card>
  );
}
