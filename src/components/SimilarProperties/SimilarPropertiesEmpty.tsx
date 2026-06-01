import { cn } from "../../lib/cn";
import { textEmptyBodyClasses, textEmptyTitleClasses } from "../../lib/typography";

export interface SimilarPropertiesEmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

export function SimilarPropertiesEmpty({
  title = "No similar properties",
  description = "We could not find other listings similar to this property right now.",
  className,
}: SimilarPropertiesEmptyProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[10.5rem] flex-col items-center justify-center rounded-lg border border-dashed border-secondary/15 bg-surface/60 px-4 py-8 text-center sm:min-h-[12rem] md:min-h-[13.5rem]",
        className,
      )}
    >
      <div
        className="mb-4 flex items-end justify-center gap-2 opacity-70"
        aria-hidden
      >
        <div className="h-14 w-[3.25rem] rounded-md border border-secondary/15 bg-card-background shadow-sm sm:h-16 sm:w-[3.75rem]">
          <div className="aspect-[4/3] rounded-t-md bg-page-ghost" />
          <div className="space-y-1 p-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-secondary/20" />
            <div className="h-1 w-full rounded-full bg-secondary/10" />
          </div>
        </div>
        <div className="h-16 w-[3.75rem] -translate-y-1 rounded-md border border-secondary/20 bg-card-background shadow-sm sm:h-[4.5rem] sm:w-[4.25rem]">
          <div className="aspect-[4/3] rounded-t-md bg-page-ghost" />
          <div className="space-y-1 p-1.5">
            <div className="h-1.5 w-2/3 rounded-full bg-secondary/25" />
            <div className="h-1 w-full rounded-full bg-secondary/15" />
            <div className="h-1 w-4/5 rounded-full bg-secondary/10" />
          </div>
        </div>
        <div className="h-14 w-[3.25rem] rounded-md border border-secondary/15 bg-card-background shadow-sm sm:h-16 sm:w-[3.75rem]">
          <div className="aspect-[4/3] rounded-t-md bg-page-ghost" />
          <div className="space-y-1 p-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-secondary/20" />
            <div className="h-1 w-full rounded-full bg-secondary/10" />
          </div>
        </div>
      </div>
      <h3 className={cn(textEmptyTitleClasses, "text-secondary")}>{title}</h3>
      {description ? (
        <p className={cn("mt-2 max-w-md text-muted", textEmptyBodyClasses)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
