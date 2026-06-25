"use client";

import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { ownerGridCardClassName } from "./OwnerGridCard";

function OwnerMobileCardSkeleton() {
  return (
    <Card role="article" className={ownerGridCardClassName}>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/5 max-w-[10rem]" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="size-8 shrink-0 rounded-lg" />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
        </div>
        <div className="space-y-2 rounded-lg bg-page p-3">
          <Skeleton className="h-3.5 w-4/5 max-w-[12rem]" />
          <Skeleton className="h-3.5 w-1/2 max-w-[9rem]" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-20 shrink-0 rounded-lg" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-lg" />
          <Skeleton className="size-9 shrink-0 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

type OwnerGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function OwnerGridSkeleton({
  count = 4,
  className,
}: OwnerGridSkeletonProps) {
  return (
    <ul className={cn("m-0 flex list-none flex-col gap-3 p-0", className)}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <OwnerMobileCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
