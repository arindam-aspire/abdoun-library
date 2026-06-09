import { cn } from "../../lib/cn";
import { Skeleton } from "../ui/Skeleton";

interface TablePaginitionSkeletonProps {
  className?: string;
}

export function TablePaginitionSkeleton({ className }: TablePaginitionSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-x-4 gap-y-2 px-3 py-2 sm:gap-x-6 sm:px-4 sm:py-2.5",
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-2">
        <Skeleton variant="text" className="h-4 w-24" />
        <Skeleton variant="text" className="h-4 w-6" />
      </div>

      <Skeleton variant="text" className="h-4 w-20" />

      <div className="flex items-center gap-0.5">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
  );
}
