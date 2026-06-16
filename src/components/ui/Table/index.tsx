"use client";

import {
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  textBodySmClasses,
  textMetaClasses,
} from "../../../lib/typography";
import { TablePagination } from "../Pagination";
import {
  tableDesktopHeaderColumnDividerClassName,
  tableRowDividerClassName,
  tableSectionDividerClassName,
} from "./tableDividerStyles";
import {
  tableHeaderCellClassName,
  tableHeaderCellPaddingClassName,
  tableHeaderRowClassName,
} from "./tableHeaderStyles";
import { getTransposedBodyColumns } from "./tableTransposedUtils";
import { TableTransposedView } from "./TableTransposedView";
import { TableTransposedViewSkeleton } from "./TableTransposedViewSkeleton";
import {
  getTableColumnAlignClass,
  getTableColumnHeaderButtonClass,
  getTableColumnHeaderLabelClass,
} from "./tableColumnAlignment";
import {
  getPinnedCellClassName,
  getPinnedCellStyle,
} from "./pinnedColumns";
import { TableColumnResizeHandle } from "./TableColumnResizeHandle";
import {
  getColumnWidthStyle,
  hasCompleteColumnWidths,
  resizableTableCellOverflowClassName,
} from "./tableColumnResize";
import { getNextSortConfig } from "./sortUtils";
import { useColumnResize } from "./useColumnResize";
import { usePinnedColumnOffsets } from "./usePinnedColumnOffsets";
import type { SortConfig, TableColumn, TableProps } from "./types";

function mergeCellStyles(
  ...styles: Array<CSSProperties | undefined>
): CSSProperties | undefined {
  const merged = Object.assign({}, ...styles.filter(Boolean));
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export { getNextSortConfig, sortRowsByConfig } from "./sortUtils";
export { TableBodySkeleton } from "./TableBodySkeleton";
export { TableTransposedView } from "./TableTransposedView";
export { TableTransposedViewSkeleton } from "./TableTransposedViewSkeleton";
export type {
  SortConfig,
  SortDirection,
  SortRule,
  TableColumn,
  TableColumnAlign,
  TableColumnWidths,
  TablePaginationConfig,
  TableProps,
  PinnedColumns,
} from "./types";
export type { PinnedColumnMeta } from "./pinnedColumns";

function SortIndicator({
  columnId,
  sortConfig,
}: {
  columnId: string;
  sortConfig: SortConfig;
}) {
  const i = sortConfig.findIndex((r) => r.id === columnId);
  if (i === -1) {
    return (
      <ArrowUpDown
        className="size-3.5 shrink-0 opacity-40 sm:size-4"
        aria-hidden
      />
    );
  }
  const direction = sortConfig[i]!.direction;
  return (
    <span className="inline-flex items-center gap-0.5">
      {sortConfig.length > 1 ? (
        <span
          className={cn(textMetaClasses, "font-semibold text-muted")}
          aria-hidden
        >
          {i + 1}
        </span>
      ) : null}
      {direction === "asc" ? (
        <ArrowUp className="size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
      ) : (
        <ArrowDown className="size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
      )}
    </span>
  );
}

function TableMobileBody<T>({
  loading,
  error,
  errorDescription,
  errorTitle,
  data,
  emptyContent,
  emptyMessage,
  columns,
  getRowId,
  getRowColumnHeader,
  transposeHeaderColumnId,
}: {
  loading: boolean;
  error: string | null;
  errorDescription?: ReactNode;
  errorTitle?: ReactNode;
  data: T[];
  emptyContent?: ReactNode;
  emptyMessage: ReactNode;
  columns: TableColumn<T>[];
  getRowId: (row: T) => string;
  getRowColumnHeader?: (row: T) => ReactNode;
  transposeHeaderColumnId?: string;
}) {
  const bodyColumnCount = getTransposedBodyColumns(
    columns,
    transposeHeaderColumnId,
  ).length;

  if (loading) {
    return (
      <TableTransposedViewSkeleton
        fieldRows={Math.min(bodyColumnCount, 8)}
        dataColumns={3}
      />
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-left text-danger">
        {errorDescription ?? (
          <>
            <p className={cn(textBodySmClasses, "font-medium text-text")}>
              {errorTitle ?? "Something went wrong while loading this data."}
            </p>
            <p className={cn("mt-1", textBodySmClasses, "text-text/80")}>{error}</p>
          </>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("px-4 py-12 text-center text-text/80", textBodySmClasses)}>
        {emptyContent ?? emptyMessage}
      </div>
    );
  }

  return (
    <TableTransposedView
      columns={columns}
      data={data}
      getRowId={getRowId}
      getRowColumnHeader={getRowColumnHeader}
      transposeHeaderColumnId={transposeHeaderColumnId}
    />
  );
}

export function Table<T>({
  columns,
  data,
  getRowId,
  getRowColumnHeader,
  transposeHeaderColumnId,
  sortConfig,
  onSort,
  multiSortWithShift = true,
  loading = false,
  skeleton,
  error = null,
  errorDescription,
  errorTitle,
  emptyMessage = "No rows to display.",
  emptyContent,
  minTableWidth = "100%",
  pagination,
  paginationFooter,
  pinnedColumns,
  resizableColumns = false,
  columnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
  className,
  tableClassName,
}: TableProps<T>) {
  const tableRef = useRef<HTMLTableElement>(null);
  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns],
  );
  const { widths, onResizeStart, isColumnResizable } = useColumnResize({
    enabled: resizableColumns,
    columnIds,
    columns,
    tableRef,
    columnWidths,
    defaultColumnWidths,
    onColumnWidthsChange,
  });
  const desktopPinnedColumns = pinnedColumns;
  const columnsSized =
    resizableColumns && hasCompleteColumnWidths(columnIds, widths);
  const totalColumnWidth = useMemo(
    () =>
      columnsSized
        ? columnIds.reduce((sum, id) => sum + (widths[id] ?? 0), 0)
        : 0,
    [columnIds, columnsSized, widths],
  );
  const pinnedMeta = usePinnedColumnOffsets(
    columnIds,
    desktopPinnedColumns,
    tableRef,
    resizableColumns && hasCompleteColumnWidths(columnIds, widths)
      ? widths
      : undefined,
  );

  const columnAllowsPinnedOverflow = (column: TableColumn<T>) =>
    column.headerClassName?.includes("overflow-visible") ||
    column.cellClassName?.includes("overflow-visible");
  const colCount = columns.length;
  const sortableSet = new Set(
    columns.filter((c) => c.sortable && c.getSortValue).map((c) => c.id),
  );

  let paginationEl: ReactNode = null;
  if (paginationFooter) {
    paginationEl = (
      <div className={cn("border-t", tableSectionDividerClassName)}>
        {paginationFooter}
      </div>
    );
  } else if (pagination?.showWhen) {
    const { showWhen: _showWhen, ...paginationProps } = pagination;
    paginationEl = (
      <div className={cn("border-t", tableSectionDividerClassName)}>
        <TablePagination {...paginationProps} />
      </div>
    );
  }

  const onHeaderClick = (
    column: TableColumn<T>,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    if (!column.sortable || !column.getSortValue) return;
    if (!sortableSet.has(column.id)) return;
    const next = getNextSortConfig(
      sortConfig,
      column.id,
      true,
      multiSortWithShift && e.shiftKey,
    );
    onSort(next);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="sm:hidden">
        <TableMobileBody
          loading={loading}
          error={error}
          errorDescription={errorDescription}
          errorTitle={errorTitle}
          data={data}
          emptyContent={emptyContent}
          emptyMessage={emptyMessage}
          columns={columns}
          getRowId={getRowId}
          getRowColumnHeader={getRowColumnHeader}
          transposeHeaderColumnId={transposeHeaderColumnId}
        />
      </div>

      <div className="hidden w-full overflow-x-auto overflow-y-visible sm:block">
        <table
          ref={tableRef}
          className={cn(
            "w-full border-separate border-spacing-0 text-left text-text",
            columnsSized && "table-fixed",
            textBodySmClasses,
            tableClassName,
          )}
          style={{
            minWidth: columnsSized
              ? `max(100%, ${totalColumnWidth}px)`
              : minTableWidth,
          }}
        >
          {columnsSized ? (
            <colgroup>
              {columns.map((col) => (
                <col key={col.id} style={{ width: widths[col.id] }} />
              ))}
            </colgroup>
          ) : null}
          <thead>
            <tr
              className={cn(
                tableHeaderRowClassName,
                "border-b",
                tableSectionDividerClassName,
              )}
            >
              {columns.map((col) => {
                const canSort = Boolean(col.sortable && col.getSortValue);
                const rules = sortConfig;
                const activeIndex = rules.findIndex((r) => r.id === col.id);
                const ariaSort: "ascending" | "descending" | "none" | undefined =
                  !canSort
                    ? undefined
                    : activeIndex === -1
                      ? "none"
                      : rules[activeIndex]!.direction === "asc"
                        ? "ascending"
                        : "descending";
                const pinMeta = pinnedMeta.get(col.id);
                const isPinned = Boolean(pinMeta);
                const columnResizable = isColumnResizable(col);

                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      tableHeaderCellClassName,
                      tableHeaderCellPaddingClassName,
                      "font-medium",
                      tableDesktopHeaderColumnDividerClassName,
                      getTableColumnAlignClass(col),
                      textMetaClasses,
                      columnResizable && "relative",
                      columnsSized &&
                        !isPinned &&
                        col.resizable !== false &&
                        resizableTableCellOverflowClassName,
                      col.headerClassName,
                      col.className,
                      getPinnedCellClassName(pinMeta, {
                        isHeader: true,
                        allowOverflow:
                          columnResizable || columnAllowsPinnedOverflow(col),
                      }),
                    )}
                    style={mergeCellStyles(
                      columnsSized
                        ? getColumnWidthStyle(col, widths, { isPinned })
                        : undefined,
                      getPinnedCellStyle(pinMeta, { isHeader: true }),
                    )}
                    aria-sort={ariaSort}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={(e) => onHeaderClick(col, e)}
                        className={getTableColumnHeaderButtonClass(col)}
                        title={
                          multiSortWithShift
                            ? "Shift+click for multi-column sort"
                            : undefined
                        }
                      >
                        <span className={getTableColumnHeaderLabelClass(col)}>
                          {col.header}
                        </span>
                        <SortIndicator columnId={col.id} sortConfig={sortConfig} />
                      </button>
                    ) : (
                      col.header
                    )}
                    {columnResizable ? (
                      <TableColumnResizeHandle
                        onResizeStart={(event) => onResizeStart(col.id, event)}
                      />
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          {loading ? (
            skeleton
          ) : error ? (
            <tbody>
              <tr>
                <td
                  colSpan={colCount}
                  className="px-4 py-10 align-top text-left text-danger"
                >
                  {errorDescription ?? (
                    <>
                      <p className={cn(textBodySmClasses, "font-medium text-text")}>
                        {errorTitle ?? "Something went wrong while loading this data."}
                      </p>
                      <p className={cn("mt-1", textBodySmClasses, "text-text/80")}>
                        {error}
                      </p>
                      <p className={cn("mt-2", textMetaClasses)}>
                        Check your connection, refresh the page, or try again in a
                        few minutes.
                      </p>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          ) : data.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={colCount}
                  className={cn(
                    "px-4 py-12 text-center text-text/80",
                    textBodySmClasses,
                  )}
                >
                  {emptyContent ?? emptyMessage}
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={getRowId(row)} className="group">
                  {columns.map((col) => {
                    const pinMeta = pinnedMeta.get(col.id);
                    const isPinned = Boolean(pinMeta);

                    return (
                      <td
                        key={col.id}
                        className={cn(
                          "px-3 py-2.5 sm:px-4 sm:py-3",
                          rowIndex < data.length - 1 && tableRowDividerClassName,
                          getTableColumnAlignClass(col),
                          columnsSized &&
                            !isPinned &&
                            col.resizable !== false &&
                            resizableTableCellOverflowClassName,
                          col.cellClassName,
                          col.className,
                          isPinned
                            ? getPinnedCellClassName(pinMeta, {
                                allowOverflow: columnAllowsPinnedOverflow(col),
                              })
                            : "group-hover:bg-page/50",
                        )}
                        style={mergeCellStyles(
                          columnsSized
                            ? getColumnWidthStyle(col, widths, { isPinned })
                            : undefined,
                          getPinnedCellStyle(pinMeta),
                        )}
                      >
                        {col.render(row)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {paginationEl}
    </div>
  );
}
