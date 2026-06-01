export const UI_FIELD_VARIANTS = ["outline", "ghost", "clear"] as const;

export type UiFieldVariant = (typeof UI_FIELD_VARIANTS)[number];

export const UI_CONTROL_SIZES = ["sm", "md", "lg"] as const;

export type UiControlSize = (typeof UI_CONTROL_SIZES)[number];

/** @alias UiControlSize — shared mobile-first control scale */
export type { UiSizeTier } from "./controlSizes";
