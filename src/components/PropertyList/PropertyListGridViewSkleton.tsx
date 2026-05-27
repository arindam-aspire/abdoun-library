import {
  PropertyGridCardSkleton,
  PropertyListCardSkleton,
} from "../PropertyCard";
import type { PropertyListView } from "./types";

export const PROPERTY_LIST_SKELETON_CARD_COUNT = 8;

export function PropertyListGridViewSkleton({
  layoutVariant,
}: {
  layoutVariant: PropertyListView;
}) {
  if (layoutVariant === "list") {
    return (
      <div className="flex flex-col gap-4" aria-hidden>
        {Array.from({ length: PROPERTY_LIST_SKELETON_CARD_COUNT }).map(
          (_, index) => (
            <PropertyListCardSkleton key={index} />
          ),
        )}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: PROPERTY_LIST_SKELETON_CARD_COUNT }).map(
        (_, index) => (
          <PropertyGridCardSkleton key={index} />
        ),
      )}
    </div>
  );
}
