import type { HTMLAttributes } from "react";

export const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "info",
  "success",
  "warning",
  "destructive",
  "exclusive",
] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export const BADGE_APPEARANCES = ["soft", "solid"] as const;

/** `soft` = transparent tint; `solid` = filled */
export type BadgeAppearance = (typeof BADGE_APPEARANCES)[number];

export type BadgeOwnProps = {
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeOwnProps;
