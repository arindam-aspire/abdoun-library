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
        <Skeleton className="h-11 w-full rounded-lg sm:w-[8.75rem] md:w-[11rem] lg:w-[12rem]" />
        <Skeleton className="h-11 w-full rounded-lg sm:w-40 md:w-[11rem] lg:w-[12rem]" />
        <Skeleton className="hidden h-5 w-20 sm:block" />
      </div>
    </div>
  );
}
