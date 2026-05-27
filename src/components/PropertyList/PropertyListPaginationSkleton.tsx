import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../lib/cn";

export function PropertyListPaginationSkleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-secondary/15 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-hidden
    >
      <Skeleton variant="text" className="h-4 w-56 max-w-full rounded-lg" />

      <div className="flex flex-wrap items-center gap-4">
        <Skeleton variant="text" className="hidden h-4 w-16 sm:block" />
        <Skeleton className="h-9 w-[4.5rem] rounded-lg" />

        <div className="flex items-center gap-1.5">
          <Skeleton className="size-9 rounded-lg" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="size-9 rounded-lg" />
          ))}
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
