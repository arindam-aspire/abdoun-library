import { TableProperties } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textMetaClasses } from "../../lib/typography";

export type TableNoDataFoundContent = {
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export type TableNoDataFoundProps = TableNoDataFoundContent & {
  className?: string;
};

export function TableNoDataFound({
  title = "No properties found",
  description = "Try adjusting your filters or search terms to find matching listings.",
  actions,
  className,
}: TableNoDataFoundProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16",
        className,
      )}
    >
      <div
        className="mb-4 inline-flex size-12 items-center justify-center rounded-full border border-secondary/15 bg-page text-muted sm:size-14"
        aria-hidden
      >
        <TableProperties className="size-5 sm:size-6" />
      </div>

      <p className={cn(textMetaClasses, "font-medium uppercase tracking-wide text-muted")}>
        0 results
      </p>

      <h3 className={cn("mt-2 text-base font-semibold text-text sm:text-lg")}>
        {title}
      </h3>

      <p
        className={cn(
          "mt-2 max-w-md text-balance text-muted",
          textBodySmClasses,
        )}
      >
        {description}
      </p>

      {actions ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
