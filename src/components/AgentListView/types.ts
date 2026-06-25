import type { ReactNode } from "react";
import type { UiControlSize } from "../ui/commonTypes";
import type { PaginitionContent } from "../PropertyCardList/types";
import type { TableNoDataFoundContent } from "../ListTableView/TableNoDataFound";
import type {
  PinnedColumns,
  SortConfig,
  TableColumn,
  TableColumnWidths,
} from "../ui/Table";
import type { AgentMobileRowActionsConfig } from "./rowActionTypes";
import type { AgentWorkflowActionsConfig } from "./agentStatusRowActions";

export type AgentStatusKey =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "declined"
  | "invited";

export interface AgentStatus {
  key: AgentStatusKey;
  label: string;
}

export interface Agent {
  id: string;
  email: string;
  status: AgentStatus;
  /** ISO-8601 activity timestamp. */
  activityDate: string;
  name?: string;
  phone?: string;
  city?: string;
}

export interface AgentListPaginationProps extends PaginitionContent {
  isLoading?: boolean;
  buttonSize?: UiControlSize;
  className?: string;
}

export type AgentListViewProps<T = Agent> = {
  isLoading?: boolean;
  listTitle?: string;
  data: T[];
  /**
   * Table columns for `md` and `lg`. Defaults to the standard agent columns when omitted.
   */
  columns?: TableColumn<T>[];
  getRowId: (row: T) => string;
  /** Used for action menu labels on mobile cards. */
  getRowLabel?: (row: T) => string;
  /** Opens the agent profile or detail view from the mobile card title. */
  onRowClick?: (row: T) => void;
  /**
   * Mobile card layout. `auto` uses the rich agent card when row data matches `Agent`.
   * `generic` always uses the column-driven card.
   */
  mobileCardVariant?: "auto" | "generic";
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  multiSortWithShift?: boolean;
  noDataFound?: TableNoDataFoundContent;
  pagination?: AgentListPaginationProps;
  /**
   * Status-based action handlers (Active, Inactive, Pending, Suspended, Declined, Invited).
   * The library picks which buttons to show per row; wire only the callbacks you need.
   */
  workflowActions?: AgentWorkflowActionsConfig;
  /**
   * Mobile card row action layout (`< md` only). Defaults to inline labeled buttons
   * below contacts with no footer border.
   */
  mobileRowActions?: AgentMobileRowActionsConfig;
  buttonSize?: UiControlSize;
  /** Column id used as the card title on small screens. Defaults to `name`. */
  gridTitleColumnId?: string;
  /** Column ids omitted from the mobile card body. Defaults to title + `actions`. */
  gridHiddenColumnIds?: string[];
  /** Override the default mobile card layout. */
  renderGridCard?: (row: T) => ReactNode;
  minTableWidth?: string;
  /**
   * Sticky columns while horizontally scrolling on `md+`.
   * Defaults to `name` on the left and `actions` on the right.
   * Alias: `action` → `actions`.
   */
  pinnedColumns?: PinnedColumns;
  resizableColumns?: boolean;
  columnWidths?: TableColumnWidths;
  defaultColumnWidths?: TableColumnWidths;
  onColumnWidthsChange?: (widths: TableColumnWidths) => void;
  className?: string;
  tableClassName?: string;
};

export type { SortConfig, PinnedColumns, TableNoDataFoundContent };
export type { AgentWorkflowActionsConfig } from "./agentStatusRowActions";
export type {
  AgentMobileRowActionsConfig,
  AgentMobileRowActionsPlacement,
  AgentMobileRowActionsVariant,
} from "./rowActionTypes";
