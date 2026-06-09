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
 * Moderate mobile scale; full scale from `sm` up; slightly roomier from `lg` up.
 * Component `size` props (`sm` | `md` | `lg`) are unchanged — viewport width drives density.
 */
export type UiSizeTier = "sm" | "md" | "lg";

/** Shared outer height for buttons, inputs, selects, toggles (mobile → sm+ → lg+). */
const controlHeightClasses: Record<UiSizeTier, string> = {
  sm: "h-8 sm:h-9 lg:h-10",
  md: "h-9 sm:h-11 lg:h-12",
  lg: "h-10 sm:h-12 lg:h-14",
};

const controlPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-2 sm:px-3 lg:px-3.5",
  md: "px-2.5 sm:px-4 lg:px-5",
  lg: "px-3 sm:px-5 lg:px-6",
};

const controlGapClasses: Record<UiSizeTier, string> = {
  sm: "gap-1 sm:gap-1.5 lg:gap-2",
  md: "gap-1 sm:gap-2 lg:gap-2.5",
  lg: "gap-1.5 sm:gap-2 lg:gap-3",
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
  sm: "size-3.5 sm:size-4 lg:size-4",
  md: "size-3.5 sm:size-4 lg:size-5",
  lg: "size-4 sm:size-5 lg:size-5",
};

/** Glyph scale inside `IconButton` (alias of `buttonIconSizeClasses`). */
export const iconButtonIconSizeClasses = buttonIconSizeClasses;

/** Square buttons — side length matches shared control height. */
export const iconButtonSizeClasses: Record<UiSizeTier, string> = {
  sm: "size-8 shrink-0 !p-0 sm:size-9 lg:size-10",
  md: "size-9 shrink-0 !p-0 sm:size-11 lg:size-12",
  lg: "size-10 shrink-0 !p-0 sm:size-12 lg:size-14",
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

/** Start padding when a leading icon is placed before the trigger (e.g. sort filter). */
export const selectTriggerLeadingIconPaddingClasses: Record<UiSizeTier, string> = {
  sm: "ps-9 sm:ps-10 lg:ps-11",
  md: "ps-10 sm:ps-11 lg:ps-12",
  lg: "ps-11 sm:ps-12 lg:ps-14",
};

/** Position classes for an absolutely placed leading icon beside the trigger. */
export const selectLeadingIconPositionClasses: Record<UiSizeTier, string> = {
  sm: "start-2 top-1/2 size-3.5 -translate-y-1/2 sm:start-2.5 sm:size-4 lg:start-3",
  md: "start-2.5 top-1/2 size-3.5 -translate-y-1/2 sm:start-3 sm:size-4 lg:start-3.5 lg:size-4",
  lg: "start-3 top-1/2 size-4 -translate-y-1/2 sm:size-4 lg:start-3.5 lg:size-5",
};

export const selectTriggerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    "px-2 pe-8 sm:px-3 sm:pe-9 lg:pe-10",
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    controlHeightClasses.md,
    "px-2.5 pe-9 sm:px-4 sm:pe-10 lg:pe-11",
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    "px-3 pe-10 sm:px-5 sm:pe-11 lg:pe-12",
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const textareaSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    "min-h-[3.5rem] py-1.5 sm:min-h-[4.5rem] sm:py-2 lg:min-h-[5rem] lg:py-2.5",
    controlPaddingClasses.sm,
    controlTextClasses.sm,
  ),
  md: cnTier(
    "min-h-[4rem] py-1.5 sm:min-h-[5.5rem] sm:py-2.5 lg:min-h-[6rem] lg:py-3",
    controlPaddingClasses.md,
    controlTextClasses.md,
  ),
  lg: cnTier(
    "min-h-[4.5rem] py-2 sm:min-h-[6.5rem] sm:py-3 lg:min-h-[7rem] lg:py-3.5",
    controlPaddingClasses.lg,
    controlTextClasses.lg,
  ),
};

/** Toggle outer shell — height only; pair with track inset classes. */
export const toggleShellSizeClasses: Record<UiSizeTier, string> = {
  sm: controlHeightClasses.sm,
  md: controlHeightClasses.md,
  lg: controlHeightClasses.lg,
};

/** Inner track inset for bordered `solid` / `outline` variants. */
export const toggleBorderedTrackInsetClasses: Record<UiSizeTier, string> = {
  sm: "p-1",
  md: "p-1",
  lg: "p-1 lg:p-1.5",
};

/** Inner track inset for `ghost` variant. */
export const toggleTrackInsetClasses: Record<UiSizeTier, string> = {
  sm: "p-0.5 sm:p-1",
  md: "p-0.5 sm:p-1",
  lg: "p-0.5 sm:p-1 lg:p-1.5",
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

/** @deprecated Use `toggleShellSizeClasses` + track inset classes. */
export const toggleContainerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    toggleShellSizeClasses.sm,
    toggleBorderedTrackInsetClasses.sm,
  ),
  md: cnTier(
    toggleShellSizeClasses.md,
    toggleBorderedTrackInsetClasses.md,
  ),
  lg: cnTier(
    toggleShellSizeClasses.lg,
    toggleBorderedTrackInsetClasses.lg,
  ),
};

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
  sm: cnTier("gap-0.5 sm:gap-1 lg:gap-1", controlTextClasses.sm),
  md: cnTier("gap-1 sm:gap-1.5 lg:gap-2", controlTextClasses.md),
  lg: cnTier("gap-1.5 sm:gap-2 lg:gap-2.5", controlTextClasses.lg),
};

export const linkIconSizeClasses = buttonIconSizeClasses;

export const budgetShellSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, controlTextClasses.sm),
  md: cnTier(controlHeightClasses.md, controlTextClasses.md),
  lg: cnTier(controlHeightClasses.lg, controlTextClasses.lg),
};

export const budgetCurrencyPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-1.5 sm:px-2.5 lg:px-3",
  md: "px-2 sm:px-3 lg:px-4",
  lg: "px-2.5 sm:px-4 lg:px-5",
};

export const budgetTriggerPaddingClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlGapClasses.sm, "px-1.5 sm:px-2.5 lg:px-3"),
  md: cnTier(controlGapClasses.md, "px-2 sm:px-3 lg:px-4"),
  lg: cnTier(controlGapClasses.lg, "px-2.5 sm:px-4 lg:px-5"),
};

export const dropdownPanelSizeClasses = cnTier(
  "p-1 sm:p-2 lg:p-2.5",
  textDropdownPanelClasses,
);

export const dropdownOptionSizeClasses = cnTier(
  "px-2 py-1 sm:px-3 sm:py-1.5 lg:px-3.5 lg:py-2",
  textDropdownOptionClasses,
);

export const selectOptionSizeClasses = dropdownOptionSizeClasses;

export {
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
} from "../../lib/typography";

/** Phone input — outer shell height + horizontal padding. */
export const phoneInputShellSizeClasses = cnTier(
  controlHeightClasses.md,
  controlGapClasses.md,
  "px-0",
  "rounded-xl",
);

/** Inset track wrapping country segment + divider + number field. */
export const phoneInputTrackClasses = cnTier(
  "flex min-w-0 flex-1 items-stretch overflow-hidden rounded-[inherit]",
  "p-0.5 sm:p-1 lg:p-1",
);

/** Country trigger segment — solid / ghost filled variants. */
export const phoneInputCountrySegmentSolidClasses = cnTier(
  "inline-flex shrink-0 items-center justify-center rounded-lg",
  controlPaddingClasses.sm,
  controlGapClasses.sm,
  controlTextClasses.sm,
);

/** Country segment on `outline` — padding only, no fill. */
export const phoneInputCountrySegmentGhostClasses = cnTier(
  "inline-flex shrink-0 items-center justify-center",
  controlPaddingClasses.sm,
  controlGapClasses.sm,
  controlTextClasses.sm,
);

export const phoneInputDividerClasses =
  "w-px shrink-0 self-stretch bg-secondary/20";

export const phoneInputFieldPaddingClasses = cnTier(
  controlPaddingClasses.md,
  controlTextClasses.md,
);

export const phoneInputTextSizeClasses = controlTextClasses.md;

export const phoneInputSearchSizeClasses = cnTier(
  controlHeightClasses.sm,
  "w-full rounded-lg border border-secondary-light bg-page py-0 ps-8 pe-2 sm:ps-9 sm:pe-3 lg:ps-10",
  controlTextClasses.sm,
);

export const phoneInputListItemSizeClasses = cnTier(
  "flex w-full items-center text-start",
  controlPaddingClasses.sm,
  controlGapClasses.sm,
  controlTextClasses.sm,
);

/** Property cards: `sm` tier below `sm` viewport; `fromSm` tier from `sm` breakpoint up. */
const cardListButtonHeightFromSm: Record<UiSizeTier, string> = {
  sm: "sm:h-9 lg:h-10",
  md: "sm:h-11 lg:h-12",
  lg: "sm:h-12 lg:h-14",
};

const cardListButtonPaddingFromSm: Record<UiSizeTier, string> = {
  sm: "sm:px-3 lg:px-3.5",
  md: "sm:px-4 lg:px-5",
  lg: "sm:px-5 lg:px-6",
};

const cardListButtonGapFromSm: Record<UiSizeTier, string> = {
  sm: "sm:gap-1.5 lg:gap-2",
  md: "sm:gap-2 lg:gap-2.5",
  lg: "sm:gap-2 lg:gap-3",
};

const cardListButtonTextFromSm: Record<UiSizeTier, string> = {
  sm: "sm:text-sm sm:leading-normal",
  md: "sm:text-sm sm:leading-normal",
  lg: "sm:text-sm sm:leading-normal lg:text-base lg:leading-normal",
};

const cardListIconButtonSizeFromSm: Record<UiSizeTier, string> = {
  sm: "sm:size-9 lg:size-10",
  md: "sm:size-11 lg:size-12",
  lg: "sm:size-12 lg:size-14",
};

const cardListIconButtonGlyphFromSm: Record<UiSizeTier, string> = {
  sm: "sm:[&_svg]:size-4 lg:[&_svg]:size-4",
  md: "sm:[&_svg]:size-4 lg:[&_svg]:size-5",
  lg: "sm:[&_svg]:size-5 lg:[&_svg]:size-5",
};

/** Pair with `Button` / `IconButton` `size="sm"`; pass `className` to apply responsive scale. */
export function cardListButtonSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier(
    "h-8 px-2 gap-1 text-[11px] leading-none font-medium",
    cardListButtonHeightFromSm[fromSm],
    cardListButtonPaddingFromSm[fromSm],
    cardListButtonGapFromSm[fromSm],
    cardListButtonTextFromSm[fromSm],
  );
}

export function cardListIconButtonSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier("size-8 shrink-0 !p-0", cardListIconButtonSizeFromSm[fromSm]);
}

export function cardListIconButtonGlyphClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier("[&_svg]:size-3.5", cardListIconButtonGlyphFromSm[fromSm]);
}

/** PropertyView: `md`-tier mobile base; `fromSm` tier from `sm` breakpoint up. */
const propertyViewButtonHeightFromSm: Record<UiSizeTier, string> = {
  sm: "sm:h-9 lg:h-10",
  md: "sm:h-11 lg:h-12",
  lg: "sm:h-12 lg:h-14",
};

const propertyViewButtonPaddingFromSm: Record<UiSizeTier, string> = {
  sm: "sm:px-3 lg:px-3.5",
  md: "sm:px-4 lg:px-5",
  lg: "sm:px-5 lg:px-6",
};

const propertyViewButtonGapFromSm: Record<UiSizeTier, string> = {
  sm: "sm:gap-1.5 lg:gap-2",
  md: "sm:gap-2 lg:gap-2.5",
  lg: "sm:gap-2 lg:gap-3",
};

const propertyViewButtonTextFromSm: Record<UiSizeTier, string> = {
  sm: "sm:text-sm sm:leading-normal",
  md: "sm:text-sm sm:leading-normal",
  lg: "sm:text-sm sm:leading-normal lg:text-base lg:leading-normal",
};

const propertyViewIconButtonSizeFromSm: Record<UiSizeTier, string> = {
  sm: "sm:size-9 lg:size-10",
  md: "sm:size-11 lg:size-12",
  lg: "sm:size-12 lg:size-14",
};

const propertyViewIconButtonGlyphFromSm: Record<UiSizeTier, string> = {
  sm: "sm:[&_svg]:size-4 lg:[&_svg]:size-4",
  md: "sm:[&_svg]:size-4 lg:[&_svg]:size-5",
  lg: "sm:[&_svg]:size-5 lg:[&_svg]:size-5",
};

const heroCarouselShellHeightFromSm: Record<UiSizeTier, string> = {
  sm: "sm:h-9 lg:h-10",
  md: "sm:h-11 lg:h-12",
  lg: "sm:h-12 lg:h-14",
};

const heroCarouselShellPaddingFromSm: Record<UiSizeTier, string> = {
  sm: "sm:px-3 lg:px-3.5",
  md: "sm:px-4 lg:px-5",
  lg: "sm:px-5 lg:px-6",
};

const heroCarouselShellGapFromSm: Record<UiSizeTier, string> = {
  sm: "sm:gap-1.5 lg:gap-2",
  md: "sm:gap-2 lg:gap-2.5",
  lg: "sm:gap-2 lg:gap-3",
};

const heroCarouselControlIconFromSm: Record<UiSizeTier, string> = {
  sm: "sm:size-4 lg:size-4",
  md: "sm:size-4 lg:size-5",
  lg: "sm:size-5 lg:size-5",
};

/** Pair with `Button` `size="md"`; pass `className` to scale from `sm` up. */
export function propertyViewButtonSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier(
    "h-9 px-2.5 gap-1 text-sm leading-normal font-medium",
    propertyViewButtonHeightFromSm[fromSm],
    propertyViewButtonPaddingFromSm[fromSm],
    propertyViewButtonGapFromSm[fromSm],
    propertyViewButtonTextFromSm[fromSm],
  );
}

/** Pair with `IconButton` `size="md"`; pass `className` to scale from `sm` up. */
export function propertyViewIconButtonSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier(
    "size-9 shrink-0 !p-0",
    propertyViewIconButtonSizeFromSm[fromSm],
  );
}

export function propertyViewIconButtonGlyphClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier("[&_svg]:size-3.5", propertyViewIconButtonGlyphFromSm[fromSm]);
}

export function heroCarouselShellSizeClassesFrom(fromSm: UiSizeTier = "md"): string {
  return cnTier(
    "flex min-w-0 items-center justify-between rounded-full",
    "h-9 px-2.5 gap-1",
    heroCarouselShellHeightFromSm[fromSm],
    heroCarouselShellPaddingFromSm[fromSm],
    heroCarouselShellGapFromSm[fromSm],
  );
}

/** Carousel bar icon buttons — compact mobile base; `fromSm` from `sm` up. */
export function heroCarouselControlButtonSizeClassesFrom(
  fromSm: UiSizeTier = "md",
): string {
  return cardListIconButtonSizeClasses(fromSm);
}

export function heroCarouselControlIconSizeClassesFrom(
  fromSm: UiSizeTier = "md",
): string {
  return cnTier("size-3.5", heroCarouselControlIconFromSm[fromSm]);
}

const cardListSelectPaddingEndFromSm: Record<UiSizeTier, string> = {
  sm: "sm:pe-9 lg:pe-10",
  md: "sm:pe-10 lg:pe-11",
  lg: "sm:pe-11 lg:pe-12",
};

const cardListSelectLeadingPaddingFromSm: Record<UiSizeTier, string> = {
  sm: "sm:ps-10 lg:ps-11",
  md: "sm:ps-11 lg:ps-12",
  lg: "sm:ps-12 lg:ps-14",
};

/** Pair with `SelectDropdown` `size="md"` + `triggerClassName`. */
export function cardListSelectTriggerSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier(
    "h-9 px-2.5 pe-9 gap-1 text-sm leading-normal font-medium",
    propertyViewButtonHeightFromSm[fromSm],
    propertyViewButtonPaddingFromSm[fromSm],
    cardListSelectPaddingEndFromSm[fromSm],
    propertyViewButtonGapFromSm[fromSm],
    propertyViewButtonTextFromSm[fromSm],
  );
}

export function cardListSelectTriggerLeadingPaddingClasses(
  fromSm: UiSizeTier = "md",
): string {
  return cnTier("ps-10", cardListSelectLeadingPaddingFromSm[fromSm]);
}

/** Pair with `ToggleButton` `size="md"` + `className` on the shell. */
export function cardListToggleShellSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier("h-9", propertyViewButtonHeightFromSm[fromSm]);
}

/** Pair with `ToggleButton` `segmentClassName`. */
export function cardListToggleSegmentSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier(
    "h-full min-h-0 px-2.5 gap-1 text-sm leading-normal font-medium",
    propertyViewButtonPaddingFromSm[fromSm],
    propertyViewButtonGapFromSm[fromSm],
    propertyViewButtonTextFromSm[fromSm],
  );
}

/** Pagination page / nav buttons — `md` mobile base; `fromSm` from `sm` up. */
export function cardListPaginationButtonSizeClasses(fromSm: UiSizeTier = "md"): string {
  return propertyViewIconButtonSizeClasses(fromSm);
}

export function cardListPaginationIconSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier("size-3.5", heroCarouselControlIconFromSm[fromSm]);
}

const tablePaginationButtonFromSm: Record<UiSizeTier, string> = {
  sm: "size-7 sm:size-8",
  md: "size-7 sm:size-8 lg:size-9",
  lg: "size-8 sm:size-9 lg:size-10",
};

const tablePaginationIconFromSm: Record<UiSizeTier, string> = {
  sm: "sm:[&_svg]:size-3.5",
  md: "sm:[&_svg]:size-3.5 lg:[&_svg]:size-4",
  lg: "sm:[&_svg]:size-4 lg:[&_svg]:size-4",
};

const tablePaginationSelectTriggerFromSm: Record<UiSizeTier, string> = {
  sm: "h-7 min-h-7 px-2 pe-7 text-xs sm:h-8 sm:min-h-8 sm:px-2.5 sm:pe-8",
  md: "h-7 min-h-7 px-2 pe-7 text-xs sm:h-8 sm:min-h-8 sm:px-2.5 sm:pe-8 lg:h-9 lg:min-h-9 lg:px-3 lg:pe-9",
  lg: "h-8 min-h-8 px-2.5 pe-8 text-xs sm:h-9 sm:min-h-9 sm:px-3 sm:pe-9 lg:h-10 lg:min-h-10",
};

/** Compact pagination controls for table footers. */
export function tablePaginationButtonSizeClasses(fromSm: UiSizeTier = "md"): string {
  return tablePaginationButtonFromSm[fromSm];
}

export function tablePaginationIconSizeClasses(fromSm: UiSizeTier = "md"): string {
  return cnTier("[&_svg]:size-4", tablePaginationIconFromSm[fromSm]);
}

export function tablePaginationSelectTriggerSizeClasses(fromSm: UiSizeTier = "md"): string {
  return tablePaginationSelectTriggerFromSm[fromSm];
}

function cnTier(...classes: string[]) {
  return classes.join(" ");
}
