import type { ReactNode } from "react";
import type { TablePaginationProps } from "../Pagination";
import type { PinnedColumns } from "./pinnedColumns";

export type SortDirection = "asc" | "desc";

export type SortRule = {
  id: string;
  direction: SortDirection;
};

/** Multi-column: earlier rules are higher priority. */
export type SortConfig = SortRule[];

export type TableColumnAlign = "start" | "center" | "end";

export type TableColumnWidths = Record<string, number>;

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  /** Cell and header text alignment. Defaults to `start`. */
  align?: TableColumnAlign;
  sortable?: boolean;
  /** Initial width in pixels (`sm+` only). */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  /** When `resizableColumns` is enabled, set `false` to disable resizing this column. */
  resizable?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
  /** Value used for client-side sort when `sortable`. */
  getSortValue?: (row: T) => unknown;
};

export type TablePaginationConfig = {
  showWhen: boolean;
} & TablePaginationProps;

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Below `sm`: column title for each record in the transposed layout. Defaults to the first column value. */
  getRowColumnHeader?: (row: T) => ReactNode;
  /**
   * Below `sm`: field row omitted because its values are already shown as column headers.
   * Defaults to the first column id.
   */
  transposeHeaderColumnId?: string;
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  /**
   * When true, Shift+click on a sortable header adds or toggles that column in the sort chain.
   * When false, every header click is single-column mode only.
   */
  multiSortWithShift?: boolean;
  loading?: boolean;
  skeleton: ReactNode;
  error?: string | null;
  errorDescription?: ReactNode;
  errorTitle?: ReactNode;
  emptyMessage?: ReactNode;
  /** Rich empty state; takes precedence over `emptyMessage`. */
  emptyContent?: ReactNode;
  minTableWidth?: string;
  pagination?: TablePaginationConfig;
  /** Custom footer (e.g. `TablePaginition`) rendered below the table body. */
  paginationFooter?: ReactNode;
  pinnedColumns?: PinnedColumns;
  /** Enable drag-to-resize column headers on `sm+`. */
  resizableColumns?: boolean;
  /** Controlled column widths in pixels (`sm+` only). */
  columnWidths?: TableColumnWidths;
  /** Uncontrolled initial column widths in pixels. */
  defaultColumnWidths?: TableColumnWidths;
  onColumnWidthsChange?: (widths: TableColumnWidths) => void;
  className?: string;
  tableClassName?: string;
};

export type { PinnedColumns } from "./pinnedColumns";
