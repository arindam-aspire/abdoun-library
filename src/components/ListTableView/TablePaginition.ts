import { createElement, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  tablePaginationIconSizeClasses,
  tablePaginationSelectTriggerSizeClasses,
} from "../ui/responsiveSizes";
import { TablePagination } from "../ui/Pagination";
import { TablePaginitionSkeleton } from "./TablePaginitionSkeleton";
import type { TablePaginitionProps } from "./types";

export function TablePaginition({
  isLoading = false,
  total,
  page,
  pageSize = 10,
  pageOptions,
  onPageChange,
  onPageSizeChange,
  hasNext,
  hasPrevious,
  totalPages,
  buttonSize = "md",
  className,
}: TablePaginitionProps): ReactNode {
  if (isLoading) {
    return createElement(TablePaginitionSkeleton, { className: cn(className) });
  }

  return createElement(TablePagination, {
    currentPage: page,
    totalItems: total,
    pageSize,
    pageSizeOptions: pageOptions ?? [5, 10, 25, 50],
    onPageChange: (nextPage: number) => onPageChange?.(nextPage),
    onPageSizeChange: onPageSizeChange
      ? (nextPageSize: number) => onPageSizeChange(nextPageSize)
      : undefined,
    hasNext,
    hasPrevious,
    totalPages,
    pageIconClassName: tablePaginationIconSizeClasses(buttonSize),
    pageSizeSelectTriggerClassName:
      tablePaginationSelectTriggerSizeClasses(buttonSize),
    className: cn(className),
  });
}
