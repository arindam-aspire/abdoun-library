"use client";

import { cn } from "../../lib/cn";
import { DraftListEmpty } from "./DraftListEmpty";
import {
  draftListCardClassName,
  draftListPaginationClassName,
} from "./draftListLayout";
import { Card } from "../ui/Card";
import { PropertyPaginition } from "../PropertyCardList/PropertyPaginition";
import { DraftListCard } from "./DraftListCard";
import { DraftListSkeleton } from "./DraftListSkeleton";
import type { DraftListProps } from "./types";

function DraftListEmptyContent({
  emptyState,
  emptyStateContent,
  onCreateNew,
  createLabel,
}: Pick<
  DraftListProps,
  "emptyState" | "emptyStateContent" | "onCreateNew" | "createLabel"
>) {
  if (emptyState) {
    return (
      <Card className={draftListCardClassName}>
        <div className="px-4 py-10 text-center sm:px-6 sm:py-12">{emptyState}</div>
      </Card>
    );
  }

  return (
    <DraftListEmpty
      onCreateNew={onCreateNew}
      createLabel={createLabel}
      {...emptyStateContent}
    />
  );
}

export function DraftList({
  items,
  onResume,
  onDelete,
  getDeleteLoading,
  resumeLabel,
  size = "md",
  isLoading = false,
  loadingCount,
  emptyState,
  emptyStateContent,
  onCreateNew,
  createLabel,
  pagination,
  className,
  itemClassName,
}: DraftListProps) {
  const isEmpty = items.length === 0;
  const showPagination = Boolean(pagination) && (isLoading || !isEmpty);
  const skeletonRows = loadingCount ?? pagination?.pageSize ?? 4;

  if (isLoading) {
    return (
      <DraftListSkeleton
        rowCount={skeletonRows}
        showPagination={Boolean(pagination)}
        className={className}
      />
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <section className="w-full" aria-label="Property drafts">
        {isEmpty ? (
          <DraftListEmptyContent
            emptyState={emptyState}
            emptyStateContent={emptyStateContent}
            onCreateNew={onCreateNew}
            createLabel={createLabel}
          />
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0 md:gap-4">
            {items.map((item) => (
              <li key={item.id}>
                <DraftListCard
                  item={item}
                  onResume={onResume}
                  onDelete={onDelete}
                  isDeleteLoading={getDeleteLoading?.(item)}
                  resumeLabel={resumeLabel}
                  size={size}
                  className={itemClassName}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {showPagination ? (
        <PropertyPaginition
          {...pagination!}
          buttonSize="sm"
          className={draftListPaginationClassName}
        />
      ) : null}
    </div>
  );
}
