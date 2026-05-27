import { Card, Skeleton } from "../ui";
import { cn } from "../../lib/cn";

export function PropertyGridCardSkleton() {
  return (
    <Card className={cn("flex h-full flex-col overflow-hidden")}>
      <div className="relative h-0 overflow-hidden rounded-t-xl pb-[67%]">
        <Skeleton className="absolute inset-0 rounded-none" variant="default" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <Skeleton variant="text" className="h-6 w-2/5 max-w-[140px]" />
        <Skeleton variant="text" className="mt-2 h-5 w-4/5" />
        <div className="mt-2 flex items-center gap-1.5">
          <Skeleton variant="circular" className="size-3.5 shrink-0" />
          <Skeleton variant="text" className="h-4 flex-1" />
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <Skeleton className="h-[38px] flex-1 rounded-[10px]" />
          <Skeleton className="h-[38px] flex-1 rounded-[10px]" />
          <Skeleton className="h-[38px] w-12 shrink-0 rounded-[10px]" />
        </div>
      </div>
    </Card>
  );
}
