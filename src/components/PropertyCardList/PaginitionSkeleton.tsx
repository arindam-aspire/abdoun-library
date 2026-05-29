import { cn } from "../../lib/cn";
import { Skeleton } from "../ui/Skeleton";

interface PaginitionSkeletonProps {
  className?: string;
}

export function PaginitionSkeleton({ className }: PaginitionSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-secondary/15 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-hidden
    >
      <Skeleton variant="text" className="order-2 mx-auto h-5 w-52 sm:order-1 sm:mx-0 sm:w-64" />

      <div className="order-1 flex w-full items-center justify-center gap-2 sm:order-2 sm:w-auto sm:justify-end sm:gap-4">
        <Skeleton className="size-11 rounded-lg" />
        <Skeleton className="size-11 rounded-lg" />
        <Skeleton className="size-11 rounded-lg" />
        <Skeleton className="size-11 rounded-lg" />
        <Skeleton className="h-11 w-8 rounded-lg" />
        <Skeleton className="size-11 rounded-lg" />
        <Skeleton className="size-11 rounded-lg" />
      </div>
    </div>
  );
}
