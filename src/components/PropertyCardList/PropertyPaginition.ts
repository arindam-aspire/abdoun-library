import { createElement, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  cardListPaginationButtonSizeClasses,
  cardListPaginationIconSizeClasses,
  cardListSelectTriggerSizeClasses,
} from "../ui/responsiveSizes";
import { Pagination } from "../ui/Pagination";
import { PaginitionSkeleton } from "./PaginitionSkeleton";
import type { PropertyPaginitionProps } from "./types";

export function PropertyPaginition({
  isLoading = false,
  total,
  page,
  pageSize = 10,
  pageOptions,
  maxPageButtons,
  onPageChange,
  onPageSizeChange,
  buttonSize = "md",
  className,
}: PropertyPaginitionProps): ReactNode {
  if (isLoading) {
    return createElement(PaginitionSkeleton, { className: cn(className) });
  }

  return createElement(Pagination, {
    currentPage: page,
    totalItems: total,
    pageSize,
    pageSizeOptions: pageOptions ?? [10, 15, 20],
    maxPageButtons: maxPageButtons ?? 2,
    onPageChange: (nextPage: number) => onPageChange?.(nextPage),
    onPageSizeChange: onPageSizeChange
      ? (nextPageSize: number) => onPageSizeChange(nextPageSize)
      : undefined,
    pageButtonClassName: cardListPaginationButtonSizeClasses(buttonSize),
    pageIconClassName: cardListPaginationIconSizeClasses(buttonSize),
    pageSizeSelectTriggerClassName: cardListSelectTriggerSizeClasses(buttonSize),
    className: cn(className),
  });
}
