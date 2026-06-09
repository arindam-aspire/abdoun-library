"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../../lib/cn";
import { textPaginationLabelClasses } from "../../../lib/typography";
import { IconButton } from "../IconButton";
import { SelectDropdown } from "../SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../SelectDropdown/types";
import {
  tablePaginationIconSizeClasses,
  tablePaginationSelectTriggerSizeClasses,
} from "../responsiveSizes";
import type { TablePaginationProps } from "./types";

function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0 || pageSize <= 0) {
    return 1;
  }
  return Math.ceil(totalItems / pageSize);
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

export function TablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  showPageSizeSelector = true,
  perPageLabel = "Rows per page:",
  buttonSize = "md",
  pageSizeSelectSize = "sm",
  pageIconClassName,
  pageSizeSelectTriggerClassName,
  className,
  disabled = false,
  hasNext,
  hasPrevious,
  totalPages: totalPagesProp,
}: TablePaginationProps) {
  const totalPages = totalPagesProp ?? getTotalPages(totalItems, pageSize);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const { from, to } = getResultsRange(safeCurrentPage, pageSize, totalItems);

  const isFirstDisabled =
    disabled || (hasPrevious != null ? !hasPrevious : safeCurrentPage <= 1);
  const isPrevDisabled = isFirstDisabled;
  const isNextDisabled =
    disabled || (hasNext != null ? !hasNext : safeCurrentPage >= totalPages);
  const isLastDisabled = isNextDisabled;

  const navIconClassName =
    pageIconClassName ?? tablePaginationIconSizeClasses(buttonSize);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-x-4 gap-y-2 px-3 py-2 sm:gap-x-6 sm:px-4 sm:py-2.5",
        textPaginationLabelClasses,
        className,
      )}
    >
      {showPageSizeSelector && pageSizeOptions.length > 0 ? (
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-text">{perPageLabel}</span>
          <SelectDropdown
            options={pageSizeOptions.map((option) => ({
              value: String(option),
              label: String(option),
            }))}
            placeholder={String(pageSize)}
            value={String(pageSize)}
            onChange={(value) => {
              if (
                value !== SELECT_DROPDOWN_EMPTY_VALUE &&
                onPageSizeChange != null
              ) {
                onPageSizeChange(Number(value));
              }
            }}
            disabled={disabled || onPageSizeChange == null}
            fullWidth={false}
            wrapperClassName="w-auto"
            triggerClassName={cn(
              "min-w-[2.75rem] w-auto border-0 bg-transparent font-normal text-text shadow-none",
              pageSizeSelectTriggerClassName ??
                tablePaginationSelectTriggerSizeClasses(buttonSize),
            )}
            variant="clear"
            size={pageSizeSelectSize}
            aria-label="Rows per page"
          />
        </div>
      ) : null}

      <p className="whitespace-nowrap text-text" aria-live="polite">
        {from}–{to} of {totalItems}
      </p>

      <nav
        className="flex items-center gap-0.5"
        aria-label="Table pagination navigation"
      >
        <IconButton
          color="inherit"
          variant="ghost"
          size="sm"
          disabled={isFirstDisabled}
          onClick={() => onPageChange(1)}
          className={cn("text-text disabled:text-muted/50", navIconClassName)}
          icon={<ChevronFirst aria-hidden />}
          aria-label="First page"
        />
        <IconButton
          color="inherit"
          variant="ghost"
          size="sm"
          disabled={isPrevDisabled}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          className={cn("text-text disabled:text-muted/50", navIconClassName)}
          icon={<ChevronLeft aria-hidden />}
          aria-label="Previous page"
        />
        <IconButton
          color="inherit"
          variant="ghost"
          size="sm"
          disabled={isNextDisabled}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          className={cn("text-text disabled:text-muted/50", navIconClassName)}
          icon={<ChevronRight aria-hidden />}
          aria-label="Next page"
        />
        <IconButton
          color="inherit"
          variant="ghost"
          size="sm"
          disabled={isLastDisabled}
          onClick={() => onPageChange(totalPages)}
          className={cn("text-text disabled:text-muted/50", navIconClassName)}
          icon={<ChevronLast aria-hidden />}
          aria-label="Last page"
        />
      </nav>
    </div>
  );
}
