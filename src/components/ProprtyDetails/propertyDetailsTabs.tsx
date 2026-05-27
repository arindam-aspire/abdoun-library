"use client";

import { FileText, Info, MapPin, Sparkles } from "lucide-react";
import type { PropertyDetailsRole, PropertyDetailsTabOption } from "./types";

const TAB_ICON_CLASS = "size-4";

const OVERVIEW_FEATURES_TABS: PropertyDetailsTabOption[] = [
  {
    value: "overview",
    label: "Overview",
    icon: <Info className={TAB_ICON_CLASS} aria-hidden />,
  },
  {
    value: "features",
    label: "Features",
    icon: <Sparkles className={TAB_ICON_CLASS} aria-hidden />,
  },
];

const OWNER_AGENT_TABS: PropertyDetailsTabOption[] = [
  {
    value: "locations",
    label: "Locations",
    icon: <MapPin className={TAB_ICON_CLASS} aria-hidden />,
  },
  {
    value: "documents",
    label: "Documents",
    icon: <FileText className={TAB_ICON_CLASS} aria-hidden />,
  },
];

export function canViewRestrictedPropertyDetailsTabs(
  role?: PropertyDetailsRole,
): boolean {
  return role === "owner" || role === "agent";
}

export function getPropertyDetailsTabOptions(
  role?: PropertyDetailsRole,
): PropertyDetailsTabOption[] {
  if (canViewRestrictedPropertyDetailsTabs(role)) {
    return [...OVERVIEW_FEATURES_TABS, ...OWNER_AGENT_TABS];
  }

  return OVERVIEW_FEATURES_TABS;
}

/** Overview + Features only (public / registered user). */
export const DEFAULT_PROPERTY_DETAILS_TAB_OPTIONS = OVERVIEW_FEATURES_TABS;
