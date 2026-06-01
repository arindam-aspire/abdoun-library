import type { MouseEvent } from "react";
import type { PropertyListing } from "../PropertyCardList/types";

/** Prevent card-level `onClick` when activating nested controls. */
export function stopCardClickPropagation(event: MouseEvent): void {
  event.stopPropagation();
}

export function runCardControlAction(event: MouseEvent, action: () => void): void {
  stopCardClickPropagation(event);
  action();
}

export function runCardListingAction(
  event: MouseEvent,
  handler: ((propertyDetails: PropertyListing) => void) | undefined,
  propertyDetails: PropertyListing,
): void {
  stopCardClickPropagation(event);
  handler?.(propertyDetails);
}
