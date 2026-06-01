import { cn } from "../../lib/cn";
import { Skeleton } from "../ui/Skeleton";

interface ListToolbarSkletonProps {
  className?: string;
}

export function ListToolbarSkleton({ className }: ListToolbarSkletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:gap-4 lg:gap-6",
        className,
      )}
    >
      <Skeleton className="h-8 w-40 md:w-48" />

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center md:gap-4 lg:gap-6">
        <div className="flex w-full flex-row flex-nowrap items-center gap-2 md:contents">
          <Skeleton className="h-8 min-w-0 flex-1 rounded-lg sm:h-11 md:w-[11rem] md:flex-none lg:w-[12rem]" />
          <Skeleton className="h-8 shrink-0 rounded-lg sm:h-11 sm:w-auto md:w-[11rem] lg:w-[12rem]" />
        </div>
        <Skeleton className="hidden h-5 w-20 sm:block" />
      </div>
    </div>
  );
}
