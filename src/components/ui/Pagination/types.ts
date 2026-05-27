export const DEFAULT_PAGE_SIZE_OPTIONS = [4, 8, 12, 24] as const;

export type PaginationProps = {
  /** 1-based current page index. */
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Maximum number of page buttons to display. Defaults to `5`. */
  maxPageButtons?: number;
  showPageSizeSelector?: boolean;
  showResultsSummary?: boolean;
  /** Label before the page-size dropdown. Defaults to `"Per page"`. */
  perPageLabel?: string;
  /** Defaults to `"results"`. */
  resultsLabel?: string;
  className?: string;
  disabled?: boolean;
};
