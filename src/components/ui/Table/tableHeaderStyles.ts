/** Desktop and transposed header row surface. */
export const tableHeaderRowClassName = "text-muted";

/** Solid background on every header cell (incl. pinned / scrollable headers). */
export const tableHeaderCellClassName = "bg-surface";

/** Shared header cell padding — taller from `sm` through `lg`. */
export const tableHeaderCellPaddingClassName =
  "px-3 py-3 sm:px-4 sm:py-4 lg:px-4 lg:py-4";

/** Pinned label column on mobile transposed layout (matches desktop header cells). */
export const tablePinnedHeaderColumnClassName = tableHeaderCellClassName;
