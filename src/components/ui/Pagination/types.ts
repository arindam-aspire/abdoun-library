import type { ButtonSize } from "../Button/types";
import type { SelectDropdownSize } from "../SelectDropdown/types";

export const DEFAULT_PAGE_SIZE_OPTIONS = [4, 8, 12, 24] as const;

export type PaginationVariant = "default" | "table";

export type TablePaginationProps = {
  /** 1-based current page index. */
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  /** Defaults to `"Rows per page:"`. */
  perPageLabel?: string;
  buttonSize?: ButtonSize;
  pageSizeSelectSize?: SelectDropdownSize;
  pageIconClassName?: string;
  pageSizeSelectTriggerClassName?: string;
  className?: string;
  disabled?: boolean;
  /** Server-driven pagination: overrides computed previous/first disabled state. */
  hasPrevious?: boolean;
  /** Server-driven pagination: overrides computed next/last disabled state. */
  hasNext?: boolean;
  /** Overrides total pages derived from `totalItems` / `pageSize`. */
  totalPages?: number;
};

export type PaginationProps = {
  /** 1-based current page index. */
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Maximum page buttons in the `md+` sliding window. Defaults to `5` (`default`) or `3` (`table`). */
  maxPageButtons?: number;
  /** `table`: compact footer layout aligned with data tables. */
  variant?: PaginationVariant;
  showPageSizeSelector?: boolean;
  showResultsSummary?: boolean;
  /** Label before the page-size dropdown. Defaults to `"Per page"`. */
  perPageLabel?: string;
  /** Defaults to `"results"`. */
  resultsLabel?: string;
  /** Size for page buttons. Defaults to `"md"`. */
  buttonSize?: ButtonSize;
  /** Size for page-size selector. Defaults to `"md"`. */
  pageSizeSelectSize?: SelectDropdownSize;
  /** Overrides default page-button size map (e.g. responsive `cardList` scale). */
  pageButtonClassName?: string;
  /** Overrides default nav icon size map. */
  pageIconClassName?: string;
  /** Extra classes on the per-page `SelectDropdown` trigger. */
  pageSizeSelectTriggerClassName?: string;
  className?: string;
  disabled?: boolean;
};
