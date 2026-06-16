"use client";

import { useMemo } from "react";
import { cn } from "../../lib/cn";
import { TablePaginition } from "./TablePaginition";
import { TableNoDataFound } from "./TableNoDataFound";
import {
  Table,
  TableBodySkeleton,
  sortRowsByConfig,
} from "../ui/Table";
import { createListingActionsResolver } from "./buildListingRowActions";
import { buildDefaultPropertyRowActions } from "./defaultPropertyRowActions";
import { buildPropertyTableColumns } from "./propertyTableColumns";
import { createWorkflowActionsResolver } from "./propertyTableWorkflowActions";
import { hasListingSubmissionMeta } from "./listTableListingFields";
import { resolvePinnedColumns } from "./resolvePinnedColumns";
import type { ListTableViewProps } from "./types";

export function ListTableView({
  isLoading = false,
  listTitle = "Properties",
  data,
  noDataFound,
  pagination,
  sortConfig,
  onSort,
  multiSortWithShift = true,
  columns: columnsProp,
  locale = "en",
  getRowColumnHeader,
  transposeHeaderColumnId = "title",
  minTableWidth = "100%",
  buttonSize = "md",
  canViewOwners: _canViewOwners,
  canViewAgents: _canViewAgents,
  canViewBadges: _canViewBadges,
  canViewDelete,
  onClick,
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
  onClickFavourite: _onClickFavourite,
  onClickDelete,
  rowActions: rowActionsProp,
  workflowActions,
  onRowAction,
  pinnedColumns,
  resizableColumns = true,
  columnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
  className,
  tableClassName,
}: ListTableViewProps) {
  const rowActions = useMemo(() => {
    if (rowActionsProp) {
      return rowActionsProp;
    }

    const listingActionOptions = {
      actionHandlers: workflowActions,
      onRowAction,
      onClickEmail,
      onClickCall,
      onClickWhatsApp,
      canViewDelete,
      onClickDelete,
    };

    const usesJsonRowActions = data.some((listing) => listing.actions != null);

    if (usesJsonRowActions || onRowAction || workflowActions) {
      const resolveListingActions =
        createListingActionsResolver(listingActionOptions);
      const resolveWorkflowActions = workflowActions
        ? createWorkflowActionsResolver(workflowActions)
        : null;

      return (listing: (typeof data)[number]) => {
        if (listing.actions != null) {
          return resolveListingActions(listing);
        }
        if (resolveWorkflowActions) {
          return resolveWorkflowActions(listing);
        }
        return (
          buildDefaultPropertyRowActions(listingActionOptions) ?? []
        );
      };
    }

    return buildDefaultPropertyRowActions(listingActionOptions);
  }, [
    canViewDelete,
    data,
    onClickCall,
    onClickDelete,
    onClickEmail,
    onClickWhatsApp,
    onRowAction,
    rowActionsProp,
    workflowActions,
  ]);
  const isEmpty = !isLoading && data.length === 0;
  const skeletonRows = pagination?.pageSize ?? 8;
  const showPagination = Boolean(pagination) && !isEmpty && !isLoading;

  const includeSubmissionColumn = useMemo(
    () => data.some(hasListingSubmissionMeta),
    [data],
  );

  const columns = useMemo(
    () =>
      columnsProp ??
      buildPropertyTableColumns({
        locale,
        buttonSize,
        onClick,
        rowActions,
        includeSubmissionColumn,
      }),
    [
      buttonSize,
      columnsProp,
      includeSubmissionColumn,
      locale,
      onClick,
      rowActions,
    ],
  );

  const resolveRowColumnHeader =
    getRowColumnHeader ??
    ((listing: (typeof data)[number]) =>
      listing.title[locale] || listing.title.en);

  const sortedData = useMemo(
    () =>
      sortRowsByConfig(data, sortConfig, (row, columnId) => {
        const column = columns.find((col) => col.id === columnId);
        return column?.getSortValue?.(row);
      }),
    [columns, data, sortConfig],
  );

  const resolvedPinnedColumns = useMemo(
    () => resolvePinnedColumns(pinnedColumns),
    [pinnedColumns?.left?.join("|"), pinnedColumns?.right?.join("|")],
  );

  return (
    <section
      className={cn("w-full", className)}
      aria-label={listTitle}
    >
      <Table
        columns={columns}
        data={isEmpty ? [] : sortedData}
        getRowId={(row) => String(row.id)}
        getRowColumnHeader={resolveRowColumnHeader}
        transposeHeaderColumnId={transposeHeaderColumnId}
        sortConfig={sortConfig}
        onSort={onSort}
        multiSortWithShift={multiSortWithShift}
        loading={isLoading}
        skeleton={
          <TableBodySkeleton rows={skeletonRows} columns={columns.length} />
        }
        emptyContent={
          isEmpty ? <TableNoDataFound {...noDataFound} /> : undefined
        }
        minTableWidth={minTableWidth}
        tableClassName={tableClassName}
        pinnedColumns={resolvedPinnedColumns}
        resizableColumns={resizableColumns}
        columnWidths={columnWidths}
        defaultColumnWidths={defaultColumnWidths}
        onColumnWidthsChange={onColumnWidthsChange}
        paginationFooter={
          showPagination ? (
            <TablePaginition {...pagination!} buttonSize={buttonSize} />
          ) : null
        }
      />
    </section>
  );
}

export {
  buildRowActionsFromListingDescriptors,
  createListingActionsResolver,
} from "./buildListingRowActions";
export {
  mapSubmissionApiListingToPropertyListing,
  mapSubmissionApiListingsToPropertyListings,
} from "./submissionApiListing";
export type {
  SubmissionApiListing,
  SubmissionApiListingAction,
} from "./submissionApiListing";
export { buildPropertyTableColumns } from "./propertyTableColumns";
export {
  PROPERTY_TABLE_WORKFLOW_ACTION_IDS,
  STATUS_WORKFLOW_ACTION_MATRIX,
  buildStatusBasedRowActions,
  createWorkflowActionsResolver,
  getDefaultWorkflowActionHidden,
  getWorkflowActionsForStatus,
} from "./propertyTableWorkflowActions";
export { ListingStatusBadge } from "./ListingStatusBadge";
export { TableNoDataFound } from "./TableNoDataFound";
export { TablePaginition } from "./TablePaginition";
export type {
  ListTableViewProps,
  PropertyTableRowAction,
  PropertyTableRowActionTone,
  PropertyTableRowActionsInput,
  PropertyTableWorkflowActionConfig,
  PropertyTableWorkflowActionId,
  PropertyTableWorkflowActionsConfig,
  TablePaginitionProps,
  PinnedColumns,
  TableNoDataFoundContent,
} from "./types";
export type { PropertyListingRowActionDescriptor } from "./rowActionTypes";
