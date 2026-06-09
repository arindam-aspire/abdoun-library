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
  /** Maximum page buttons in the `md+` sliding window. Defaults to `5`. (Compact ellipsis on `sm`.) */
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
  /** Overrides default page-button size map (e.g. responsive `cardList` scale). */
  pageButtonClassName?: string;
  /** Overrides default nav icon size map. */
  pageIconClassName?: string;
  /** Extra classes on the per-page `SelectDropdown` trigger. */
  pageSizeSelectTriggerClassName?: string;
  className?: string;
  disabled?: boolean;
};
