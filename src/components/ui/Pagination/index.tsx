"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import { SelectDropdown } from "../SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../SelectDropdown/types";
import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  type PaginationProps,
} from "./types";

function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0 || pageSize <= 0) {
    return 1;
  }
  return Math.ceil(totalItems / pageSize);
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxPageButtons: number,
): number[] {
  if (totalPages <= maxPageButtons) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(maxPageButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + maxPageButtons - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - maxPageButtons + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getResultsRange(
  currentPage: number,
  pageSize: number,
  totalItems: number,
): { from: number; to: number } {
  if (totalItems <= 0) {
    return { from: 0, to: 0 };
  }

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  return { from, to };
}

const pageButtonClasses =
  "inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-50";

const navButtonClasses = cn(
  pageButtonClasses,
  "border border-secondary/15 bg-surface text-text hover:bg-page data-disabled:hover:bg-surface",
);

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  maxPageButtons = 5,
  showPageSizeSelector = true,
  showResultsSummary = true,
  perPageLabel = "Per page",
  resultsLabel = "results",
  className,
  disabled = false,
}: PaginationProps) {
  const totalPages = getTotalPages(totalItems, pageSize);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const visiblePages = getVisiblePages(
    safeCurrentPage,
    totalPages,
    maxPageButtons,
  );
  const { from, to } = getResultsRange(safeCurrentPage, pageSize, totalItems);

  const isPrevDisabled = disabled || safeCurrentPage <= 1;
  const isNextDisabled = disabled || safeCurrentPage >= totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-secondary/15 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {showResultsSummary ? (
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-secondary">{from}</span> to{" "}
          <span className="font-semibold text-secondary">{to}</span> of{" "}
          <span className="font-semibold text-secondary">{totalItems}</span>{" "}
          {resultsLabel}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        {showPageSizeSelector && onPageSizeChange ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{perPageLabel}</span>
            <SelectDropdown
              options={pageSizeOptions.map((option) => ({
                value: String(option),
                label: String(option),
              }))}
              placeholder="Per page"
              value={String(pageSize)}
              onChange={(value) => {
                if (value !== SELECT_DROPDOWN_EMPTY_VALUE) {
                  onPageSizeChange(Number(value));
                }
              }}
              disabled={disabled}
              fullWidth={false}
              wrapperClassName="w-auto"
              triggerClassName="h-9 min-w-[4.5rem] rounded-lg px-3 text-sm font-semibold text-secondary"
              variant="outline"
              size="sm"
              aria-label="Items per page"
            />
          </div>
        ) : null}

        <nav
          className="flex items-center gap-1.5"
          aria-label="Pagination navigation"
        >
          <button
            type="button"
            disabled={isPrevDisabled}
            onClick={() => onPageChange(safeCurrentPage - 1)}
            className={navButtonClasses}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          {visiblePages.map((page) => {
            const isActive = page === safeCurrentPage;

            return (
              <button
                key={page}
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={cn(
                  pageButtonClasses,
                  isActive
                    ? "bg-primary text-white"
                    : "border border-secondary/15 bg-surface text-text hover:bg-page",
                )}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            disabled={isNextDisabled}
            onClick={() => onPageChange(safeCurrentPage + 1)}
            className={navButtonClasses}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </nav>
      </div>
    </div>
  );
}

export { DEFAULT_PAGE_SIZE_OPTIONS } from "./types";
export type { PaginationProps } from "./types";
