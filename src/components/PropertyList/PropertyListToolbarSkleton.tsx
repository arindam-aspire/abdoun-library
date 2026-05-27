import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../lib/cn";

export function PropertyListToolbarSkleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-hidden
    >
      <Skeleton variant="text" className="h-7 w-48 max-w-[60%] rounded-lg" />

      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-[8.75rem] rounded-lg" />
        <Skeleton className="h-9 w-[8.75rem] rounded-lg" />
        <Skeleton variant="text" className="h-4 w-20" />
      </div>
    </div>
  );
}
