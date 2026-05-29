import type { ButtonSize } from "../Button/types";
import type { SelectDropdownSize } from "../SelectDropdown/types";

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
  /** Size for page buttons. Defaults to `"md"`. */
  buttonSize?: ButtonSize;
  /** Size for page-size selector. Defaults to `"md"`. */
  pageSizeSelectSize?: SelectDropdownSize;
  className?: string;
  disabled?: boolean;
};
