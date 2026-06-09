import type { ReactNode } from "react";
import type { UiControlSize } from "../ui/commonTypes";
import type { CardListProps, PaginitionContent } from "../PropertyCardList/types";
import type { TableNoDataFoundContent } from "./TableNoDataFound";
import type { PinnedColumns, SortConfig, TableColumn } from "../ui/Table";
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
   * Status-driven workflow actions (View, Approve, Reject, etc.).
   * Keys map to handlers; visibility per row follows `STATUS_WORKFLOW_ACTION_MATRIX` and listing `status.key`.
   */
  workflowActions?: PropertyTableWorkflowActionsConfig;
  /**
   * Row actions for the `…` menu. Static array or per-row factory.
   * When omitted, `workflowActions` or contact/delete handlers from `CardListProps` are used.
   */
  rowActions?: PropertyTableRowActionsInput;
  /**
   * Sticky columns while horizontally scrolling.
   * Aliases: `property` → `title`, `action` → `actions`.
   */
  pinnedColumns?: PinnedColumns;
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
