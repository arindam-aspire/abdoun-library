"use client";

import { LayoutGrid, List, ListFilter } from "lucide-react";
import { cn } from "../../lib/cn";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { ToggleButton } from "../ui/ToggleButton";
import type { PropertyListToolbarProps } from "./types";

export const DEFAULT_PROPERTY_LIST_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

export function PropertyListToolbar({
  title,
  layoutVariant,
  showSort = true,
  showViewToggle = true,
  listingCount,
  listingsLabel = "listings",
  sortOptions = [...DEFAULT_PROPERTY_LIST_SORT_OPTIONS],
  sortValue,
  defaultSortValue = "newest",
  onSortChange,
  onViewChange,
  className,
}: PropertyListToolbarProps) {
  const showListingCount = listingCount != null;
  const showControls = showSort || showViewToggle || showListingCount;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <h2 className="text-xl font-bold text-secondary">{title}</h2>

      {showControls ? (
        <div className="flex flex-wrap items-center gap-3">
          {showSort ? (
            <div className="relative">
              <ListFilter
                className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <SelectDropdown
                options={sortOptions}
                placeholder="Sort by"
                value={sortValue}
                defaultValue={defaultSortValue}
                onChange={(value) => {
                  if (value !== SELECT_DROPDOWN_EMPTY_VALUE) {
                    onSortChange?.(value);
                  }
                }}
                fullWidth={false}
                wrapperClassName="w-auto"
                triggerClassName="h-9 min-w-[8.75rem] rounded-lg ps-9 pe-3 text-sm font-medium"
                variant="outline"
                size="sm"
                aria-label="Sort properties"
              />
            </div>
          ) : null}

          {showViewToggle ? (
            <ToggleButton
              items={[
                {
                  value: "grid",
                  label: "Grid",
                  iconStart: <LayoutGrid />,
                },
                {
                  value: "list",
                  label: "List",
                  iconStart: <List />,
                },
              ]}
              value={layoutVariant}
              onChange={(view) => onViewChange?.(view as "grid" | "list")}
              color="primary"
              variant="solid"
              size="sm"
              aria-label="Property view"
            />
          ) : null}

          {showListingCount ? (
            <span className="text-sm text-muted">
              {listingCount} {listingsLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
