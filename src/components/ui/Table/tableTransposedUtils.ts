import type { ReactNode } from "react";
import type { TableColumn } from "./types";

const FIELD_LABELS: Record<string, string> = {
  title: "Property",
  propertyType: "Type",
};

export function getTableFieldLabel<T>(column: TableColumn<T>): ReactNode {
  if (column.header === "" || column.header == null) {
    return null;
  }

  if (typeof column.header === "string") {
    return column.header;
  }

  return FIELD_LABELS[column.id] ?? column.header ?? column.id;
}

export function getTransposeHeaderColumnId<T>(
  columns: TableColumn<T>[],
  transposeHeaderColumnId?: string,
): string | undefined {
  return transposeHeaderColumnId ?? columns[0]?.id;
}

export function getTransposeHeaderColumn<T>(
  columns: TableColumn<T>[],
  transposeHeaderColumnId?: string,
): TableColumn<T> | undefined {
  const headerColumnId = getTransposeHeaderColumnId(columns, transposeHeaderColumnId);
  if (!headerColumnId) return undefined;
  return columns.find((column) => column.id === headerColumnId);
}

/** Field rows in the transposed layout (excludes the column used as scrollable column headers). */
export function getTransposedBodyColumns<T>(
  columns: TableColumn<T>[],
  transposeHeaderColumnId?: string,
): TableColumn<T>[] {
  const omitId = getTransposeHeaderColumnId(columns, transposeHeaderColumnId);
  if (!omitId) return columns;
  return columns.filter((column) => column.id !== omitId);
}
