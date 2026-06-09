import type { ReactNode } from "react";
import type { PropertyListing } from "../PropertyCardList/types";

export type PropertyTableRowActionTone = "default" | "danger";

export type PropertyTableRowAction = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick: (listing: PropertyListing) => void;
  tone?: PropertyTableRowActionTone;
  hidden?: boolean | ((listing: PropertyListing) => boolean);
  disabled?: boolean | ((listing: PropertyListing) => boolean);
  loading?: boolean | ((listing: PropertyListing) => boolean);
  loadingLabel?: ReactNode;
};

export type PropertyTableRowActionsInput =
  | PropertyTableRowAction[]
  | ((listing: PropertyListing) => PropertyTableRowAction[]);

export function resolvePropertyTableRowActions(
  listing: PropertyListing,
  rowActions?: PropertyTableRowActionsInput,
): PropertyTableRowAction[] {
  if (!rowActions) {
    return [];
  }

  const items =
    typeof rowActions === "function" ? rowActions(listing) : rowActions;

  return items.filter((action) => {
    if (action.hidden == null) {
      return true;
    }
    return typeof action.hidden === "function"
      ? !action.hidden(listing)
      : !action.hidden;
  });
}

export function isPropertyTableRowActionLoading(
  listing: PropertyListing,
  action: PropertyTableRowAction,
): boolean {
  if (action.loading == null) {
    return false;
  }
  return typeof action.loading === "function"
    ? action.loading(listing)
    : action.loading;
}

export function isPropertyTableRowActionDisabled(
  listing: PropertyListing,
  action: PropertyTableRowAction,
): boolean {
  if (isPropertyTableRowActionLoading(listing, action)) {
    return true;
  }
  if (action.disabled == null) {
    return false;
  }
  return typeof action.disabled === "function"
    ? action.disabled(listing)
    : action.disabled;
}
