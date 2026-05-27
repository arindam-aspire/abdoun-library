import { Card, Skeleton } from "../ui";
import { cn } from "../../lib/cn";

export function PropertyListCardSkleton() {
  return (
    <Card className={cn("flex flex-col overflow-hidden sm:flex-row sm:items-stretch")}>
      <div className="relative aspect-[16/10] w-full shrink-0 sm:aspect-auto sm:w-[min(320px,34%)] sm:min-h-[220px]">
        <Skeleton
          className="absolute inset-0 rounded-none"
          variant="default"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <Skeleton variant="text" className="h-6 w-3/5 max-w-md" />
        <div className="mt-3 flex items-center gap-2">
          <Skeleton variant="circular" className="size-4 shrink-0" />
          <Skeleton variant="text" className="h-4 w-48" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Skeleton variant="text" className="h-4 w-16" />
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="ms-auto h-6 w-28" />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap justify-end gap-2 border-t border-secondary/15 pt-5">
            <Skeleton className="h-[38px] w-28 rounded-[10px]" />
            <Skeleton className="h-[38px] w-28 rounded-[10px]" />
            <Skeleton className="h-[38px] w-12 shrink-0 rounded-[10px]" />
          </div>
        </div>
      </div>
    </Card>
  );
}
