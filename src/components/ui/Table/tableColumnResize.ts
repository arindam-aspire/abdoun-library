import type { TableColumn } from "./types";

export const DEFAULT_MIN_COLUMN_WIDTH = 72;
export const DEFAULT_MAX_COLUMN_WIDTH = 640;

export type TableColumnWidths = Record<string, number>;

export function getInitialColumnWidths<T>(
  columnIds: string[],
  columns: TableColumn<T>[],
  defaultWidths?: TableColumnWidths,
): TableColumnWidths {
  const columnMap = new Map(columns.map((column) => [column.id, column]));
  const widths: TableColumnWidths = {};

  columnIds.forEach((id) => {
    const fromDefaults = defaultWidths?.[id];
    const fromColumn = columnMap.get(id)?.width;
    if (fromDefaults != null) {
      widths[id] = fromDefaults;
    } else if (fromColumn != null) {
      widths[id] = fromColumn;
    }
  });

  return widths;
}

export function measureColumnWidths(
  table: HTMLTableElement,
  columnIds: string[],
): TableColumnWidths {
  const headerCells = table.querySelectorAll<HTMLTableCellElement>("thead th");
  if (headerCells.length !== columnIds.length) {
    return {};
  }

  const widths: TableColumnWidths = {};
  columnIds.forEach((id, index) => {
    const measured = headerCells[index]?.getBoundingClientRect().width;
    if (measured && measured > 0) {
      widths[id] = Math.round(measured);
    }
  });

  return widths;
}

export function clampColumnWidth<T>(
  column: TableColumn<T> | undefined,
  nextWidth: number,
): number {
  const minWidth = column?.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
  const maxWidth = column?.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH;
  return Math.min(Math.max(nextWidth, minWidth), maxWidth);
}

export function getColumnWidthStyle<T>(
  column: TableColumn<T>,
  widths: TableColumnWidths | undefined,
  { isPinned = false }: { isPinned?: boolean } = {},
): { width?: number; minWidth?: number; maxWidth?: number } | undefined {
  const width = widths?.[column.id] ?? column.width;
  if (width == null) {
    return undefined;
  }

  if (isPinned) {
    return { width, minWidth: width, maxWidth: width };
  }

  return {
    width,
    minWidth: column.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH,
  };
}

export const resizableTableCellOverflowClassName = "overflow-hidden";

export function columnWidthsToArray(
  columnIds: string[],
  widths: TableColumnWidths,
): number[] {
  return columnIds.map((id) => widths[id] ?? 0);
}

export function hasCompleteColumnWidths(
  columnIds: string[],
  widths: TableColumnWidths | undefined,
): widths is TableColumnWidths {
  if (!widths) {
    return false;
  }
  return columnIds.every((id) => widths[id] != null && widths[id] > 0);
}
