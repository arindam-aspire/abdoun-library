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
import { AgentGridView } from "./AgentGridView";
import { buildAgentTableColumns } from "./agentTableColumns";
import {
  buildAgentStatusRowActions,
  hasAgentWorkflowActions,
} from "./agentStatusRowActions";
import { resolveAgentPinnedColumns } from "./resolveAgentPinnedColumns";
import type { Agent } from "./types";
import type { AgentListViewProps } from "./types";
import type { AgentRowActionsInput } from "./rowActionTypes";

const DEFAULT_GRID_TITLE_COLUMN_ID = "name";
const DEFAULT_GRID_HIDDEN_COLUMN_IDS = ["actions"];

export function AgentListView<T>({
  isLoading = false,
  listTitle = "Agents",
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
}: AgentListViewProps<T>) {
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
      hasAgentWorkflowActions(workflowActions)
        ? buildAgentStatusRowActions(workflowActions)
        : undefined,
    [workflowActions],
  );

  const columns = useMemo((): TableColumn<T>[] => {
    if (columnsProp) {
      return columnsProp;
    }
    return buildAgentTableColumns({
      buttonSize,
      workflowActions,
      onClick: onRowClick as ((agent: Agent) => void) | undefined,
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
      resolveAgentPinnedColumns(
        pinnedColumns,
        columns.map((column) => column.id),
      ),
    [columns, pinnedColumns?.left?.join("|"), pinnedColumns?.right?.join("|")],
  );

  return (
    <section className={cn("w-full", className)} aria-label={listTitle}>
      <div className="space-y-2 md:hidden">
        <AgentGridView
          data={sortedData}
          columns={columns}
          getRowId={getRowId}
          getRowLabel={resolveRowLabel}
          rowActions={
            resolvedRowActions as AgentRowActionsInput<T> | undefined
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
                title={noDataFound?.title ?? "No agents found"}
                description={
                  noDataFound?.description ??
                  "Try adjusting your filters or search terms to find matching agents."
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

export { AgentGridCard, agentGridCardClassName } from "./AgentGridCard";
export { AgentGridSkeleton } from "./AgentGridSkeleton";
export { AgentGridView } from "./AgentGridView";
export { AgentMobileCard } from "./AgentMobileCard";
export { AgentRowActions } from "./AgentRowActions";
export { AgentStatusBadge } from "./AgentStatusBadge";
export { buildAgentTableColumns } from "./agentTableColumns";
export {
  AGENT_STATUS_WORKFLOW_ACTION_MATRIX,
  AGENT_WORKFLOW_ACTION_IDS,
  buildAgentStatusRowActions,
  hasAgentWorkflowActions,
} from "./agentStatusRowActions";
export type {
  AgentWorkflowActionId,
  AgentWorkflowActionsConfig,
} from "./agentStatusRowActions";
export {
  mapAgentApiListingToAgent,
  mapAgentApiListingsToAgents,
} from "./agentApiListing";
export type { AgentApiListing } from "./agentApiListing";
export { mapAgentApiStatus } from "./agentStatus";
export {
  DEFAULT_AGENT_PINNED_COLUMNS,
  resolveAgentPinnedColumns,
} from "./resolveAgentPinnedColumns";
export type {
  Agent,
  AgentListPaginationProps,
  AgentListViewProps,
  AgentStatus,
  AgentStatusKey,
} from "./types";
export type {
  AgentRowAction,
  AgentRowActionTone,
  AgentRowActionsDisplay,
  AgentRowActionsInput,
  AgentMobileRowActionsConfig,
  AgentMobileRowActionsPlacement,
  AgentMobileRowActionsVariant,
} from "./rowActionTypes";
export {
  DEFAULT_AGENT_MOBILE_ROW_ACTIONS,
  resolveAgentMobileRowActionsConfig,
} from "./rowActionTypes";
