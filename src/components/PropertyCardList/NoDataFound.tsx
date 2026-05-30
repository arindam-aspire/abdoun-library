import { cn } from "../../lib/cn";
import { Card } from "../ui";
import type { NoDataFoundProps } from "./types";

function GhostPropertyCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-[4.5rem] shrink-0 flex-col overflow-hidden rounded-lg border border-secondary/15 bg-card-background shadow-sm sm:w-[5.5rem]",
        className,
      )}
    >
      <div className="aspect-[4/3] bg-page-ghost" />
      <div className="space-y-1.5 p-2">
        <div className="h-2 w-3/4 rounded-full bg-secondary/20" />
        <div className="h-1.5 w-full rounded-full bg-secondary/10" />
        <div className="h-1.5 w-2/3 rounded-full bg-secondary/10" />
      </div>
    </div>
  );
}

function EmptyPropertiesIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[7.5rem] w-auto sm:h-32", className)}
      aria-hidden
    >
      <ellipse
        cx="100"
        cy="118"
        rx="72"
        ry="9"
        className="fill-secondary/15"
      />
      <path
        d="M48 52 L100 28 L152 52 V98 H48 V52 Z"
        className="fill-secondary/20 stroke-secondary"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="58"
        y="58"
        width="84"
        height="40"
        rx="3"
        className="fill-primary-light stroke-secondary/60"
        strokeWidth="1.5"
      />
      <rect
        x="70"
        y="68"
        width="16"
        height="16"
        rx="2"
        className="fill-surface stroke-secondary/40"
        strokeWidth="1.25"
      />
      <rect
        x="94"
        y="68"
        width="16"
        height="16"
        rx="2"
        className="fill-surface stroke-secondary/40"
        strokeWidth="1.25"
      />
      <rect
        x="118"
        y="68"
        width="16"
        height="16"
        rx="2"
        className="fill-surface stroke-secondary/40"
        strokeWidth="1.25"
      />
      <rect
        x="88"
        y="86"
        width="24"
        height="12"
        rx="1.5"
        className="fill-primary/25 stroke-secondary/50"
        strokeWidth="1.25"
      />
      <circle
        cx="148"
        cy="72"
        r="26"
        className="fill-surface stroke-secondary"
        strokeWidth="2.25"
      />
      <path
        d="M162 86 L178 102"
        className="stroke-secondary"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="148"
        cy="72"
        r="14"
        className="stroke-secondary/35"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <path
        d="M142 72 L146 76 L154 68"
        className="stroke-tertiary-dark"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="44" r="5" className="fill-accent stroke-secondary/30" strokeWidth="1" />
      <path
        d="M100 49 V56"
        className="stroke-secondary"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NoDataFound({
  title = "No properties found",
  description = "No properties found for the selected filters. Try adjusting your search criteria or clearing filters to see more results.",
  className,
  actions,
}: NoDataFoundProps) {
  return (
    <Card
      role="status"
      aria-live="polite"
      className={cn(
        "overflow-hidden border border-secondary/10 shadow-sm",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-primary-light px-4 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-35"
          aria-hidden
        >
          <div className="absolute start-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-end gap-2 sm:gap-3">
            <GhostPropertyCard className="-translate-x-1 -rotate-6 opacity-60" />
            <GhostPropertyCard className="relative z-0 opacity-35" />
            <GhostPropertyCard className="translate-x-1 rotate-6 opacity-60" />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-md flex-col items-center">
          <div className="rounded-2xl bg-surface/80 p-4 shadow-sm ring-1 ring-secondary/10 backdrop-blur-sm dark:bg-surface/60">
            <EmptyPropertiesIllustration />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4 pb-8 pt-6 text-center sm:px-8 sm:pb-10">
          <h3 className="text-xl font-bold text-secondary sm:text-2xl">{title}</h3>
          <p
            className={cn(
              "max-w-lg text-sm leading-relaxed text-muted sm:text-base",
              "mt-3",
            )}
          >
            {description}
          </p>

        {actions ? (
          <div
            className={cn(
              "mt-6 flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-3",
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
