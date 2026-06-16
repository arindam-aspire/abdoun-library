import type { ReactNode } from "react";
import type { UiControlSize } from "../ui/commonTypes";
import type { CardListProps, PaginitionContent } from "../PropertyCardList/types";
import type { TableNoDataFoundContent } from "./TableNoDataFound";
import type {
  PinnedColumns,
  SortConfig,
  TableColumn,
  TableColumnWidths,
} from "../ui/Table";
import type { PropertyListing } from "../PropertyListCard/types";
import type { PropertyTableWorkflowActionsConfig } from "./propertyTableWorkflowActions";
import type { PropertyTableRowActionsInput } from "./rowActionTypes";

export type { PropertyListing, SortConfig };

export interface TablePaginitionProps extends PaginitionContent {
  isLoading?: boolean;
  /** Control size from `sm` breakpoint up; below `sm` unchanged. */
  buttonSize?: UiControlSize;
  className?: string;
}

export type ListTableViewProps = CardListProps & {
  isLoading?: boolean;
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  multiSortWithShift?: boolean;
  listTitle?: string;
  noDataFound?: TableNoDataFoundContent;
  pagination?: PaginitionContent & Pick<TablePaginitionProps, "isLoading">;
  /** Override default property columns. */
  columns?: TableColumn<PropertyListing>[];
  locale?: keyof PropertyListing["title"];
  /** Below `sm`: top label for each listing column in the transposed layout. */
  getRowColumnHeader?: (listing: PropertyListing) => ReactNode;
  /** Below `sm`: field row omitted from the pinned column (defaults to `title`). */
  transposeHeaderColumnId?: string;
  minTableWidth?: string;
  className?: string;
  tableClassName?: string;
  /**
   * Handlers for workflow action ids (`view`, `approve`, `reject`, etc.).
   * When a listing includes `actions` in API JSON, only that row's array is shown
   * (rows can differ). Use `actions: []` for no actions on a row.
   * When `actions` is omitted, visibility follows `STATUS_WORKFLOW_ACTION_MATRIX`.
   */
  workflowActions?: PropertyTableWorkflowActionsConfig;
  /** Fallback handler when an action id has no matching entry in `workflowActions`. */
  onRowAction?: (actionId: string, listing: PropertyListing) => void;
  /**
   * Row actions for the `…` menu. Static array or per-row factory.
   * When omitted, `listing.actions` from JSON, then `workflowActions`, then contact/delete handlers are used.
   */
  rowActions?: PropertyTableRowActionsInput;
  /**
   * Sticky columns while horizontally scrolling.
   * Aliases: `property` → `title`, `reference` → `title`, `submitted` → `submission`, `action` → `actions`.
   */
  pinnedColumns?: PinnedColumns;
  /** Enable drag-to-resize column headers on `sm+`. Defaults to `true`. */
  resizableColumns?: boolean;
  columnWidths?: TableColumnWidths;
  defaultColumnWidths?: TableColumnWidths;
  onColumnWidthsChange?: (widths: TableColumnWidths) => void;
};

export type { PinnedColumns, TableNoDataFoundContent };

export type {
  PropertyTableRowAction,
  PropertyTableRowActionTone,
  PropertyTableRowActionsInput,
} from "./rowActionTypes";
export type {
  PropertyTableWorkflowActionConfig,
  PropertyTableWorkflowActionId,
  PropertyTableWorkflowActionsConfig,
} from "./propertyTableWorkflowActions";
