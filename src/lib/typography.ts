/**
 * Mobile-first typography for the design system and property UI.
 * Compact below `sm`; scales up from `sm` / `md` breakpoints.
 */

/** Control-tier text (buttons, inputs, selects) — re-exported for responsiveSizes. */
export const controlTextClasses = {
  sm: "text-[11px] leading-none sm:text-sm sm:leading-normal",
  md: "text-xs leading-none sm:text-sm sm:leading-normal",
  lg: "text-xs leading-none sm:text-base sm:leading-normal",
} as const;

export const fieldLabelSizeClasses =
  "mb-1 block text-[11px] font-medium text-text sm:mb-1.5 sm:text-sm";

export const fieldErrorSizeClasses =
  "mt-1 text-[11px] text-danger sm:mt-1.5 sm:text-sm";

export const fieldHintSizeClasses =
  "mt-1 text-[11px] text-muted sm:mt-1.5 sm:text-sm";

/** Badge, gallery pill, micro labels on imagery */
export const textBadgeClasses =
  "text-[11px] font-semibold sm:text-xs";

export const textCaptionClasses =
  "text-[10px] font-medium tracking-[0.14em] uppercase sm:text-[11px]";

/** Tab triggers */
export const textTabTriggerClasses =
  "text-xs font-medium sm:text-sm";

/** Body copy */
export const textBodySmClasses =
  "text-xs leading-relaxed sm:text-sm sm:leading-relaxed";

export const textBodyClasses = textBodySmClasses;

export const textBodyLgClasses =
  "text-sm leading-relaxed sm:text-base sm:leading-relaxed";

export const textBodyTightClasses =
  "text-xs leading-tight sm:text-sm sm:leading-tight";

/** Muted labels and meta */
export const textMetaClasses = "text-[11px] text-muted sm:text-xs";

export const textMetaMediumClasses =
  "text-xs font-medium text-muted sm:text-sm";

/** Section eyebrows */
export const textEyebrowClasses =
  "text-[11px] font-semibold tracking-[0.12em] uppercase sm:text-xs";

export const textSectionTitleClasses =
  "text-xs font-bold tracking-[0.08em] uppercase sm:text-sm";

/** Card & list */
export const textCardTitleClasses =
  "text-base font-bold leading-tight sm:text-lg md:text-xl";

export const textCardTitleSnugClasses =
  "text-base font-bold leading-snug sm:text-lg md:text-xl";

export const textCardPriceClasses =
  "text-base font-bold sm:text-lg md:text-xl";

/** Page chrome */
export const textPageTitleClasses = "text-lg font-bold sm:text-xl";

export const textPageTitleMetaClasses =
  "text-xs font-normal text-muted sm:text-base";

export const textToolbarCountClasses = "text-xs text-muted sm:text-sm";

/** Property detail hero */
export const textHeroTitleClasses =
  "text-xl font-bold leading-tight sm:text-2xl md:text-3xl";

export const textHeroSubtitleClasses =
  "text-xs text-page/90 sm:text-sm md:text-base";

export const textHeroEyebrowClasses =
  "text-[11px] font-bold tracking-[0.14em] uppercase sm:text-xs";

export const textHeroOnImageClasses =
  "text-xs font-bold tracking-tight sm:text-sm";

export const textHeroOverlayTitleClasses =
  "text-sm font-semibold sm:text-base md:text-lg";

/** Display price */
export const textDisplayPriceClasses =
  "text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl";

/** Stats (overview grid) */
export const textStatLabelClasses = "text-[11px] text-muted sm:text-xs";

export const textStatValueClasses = "text-base font-bold sm:text-lg";

export const textStatValueLgClasses = "text-base font-bold sm:text-lg";

/** Empty states */
export const textEmptyTitleClasses = "text-lg font-bold sm:text-xl md:text-2xl";

export const textEmptyHeadingClasses =
  "text-base font-semibold sm:text-lg";

export const textEmptyBodyClasses = textBodyLgClasses;

/** People / contacts */
export const textPersonNameClasses =
  "text-xs font-semibold leading-tight sm:text-sm";

export const textPersonDetailClasses =
  "text-xs leading-tight text-text/65 sm:text-sm";

export const textAvatarInitialClasses =
  "text-xs font-semibold sm:text-sm";

export const textOwnerChipClasses =
  "text-xs leading-tight sm:text-sm";

/** Feature list item */
export const textFeatureItemClasses =
  "text-xs font-medium sm:text-sm";

/** Inline actions (links, buttons on cards) */
export const textActionClasses =
  "text-xs font-medium sm:text-sm";

export const textLinkEmphasisClasses =
  "text-xs font-semibold sm:text-sm";

/** Overlay / lightbox chrome */
export const textOverlayButtonClasses =
  "text-xs font-medium sm:text-sm";

export const textOverlayBodyClasses = "text-xs sm:text-sm md:text-base";

/** Carousel counter */
export const textCarouselCounterClasses = "text-xs font-bold italic sm:text-sm";

/** Pagination */
export const textPaginationSummaryClasses =
  "text-xs text-muted sm:text-sm";

export const textPaginationLabelClasses = textPaginationSummaryClasses;

/** Dropdown panels (non-control) */
export const textDropdownPanelClasses =
  "text-[11px] leading-5 sm:text-sm";

export const textDropdownOptionClasses =
  "text-[11px] leading-5 sm:text-sm";
