"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import { SelectDropdown } from "../SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../SelectDropdown/types";
import type { ButtonSize } from "../Button/types";
import { DEFAULT_PAGE_SIZE_OPTIONS, type PaginationProps } from "./types";

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
  const safeMaxPageButtons = Math.max(1, maxPageButtons);

  if (totalPages <= safeMaxPageButtons) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(safeMaxPageButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = start + safeMaxPageButtons - 1;

  if (end > totalPages) {
    end = totalPages;
    start = end - safeMaxPageButtons + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
  maxPageButtons: number,
): PaginationItem[] {
  const safeMaxPageButtons = Math.max(1, maxPageButtons);

  if (totalPages <= safeMaxPageButtons + 2) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = getVisiblePages(currentPage, totalPages, safeMaxPageButtons)
    .map((page) => Math.min(Math.max(page, 2), totalPages - 1))
    .filter((page, index, list) => list.indexOf(page) === index);

  const firstMiddlePage = pages[0] ?? 2;
  const lastMiddlePage = pages[pages.length - 1] ?? totalPages - 1;
  const items: PaginationItem[] = [1];

  if (firstMiddlePage > 2) {
    if (firstMiddlePage === 3) {
      items.push(2);
    } else {
      items.push("ellipsis-left");
    }
  }

  items.push(...pages);

  if (lastMiddlePage < totalPages - 1) {
    if (lastMiddlePage === totalPages - 2) {
      items.push(totalPages - 1);
    } else {
      items.push("ellipsis-right");
    }
  }

  items.push(totalPages);

  return items;
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

const pageButtonBaseClasses =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-50";

const pageButtonSizeClasses: Record<ButtonSize, string> = {
  sm: "size-9 text-sm",
  md: "size-11 text-sm",
  lg: "size-12 text-base",
};

const pageIconSizeClasses: Record<ButtonSize, string> = {
  sm: "size-4",
  md: "size-[1.125rem]",
  lg: "size-5",
};

const pageSizeSelectTriggerSizeClasses: Record<ButtonSize, string> = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12",
};

const navButtonClasses = cn(
  pageButtonBaseClasses,
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
  buttonSize = "md",
  pageSizeSelectSize = "md",
  className,
  disabled = false,
}: PaginationProps) {
  const totalPages = getTotalPages(totalItems, pageSize);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginationItems = getPaginationItems(
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
        <p className="order-2 text-center text-sm text-muted sm:order-1 sm:text-start">
          Showing <span className="font-semibold text-secondary">{from}</span> to{" "}
          <span className="font-semibold text-secondary">{to}</span> of{" "}
          <span className="font-semibold text-secondary">{totalItems}</span>{" "}
          {resultsLabel}
        </p>
      ) : null}

      <div className="order-1 flex flex-wrap items-center justify-center gap-4 sm:order-2 sm:justify-end">
        {showPageSizeSelector && onPageSizeChange ? (
          <div className="hidden items-center gap-2 sm:flex">
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
              triggerClassName={cn(
                pageSizeSelectTriggerSizeClasses[buttonSize],
                "min-w-[4.5rem] rounded-lg px-3 text-sm font-semibold text-secondary",
              )}
              variant="outline"
              size={pageSizeSelectSize}
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
            className={cn(navButtonClasses, pageButtonSizeClasses[buttonSize])}
            aria-label="Previous page"
          >
            <ChevronLeft className={pageIconSizeClasses[buttonSize]} aria-hidden />
          </button>

          {paginationItems.map((item) => {
            if (typeof item !== "number") {
              return (
                <span
                  key={item}
                  aria-hidden
                  className={cn(
                    "inline-flex items-center justify-center text-muted",
                    pageButtonSizeClasses[buttonSize],
                  )}
                >
                  ...
                </span>
              );
            }

            const isActive = item === safeCurrentPage;

            return (
              <button
                key={item}
                type="button"
                disabled={disabled}
                onClick={() => onPageChange(item)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  pageButtonBaseClasses,
                  pageButtonSizeClasses[buttonSize],
                  isActive
                    ? "bg-primary text-white"
                    : "border border-secondary/15 bg-surface text-text hover:bg-page",
                )}
              >
                {item}
              </button>
            );
          })}

          <button
            type="button"
            disabled={isNextDisabled}
            onClick={() => onPageChange(safeCurrentPage + 1)}
            className={cn(navButtonClasses, pageButtonSizeClasses[buttonSize])}
            aria-label="Next page"
          >
            <ChevronRight className={pageIconSizeClasses[buttonSize]} aria-hidden />
          </button>
        </nav>
      </div>
    </div>
  );
}
