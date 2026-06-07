import { cn } from "../../lib/cn";
import type { NoDataFoundProps } from "./types";
import {
  textBodySmClasses,
  textEmptyTitleClasses,
  textEyebrowClasses,
} from "../../lib/typography";

function GhostListingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-[7.5rem] shrink-0 flex-col overflow-hidden rounded-xl border border-primary/10 bg-surface/70 shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)] backdrop-blur-sm sm:w-[8.75rem]",
        className,
      )}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-primary-light to-primary/10" />
      <div className="space-y-2 p-2.5 sm:p-3">
        <div className="h-2 w-3/5 rounded-full bg-primary/20" />
        <div className="h-1.5 w-full rounded-full bg-secondary/10" />
        <div className="h-1.5 w-4/5 rounded-full bg-secondary/10" />
      </div>
    </div>
  );
}

export function NoDataFound({
  title = "No properties found",
  description = "Nothing matched your search yet. Broaden your filters or explore the full collection.",
  className,
  actions,
}: NoDataFoundProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("relative overflow-hidden rounded-2xl", className)}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-light/80 via-page to-surface dark:from-primary-light/25 dark:via-page dark:to-surface"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-20 -top-20 size-56 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -start-16 bottom-8 size-44 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative px-5 py-10 sm:px-8 sm:py-12 md:py-14">
        <div
          className="mx-auto mb-6 flex max-w-md items-end justify-center gap-2.5 sm:mb-8 sm:gap-4"
          aria-hidden
        >
          <GhostListingCard className="-rotate-6 opacity-35 sm:-translate-y-1" />
          <GhostListingCard className="relative z-10 scale-105 opacity-50" />
          <GhostListingCard className="rotate-6 opacity-35 sm:-translate-y-1" />
        </div>

        <div
          className={cn(
            "relative mx-auto max-w-lg rounded-2xl border border-primary/10 px-6 py-8 text-center sm:px-8 sm:py-10",
            "bg-surface/80 shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.08)] backdrop-blur-md",
            "dark:border-primary/20 dark:bg-surface/55",
          )}
        >
          <p className={cn(textEyebrowClasses, "text-primary")}>
            0 listings matched
          </p>

          <h3
            className={cn(
              "mt-3 text-balance text-primary-dark",
              textEmptyTitleClasses,
            )}
          >
            {title}
          </h3>

          <p
            className={cn(
              "mx-auto mt-4 max-w-md text-balance text-muted",
              textBodySmClasses,
            )}
          >
            {description}
          </p>

          <div
            className="mx-auto mt-6 h-px w-full max-w-[12rem] bg-gradient-to-r from-transparent via-primary/35 to-transparent"
            aria-hidden
          />

          {actions ? (
            <div className="mt-7 flex w-full flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
