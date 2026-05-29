import { createElement, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Pagination } from "../ui/Pagination";
import { PaginitionSkeleton } from "./PaginitionSkeleton";
import type { PropertyPaginitionProps } from "./types";

export function PropertyPaginition({
  isLoading = false,
  pageOptions,
  maxPageButtons,
  pagination,
  onPageChange,
  onPageSizeChange,
  className,
}: PropertyPaginitionProps): ReactNode {
  if (isLoading) {
    return createElement(PaginitionSkeleton, { className: cn(className) });
  }

  return createElement(Pagination, {
    currentPage: pagination.page,
    totalItems: pagination.total,
    pageSize: pagination.pageSize,
    pageSizeOptions: pageOptions ?? [10, 15, 20],
    maxPageButtons: maxPageButtons ?? 2,
    onPageChange: (page: number) => onPageChange?.(page),
    onPageSizeChange: onPageSizeChange
      ? (pageSize: number) => onPageSizeChange(pageSize)
      : undefined,
    className: cn(className),
  });
}
