"use client";

import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { textBodySmClasses, textMetaClasses } from "../../../lib/typography";
import {
  getTableFieldLabel,
  getTransposedBodyColumns,
  getTransposeHeaderColumn,
} from "./tableTransposedUtils";
import type { TableColumn } from "./types";
import { getTableColumnAlignClass } from "./tableColumnAlignment";
import { tableColumnDividerClassName } from "./tableDividerStyles";
import {
  tableHeaderCellPaddingClassName,
  tableHeaderRowClassName,
  tablePinnedHeaderColumnClassName,
} from "./tableHeaderStyles";

const transposedDataCellBaseClassName =
  "min-w-[8.5rem] bg-page px-3 py-2.5 align-top group-hover:bg-page/80 sm:px-4 sm:py-3";

const transposedActionsCellBaseClassName =
  "min-w-0 bg-page p-0 align-middle";

const pinnedStickyClassName =
  "sticky left-0 isolate min-w-[7.5rem] max-w-[9rem]";

const pinnedHeaderCornerClassName = cn(
  pinnedStickyClassName,
  tablePinnedHeaderColumnClassName,
  "z-30 font-semibold text-secondary",
);

const pinnedFieldLabelClassName = cn(
  pinnedStickyClassName,
  tablePinnedHeaderColumnClassName,
  "z-20 font-medium text-muted",
);

type TableTransposedViewProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  getRowColumnHeader?: (row: T) => ReactNode;
  /** Omitted from field rows; defaults to the first column. */
  transposeHeaderColumnId?: string;
};

function resolveRowColumnHeader<T>(
  row: T,
  columns: TableColumn<T>[],
  getRowId: (row: T) => string,
  transposeHeaderColumnId?: string,
  getRowColumnHeader?: (row: T) => ReactNode,
) {
  if (getRowColumnHeader) {
    return getRowColumnHeader(row);
  }

  const headerColumn = getTransposeHeaderColumn(columns, transposeHeaderColumnId);
  if (headerColumn) {
    return headerColumn.render(row);
  }

  return getRowId(row);
}

export function TableTransposedView<T>({
  columns,
  data,
  getRowId,
  getRowColumnHeader,
  transposeHeaderColumnId,
}: TableTransposedViewProps<T>) {
  const bodyColumns = getTransposedBodyColumns(columns, transposeHeaderColumnId);
  const headerColumn = getTransposeHeaderColumn(columns, transposeHeaderColumnId);

  return (
    <div className="w-full overflow-x-auto overflow-y-visible">
      <table
        className={cn(
          "w-full min-w-full border-separate border-spacing-0 text-left",
          textBodySmClasses,
        )}
      >
        <thead>
          <tr className={tableHeaderRowClassName}>
            <th
              scope="col"
              className={cn(
                tableHeaderCellPaddingClassName,
                "align-bottom",
                pinnedHeaderCornerClassName,
                tableColumnDividerClassName,
              )}
            >
              {headerColumn ? (
                <span className={cn("block text-pretty", textMetaClasses)}>
                  {getTableFieldLabel(headerColumn)}
                </span>
              ) : null}
            </th>
            {data.map((row, columnIndex) => (
              <th
                key={getRowId(row)}
                scope="col"
                className={cn(
                  "min-w-[8.5rem] text-left align-bottom font-semibold text-secondary",
                  tableHeaderCellPaddingClassName,
                  tablePinnedHeaderColumnClassName,
                  textBodySmClasses,
                  columnIndex < data.length - 1 && tableColumnDividerClassName,
                )}
              >
                <span className="block max-w-[10rem] truncate">
                  {resolveRowColumnHeader(
                    row,
                    columns,
                    getRowId,
                    transposeHeaderColumnId,
                    getRowColumnHeader,
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyColumns.map((column) => {
            const isActionsColumn = column.id === "actions";

            return (
              <tr key={column.id} className="group">
                <th
                  scope="row"
                  aria-hidden={isActionsColumn || undefined}
                  className={cn(
                    "text-left align-top",
                    isActionsColumn ? "p-0" : "px-3 py-2.5 sm:px-4 sm:py-3",
                    pinnedFieldLabelClassName,
                    tableColumnDividerClassName,
                    !isActionsColumn && textMetaClasses,
                  )}
                >
                  {!isActionsColumn ? (
                    <span className="block text-pretty">
                      {getTableFieldLabel(column)}
                    </span>
                  ) : null}
                </th>
                {data.map((row, columnIndex) => (
                  <td
                    key={getRowId(row)}
                    className={cn(
                      isActionsColumn
                        ? transposedActionsCellBaseClassName
                        : transposedDataCellBaseClassName,
                      getTableColumnAlignClass(column),
                      columnIndex < data.length - 1 && tableColumnDividerClassName,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
