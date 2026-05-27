"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { Pagination } from "../ui/Pagination";
import { PropertyListEmptyState } from "./PropertyListEmptyState";
import { PropertyListGridView } from "./PropertyListGridView";
import { PropertyListSkleton } from "./PropertyListSkleton";
import { PropertyListToolbar } from "./PropertyListToolbar";
import type { PropertyListProps, PropertyListView } from "./types";

export { PropertyListToolbar, DEFAULT_PROPERTY_LIST_SORT_OPTIONS } from "./PropertyListToolbar";
export { PropertyListEmptyState } from "./PropertyListEmptyState";
export { PropertyListGridView } from "./PropertyListGridView";
export type { PropertyListEmptyStateProps } from "./PropertyListEmptyState";
export { PropertyListSkleton } from "./PropertyListSkleton";
export { PropertyListGridViewSkleton, PROPERTY_LIST_SKELETON_CARD_COUNT } from "./PropertyListGridViewSkleton";
export { PropertyListPaginationSkleton } from "./PropertyListPaginationSkleton";
export { PropertyListToolbarSkleton } from "./PropertyListToolbarSkleton";
export type { PropertyListSkletonProps } from "./PropertyListSkleton";
export type {
  PropertyListGridViewProps,
  PropertyListPagination,
  PropertyListProps,
  PropertyListSortOption,
  PropertyListToolbarProps,
  PropertyListView,
} from "./types";

export function PropertyList({
  isLoading = false,
  data,
  toolbar,
  layoutVariant: layoutVariantProp,
  isAuthenticated,
  showOwners,
  showAgents,
  showBadges,
  onEmail,
  onCall,
  onWhatsApp,
  onFavourite,
  onDetailsClick,
  pagination,
  className,
  emptyTitle,
  emptyDescription,
}: PropertyListProps) {
  const [layoutVariant, setLayoutVariant] =
    useState<PropertyListView>(layoutVariantProp);
  const [sortValue, setSortValue] = useState(
    () => toolbar.sortValue ?? toolbar.defaultSortValue ?? "newest",
  );

  useEffect(() => {
    setLayoutVariant(layoutVariantProp);
  }, [layoutVariantProp]);

  useEffect(() => {
    if (toolbar.sortValue !== undefined) {
      setSortValue(toolbar.sortValue);
    }
  }, [toolbar.sortValue]);

  if (isLoading) {
    return (
      <PropertyListSkleton layoutVariant={layoutVariant} className={className} />
    );
  }

  const listingCount = toolbar.listingCount ?? pagination.totalResults;
  const isEmpty = data.length === 0;

  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <PropertyListToolbar
        {...toolbar}
        layoutVariant={layoutVariant}
        listingCount={isEmpty ? 0 : listingCount}
        sortValue={toolbar.sortValue ?? sortValue}
        onViewChange={(view) => {
          setLayoutVariant(view);
          toolbar.onViewChange?.(view);
        }}
        onSortChange={(value) => {
          setSortValue(value);
          toolbar.onSortChange?.(value);
        }}
      />

      {isEmpty ? (
        <PropertyListEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <>
          <PropertyListGridView
            layoutVariant={layoutVariant}
            data={data}
            isAuthenticated={isAuthenticated}
            showOwners={showOwners}
            showAgents={showAgents}
            showBadges={showBadges}
            onEmail={onEmail}
            onCall={onCall}
            onWhatsApp={onWhatsApp}
            onFavourite={onFavourite}
            onDetailsClick={onDetailsClick}
          />

          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.totalResults}
            pageSize={pagination.pageSize}
            pageSizeOptions={pagination.pageSizeOptions}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </>
      )}
    </section>
  );
}
