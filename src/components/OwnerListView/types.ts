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
import type { OwnerMobileRowActionsConfig } from "./rowActionTypes";
import type { OwnerWorkflowActionsConfig } from "./ownerWorkflowActions";

export type OwnerStatusKey = "active" | "suspended";

export interface OwnerStatus {
  key: OwnerStatusKey;
  label: string;
}

export interface Owner {
  id: string;
  name: string;
  propertyOwned: number;
  joinedAt: string;
  status: OwnerStatus;
  email?: string;
  phone?: string;
}

export interface OwnerListPaginationProps extends PaginitionContent {
  isLoading?: boolean;
  buttonSize?: UiControlSize;
  className?: string;
}

export type OwnerListViewProps<T = Owner> = {
  isLoading?: boolean;
  listTitle?: string;
  data: T[];
  columns?: TableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  onRowClick?: (row: T) => void;
  mobileCardVariant?: "auto" | "generic";
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  multiSortWithShift?: boolean;
  noDataFound?: TableNoDataFoundContent;
  pagination?: OwnerListPaginationProps;
  workflowActions?: OwnerWorkflowActionsConfig;
  mobileRowActions?: OwnerMobileRowActionsConfig;
  buttonSize?: UiControlSize;
  gridTitleColumnId?: string;
  gridHiddenColumnIds?: string[];
  renderGridCard?: (row: T) => ReactNode;
  minTableWidth?: string;
  pinnedColumns?: PinnedColumns;
  resizableColumns?: boolean;
  columnWidths?: TableColumnWidths;
  defaultColumnWidths?: TableColumnWidths;
  onColumnWidthsChange?: (widths: TableColumnWidths) => void;
  className?: string;
  tableClassName?: string;
};

export type { SortConfig, PinnedColumns, TableNoDataFoundContent };
export type { OwnerWorkflowActionsConfig } from "./ownerWorkflowActions";
export type {
  OwnerMobileRowActionsConfig,
  OwnerMobileRowActionsPlacement,
  OwnerMobileRowActionsVariant,
} from "./rowActionTypes";
