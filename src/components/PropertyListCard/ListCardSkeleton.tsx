import { Card, Skeleton } from "../ui";

export type ListCardSkeletonProps = {
  canViewOwners?: boolean;
  canViewAgents?: boolean;
};

export function ListCardSkeleton({
  canViewOwners = true,
  canViewAgents = true,
}: ListCardSkeletonProps) {
  return (
    <Card
      role="article"
      className="flex flex-col overflow-hidden sm:flex-row sm:items-stretch"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[min(320px,34%)] sm:min-h-[220px]">
        <Skeleton className="absolute inset-0 rounded-none" variant="default" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <Skeleton variant="text" className="h-6 w-3/5 max-w-md" />

        <div className="mt-1 md:hidden lg:block">
          <Skeleton variant="text" className="h-4 w-4/5 max-w-lg" />
          <div className="mt-1.5 flex items-center gap-1.5">
            <Skeleton variant="circular" className="size-4 shrink-0" />
            <Skeleton variant="text" className="h-4 w-44" />
          </div>
        </div>

        <div className="mt-1 hidden min-w-0 md:flex md:items-end md:justify-between md:gap-6 lg:hidden">
          <div className="min-w-0">
            <Skeleton variant="text" className="h-4 w-4/5 max-w-lg" />
            <div className="mt-1.5 flex items-center gap-1.5">
              <Skeleton variant="circular" className="size-4 shrink-0" />
              <Skeleton variant="text" className="h-4 w-44" />
            </div>
          </div>
          <Skeleton variant="text" className="h-6 w-32" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6">
          <Skeleton variant="text" className="h-4 w-16" />
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-6 w-32 sm:ms-auto md:hidden lg:block" />
        </div>

        <div className="mt-auto pt-4">
          {canViewOwners ? (
            <div className="mb-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md bg-page p-2">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="text" className="mt-1 h-4 w-36" />
              </div>
              <div className="rounded-md bg-page p-2">
                <Skeleton variant="text" className="h-4 w-28" />
                <Skeleton variant="text" className="mt-1 h-4 w-40" />
              </div>
              <div className="rounded-md bg-page p-2">
                <Skeleton variant="text" className="h-4 w-20" />
                <Skeleton variant="text" className="mt-1 h-4 w-32" />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t-0 pt-0 sm:flex-row sm:items-center sm:justify-between md:border-t md:border-secondary/15 md:pt-5">
            {canViewAgents ? (
              <div className="flex min-w-0 items-center gap-3 rounded-md bg-page p-2 md:flex-1 md:max-w-[70%] lg:max-w-none lg:flex-none">
                <Skeleton variant="circular" className="size-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Skeleton variant="text" className="h-4 w-32" />
                  <Skeleton variant="text" className="mt-1 h-4 w-36" />
                </div>
              </div>
            ) : null}

            <div className="flex w-full justify-end gap-2 sm:w-auto md:gap-4 lg:hidden">
              <Skeleton className="h-11 w-11 rounded-[10px]" />
              <Skeleton className="h-11 w-11 rounded-[10px]" />
              <Skeleton className="h-11 w-11 rounded-[10px]" />
            </div>
            <div className="hidden w-full flex-col justify-end gap-2 lg:flex lg:w-auto lg:flex-row lg:gap-4">
              <Skeleton className="h-11 w-full rounded-[10px] sm:w-28" />
              <Skeleton className="h-11 w-full rounded-[10px] sm:w-28" />
              <Skeleton className="h-11 w-11 rounded-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
