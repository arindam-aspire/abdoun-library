import {
  controlTextClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
  textDropdownOptionClasses,
  textDropdownPanelClasses,
} from "../../lib/typography";

/**
 * Mobile-first sizing for UI controls.
 * Buttons and form fields share the same height scale.
 * Default (below `sm`): compact. From `sm` up: full scale.
 */
export type UiSizeTier = "sm" | "md" | "lg";

/** Shared outer height for buttons, inputs, selects, toggles (mobile → sm+). */
const controlHeightClasses: Record<UiSizeTier, string> = {
  sm: "h-7 sm:h-9",
  md: "h-8 sm:h-11",
  lg: "h-9 sm:h-12",
};

const controlPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-2 sm:px-3",
  md: "px-2.5 sm:px-4",
  lg: "px-3 sm:px-5",
};

const controlGapClasses: Record<UiSizeTier, string> = {
  sm: "gap-1 sm:gap-1.5",
  md: "gap-1 sm:gap-2",
  lg: "gap-1.5 sm:gap-2",
};

export const buttonSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    controlPaddingClasses.sm,
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    controlHeightClasses.md,
    controlPaddingClasses.md,
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    controlPaddingClasses.lg,
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const buttonIconSizeClasses: Record<UiSizeTier, string> = {
  sm: "size-3 sm:size-3.5",
  md: "size-3 sm:size-4",
  lg: "size-3.5 sm:size-5",
};

/** Glyph scale inside `IconButton` (alias of `buttonIconSizeClasses`). */
export const iconButtonIconSizeClasses = buttonIconSizeClasses;

/** Square buttons — side length matches shared control height. */
export const iconButtonSizeClasses: Record<UiSizeTier, string> = {
  sm: "size-7 shrink-0 !p-0 sm:size-9",
  md: "size-8 shrink-0 !p-0 sm:size-11",
  lg: "size-9 shrink-0 !p-0 sm:size-12",
};

export const fieldControlSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    controlPaddingClasses.sm,
    controlGapClasses.sm,
    controlTextClasses.sm,
  ),
  md: cnTier(
    controlHeightClasses.md,
    controlPaddingClasses.md,
    controlGapClasses.md,
    controlTextClasses.md,
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    controlPaddingClasses.lg,
    controlGapClasses.lg,
    controlTextClasses.lg,
  ),
};

export const fieldIconSizeClasses = buttonIconSizeClasses;

/** Same height as fields; extra end padding for chevron. */
/** Start padding when a leading icon is placed before the trigger (e.g. sort filter). */
export const selectTriggerLeadingIconPaddingClasses: Record<UiSizeTier, string> = {
  sm: "ps-8 sm:ps-9",
  md: "ps-9 sm:ps-10",
  lg: "ps-10 sm:ps-11",
};

/** Position classes for an absolutely placed leading icon beside the trigger. */
export const selectLeadingIconPositionClasses: Record<UiSizeTier, string> = {
  sm: "start-2 top-1/2 size-3 -translate-y-1/2 sm:start-2.5 sm:size-3.5",
  md: "start-2.5 top-1/2 size-3 -translate-y-1/2 sm:start-3 sm:size-3.5",
  lg: "start-3 top-1/2 size-3.5 -translate-y-1/2 sm:size-4",
};

export const selectTriggerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    "px-2 pe-7 sm:px-3 sm:pe-9",
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium sm:font-medium",
  ),
  md: cnTier(
    controlHeightClasses.md,
    "px-2.5 pe-8 sm:px-4 sm:pe-10",
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    "px-3 pe-9 sm:px-5 sm:pe-11",
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const textareaSizeClasses: Record<UiSizeTier, string> = {
  sm: "min-h-[3.25rem] px-2 py-1.5 text-[11px] sm:min-h-[4.5rem] sm:px-3 sm:py-2 sm:text-sm",
  md: "min-h-[3.75rem] px-2.5 py-1.5 text-xs sm:min-h-[5.5rem] sm:px-4 sm:py-2.5 sm:text-sm",
  lg: "min-h-[4.25rem] px-3 py-2 text-xs sm:min-h-[6.5rem] sm:px-5 sm:py-3 sm:text-base",
};

export const toggleContainerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, "p-px sm:p-0.5"),
  md: cnTier(controlHeightClasses.md, "p-px sm:p-1"),
  lg: cnTier(controlHeightClasses.lg, "p-px sm:p-1"),
};

export const toggleSegmentSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    "h-full min-h-0",
    controlPaddingClasses.sm,
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    "h-full min-h-0",
    controlPaddingClasses.md,
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    "h-full min-h-0",
    controlPaddingClasses.lg,
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const toggleIconSizeClasses = buttonIconSizeClasses;

/** Hero image carousel bar (PropertyView). */
export const heroCarouselShellSizeClasses = cnTier(
  "flex min-w-0 items-center justify-between rounded-full",
  controlHeightClasses.md,
  controlPaddingClasses.md,
  controlGapClasses.md,
);

/** Prev / next / pause controls inside the carousel bar. */
export const heroCarouselControlButtonSizeClasses = iconButtonSizeClasses.sm;

export const heroCarouselControlIconSizeClasses = buttonIconSizeClasses.sm;

export const linkSizeClasses: Record<UiSizeTier, string> = {
  sm: "gap-0.5 text-[11px] sm:gap-1 sm:text-sm",
  md: "gap-1 text-xs sm:gap-1.5 sm:text-sm",
  lg: "gap-1.5 text-xs sm:gap-2 sm:text-base",
};

export const linkIconSizeClasses = buttonIconSizeClasses;

export const budgetShellSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, controlTextClasses.sm),
  md: cnTier(controlHeightClasses.md, controlTextClasses.md),
  lg: cnTier(controlHeightClasses.lg, controlTextClasses.lg),
};

export const budgetCurrencyPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-1.5 sm:px-2.5",
  md: "px-2 sm:px-3",
  lg: "px-2.5 sm:px-4",
};

export const budgetTriggerPaddingClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlGapClasses.sm, "px-1.5 sm:px-2.5"),
  md: cnTier(controlGapClasses.md, "px-2 sm:px-3"),
  lg: cnTier(controlGapClasses.lg, "px-2.5 sm:px-4"),
};

export const dropdownPanelSizeClasses = cnTier("p-1 sm:p-2", textDropdownPanelClasses);

export const dropdownOptionSizeClasses = cnTier(
  "px-2 py-1 sm:px-3 sm:py-1.5",
  textDropdownOptionClasses,
);

export const selectOptionSizeClasses = dropdownOptionSizeClasses;

export {
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
} from "../../lib/typography";

export const phoneInputShellSizeClasses = cnTier(
  controlHeightClasses.md,
  controlGapClasses.md,
  controlPaddingClasses.md,
  "rounded-xl",
);

export const phoneInputTextSizeClasses = controlTextClasses.md;

export const phoneInputSearchSizeClasses = cnTier(
  controlHeightClasses.sm,
  "w-full rounded-lg border border-secondary-light bg-page py-0 ps-7 pe-2 sm:ps-9 sm:pe-3",
  controlTextClasses.sm,
);

export const phoneInputListItemSizeClasses = cnTier(
  "flex w-full items-center text-start",
  controlPaddingClasses.sm,
  controlGapClasses.sm,
  controlTextClasses.sm,
);

function cnTier(...classes: string[]) {
  return classes.join(" ");
}
