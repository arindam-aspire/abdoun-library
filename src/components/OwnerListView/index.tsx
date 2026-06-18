"use client";

import { useMemo } from "react";
import { cn } from "../../lib/cn";
import {
  Table,
  TableBodySkeleton,
  sortRowsByConfig,
  type TableColumn,
} from "../ui/Table";
import { TableNoDataFound } from "../ListTableView/TableNoDataFound";
import { TablePaginition } from "../ListTableView/TablePaginition";
import { PaginitionSkeleton } from "../PropertyCardList/PaginitionSkeleton";
import { PropertyPaginition } from "../PropertyCardList/PropertyPaginition";
import { OwnerGridView } from "./OwnerGridView";
import { buildOwnerTableColumns } from "./ownerTableColumns";
import { isOwnerRow, resolveOwnerDisplayName } from "./ownerListFields";
import {
  buildOwnerRowActions,
  hasOwnerWorkflowActions,
} from "./ownerWorkflowActions";
import { resolveOwnerPinnedColumns } from "./resolveOwnerPinnedColumns";
import type { Owner } from "./types";
import type { OwnerListViewProps } from "./types";
import type { OwnerRowActionsInput } from "./rowActionTypes";

const DEFAULT_GRID_TITLE_COLUMN_ID = "name";
const DEFAULT_GRID_HIDDEN_COLUMN_IDS = ["actions"];

export function OwnerListView<T>({
  isLoading = false,
  listTitle = "Owners",
  data,
  columns: columnsProp,
  getRowId,
  getRowLabel: getRowLabelProp,
  sortConfig,
  onSort,
  multiSortWithShift = true,
  noDataFound,
  pagination,
  workflowActions,
  mobileRowActions,
  buttonSize = "md",
  gridTitleColumnId = DEFAULT_GRID_TITLE_COLUMN_ID,
  gridHiddenColumnIds = DEFAULT_GRID_HIDDEN_COLUMN_IDS,
  renderGridCard,
  onRowClick,
  mobileCardVariant = "auto",
  minTableWidth = "100%",
  pinnedColumns,
  resizableColumns = true,
  columnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
  className,
  tableClassName,
}: OwnerListViewProps<T>) {
  const isEmpty = !isLoading && data.length === 0;
  const skeletonRows = pagination?.pageSize ?? 8;
  const hasPagination = Boolean(pagination);
  const showMobilePagination = hasPagination && !isEmpty;
  const showTablePagination = hasPagination && !isEmpty && !isLoading;

  const mobilePaginationFooter = showMobilePagination ? (
    isLoading ? (
      <PaginitionSkeleton />
    ) : (
      <PropertyPaginition {...pagination!} buttonSize={buttonSize} />
    )
  ) : null;

  const tablePaginationFooter = showTablePagination ? (
    <TablePaginition {...pagination!} buttonSize={buttonSize} />
  ) : null;

  const resolvedRowActions = useMemo(
    () =>
      hasOwnerWorkflowActions(workflowActions)
        ? buildOwnerRowActions(workflowActions)
        : undefined,
    [workflowActions],
  );

  const columns = useMemo((): TableColumn<T>[] => {
    if (columnsProp) {
      return columnsProp;
    }
    return buildOwnerTableColumns({
      buttonSize,
      workflowActions,
      onClick: onRowClick as ((owner: Owner) => void) | undefined,
    }) as TableColumn<T>[];
  }, [buttonSize, columnsProp, onRowClick, workflowActions]);

  const hiddenColumnIdSet = useMemo(
    () => new Set(gridHiddenColumnIds),
    [gridHiddenColumnIds.join("|")],
  );

  const resolveRowLabel = useMemo(() => {
    if (getRowLabelProp) {
      return getRowLabelProp;
    }

    const titleColumn = columns.find((column) => column.id === gridTitleColumnId);
    return (row: T) => {
      if (isOwnerRow(row)) {
        return resolveOwnerDisplayName(row);
      }

      if (titleColumn?.getSortValue) {
        const value = titleColumn.getSortValue(row);
        if (value != null && value !== "") {
          return String(value);
        }
      }
      return getRowId(row);
    };
  }, [columns, getRowId, getRowLabelProp, gridTitleColumnId]);

  const sortedData = useMemo(
    () =>
      sortRowsByConfig(data, sortConfig, (row, columnId) => {
        const column = columns.find((col) => col.id === columnId);
        return column?.getSortValue?.(row);
      }),
    [columns, data, sortConfig],
  );

  const resolvedPinnedColumns = useMemo(
    () =>
      resolveOwnerPinnedColumns(
        pinnedColumns,
        columns.map((column) => column.id),
      ),
    [columns, pinnedColumns?.left?.join("|"), pinnedColumns?.right?.join("|")],
  );

  return (
    <section className={cn("w-full", className)} aria-label={listTitle}>
      <div className="space-y-2 md:hidden">
        <OwnerGridView
          data={sortedData}
          columns={columns}
          getRowId={getRowId}
          getRowLabel={resolveRowLabel}
          rowActions={
            resolvedRowActions as OwnerRowActionsInput<T> | undefined
          }
          mobileRowActions={mobileRowActions}
          buttonSize={buttonSize}
          gridTitleColumnId={gridTitleColumnId}
          gridHiddenColumnIds={hiddenColumnIdSet}
          renderGridCard={renderGridCard}
          onRowClick={onRowClick}
          mobileCardVariant={mobileCardVariant}
          isLoading={isLoading}
          loadingCount={pagination?.pageSize ?? 4}
          isEmpty={isEmpty}
          noDataFound={noDataFound}
        />
        {mobilePaginationFooter}
      </div>

      <div className="hidden md:block">
        <Table
          columns={columns}
          data={isEmpty ? [] : sortedData}
          getRowId={getRowId}
          sortConfig={sortConfig}
          onSort={onSort}
          multiSortWithShift={multiSortWithShift}
          loading={isLoading}
          skeleton={
            <TableBodySkeleton rows={skeletonRows} columns={columns.length} />
          }
          emptyContent={
            isEmpty ? (
              <TableNoDataFound
                title={noDataFound?.title ?? "No owners found"}
                description={
                  noDataFound?.description ??
                  "Try adjusting your filters or search terms to find matching owners."
                }
                actions={noDataFound?.actions}
              />
            ) : undefined
          }
          minTableWidth={minTableWidth}
          tableClassName={tableClassName}
          pinnedColumns={resolvedPinnedColumns}
          resizableColumns={resizableColumns}
          columnWidths={columnWidths}
          defaultColumnWidths={defaultColumnWidths}
          onColumnWidthsChange={onColumnWidthsChange}
          paginationFooter={tablePaginationFooter}
        />
      </div>
    </section>
  );
}

export { OwnerGridCard, ownerGridCardClassName } from "./OwnerGridCard";
export { OwnerGridSkeleton } from "./OwnerGridSkeleton";
export { OwnerGridView } from "./OwnerGridView";
export { OwnerMobileCard } from "./OwnerMobileCard";
export { OwnerRowActions } from "./OwnerRowActions";
export { OwnerStatusBadge } from "./OwnerStatusBadge";
export { buildOwnerTableColumns } from "./ownerTableColumns";
export {
  OWNER_WORKFLOW_ACTION_IDS,
  buildOwnerRowActions,
  hasOwnerWorkflowActions,
} from "./ownerWorkflowActions";
export type {
  OwnerWorkflowActionId,
  OwnerWorkflowActionsConfig,
} from "./ownerWorkflowActions";
export { mapOwnerApiStatus } from "./ownerStatus";
export {
  DEFAULT_OWNER_PINNED_COLUMNS,
  resolveOwnerPinnedColumns,
} from "./resolveOwnerPinnedColumns";
export type {
  Owner,
  OwnerListPaginationProps,
  OwnerListViewProps,
  OwnerStatus,
  OwnerStatusKey,
} from "./types";
export type {
  OwnerRowAction,
  OwnerRowActionTone,
  OwnerRowActionsDisplay,
  OwnerRowActionsInput,
  OwnerMobileRowActionsConfig,
  OwnerMobileRowActionsPlacement,
  OwnerMobileRowActionsVariant,
} from "./rowActionTypes";
export {
  DEFAULT_OWNER_MOBILE_ROW_ACTIONS,
  resolveOwnerMobileRowActionsConfig,
} from "./rowActionTypes";
