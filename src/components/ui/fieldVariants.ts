import { cn } from "../../lib/cn";

/** Matches Button `color="inherit"` + `variant="outline"` for form controls. */
export const inheritOutlineVariantClasses = cn(
  "border border-secondary/15 bg-surface text-text shadow-none",
  "hover:bg-page",
);

export const inheritOutlineFocusWithinClasses = cn(
  "focus-within:border-secondary/15 focus-within:bg-page focus-within:ring-2 focus-within:ring-secondary/40",
);

export const inheritOutlineFocusVisibleClasses = cn(
  "focus-visible:border-secondary/15 focus-visible:bg-page focus-visible:ring-2 focus-visible:ring-secondary/40",
);

export const inheritOutlineDataHoverClasses = "data-hover:bg-page";
