import type { BadgeVariant } from "../ui/Badge";

export const STATUS_COLOR_MAP = {
  draft: "inherit",
  in_progress: "info",
  submitted: "secondary",
  "pending-approval": "warning",
  pending_approval: "warning",
  pending_admin_approval: "warning",
  changes_requested: "accent",
  active: "success",
  approved: "success",
  verified: "success",
  rejected: "danger",
} as const;

export type PropertyListingStatusKey = keyof typeof STATUS_COLOR_MAP;

export type StatusColorScheme =
  (typeof STATUS_COLOR_MAP)[PropertyListingStatusKey];

export const PROPERTY_LISTING_STATUS_KEYS = Object.keys(
  STATUS_COLOR_MAP,
) as PropertyListingStatusKey[];

export interface PropertyListingStatus {
  key: PropertyListingStatusKey;
  label: string;
}

function formatStatusKeyAsLabel(key: string): string {
  return key
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createListingStatus(
  key: PropertyListingStatusKey,
  label?: string,
): PropertyListingStatus {
  return {
    key,
    label: label ?? formatStatusKeyAsLabel(key),
  };
}

export function getPropertyListingStatusColorScheme(
  key: PropertyListingStatusKey,
): StatusColorScheme {
  return STATUS_COLOR_MAP[key];
}

export function statusColorSchemeToBadgeVariant(
  colorScheme: StatusColorScheme,
): BadgeVariant {
  switch (colorScheme) {
    case "inherit":
      return "outline";
    case "info":
      return "info";
    case "secondary":
      return "secondary";
    case "warning":
      return "warning";
    case "accent":
      return "exclusive";
    case "success":
      return "success";
    case "danger":
      return "destructive";
  }
}
