"use client";

import {
  useLayoutEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import {
  buildPinnedColumnMeta,
  getPinnedColumnsKey,
  pinnedColumnMapsEqual,
  type PinnedColumnMeta,
  type PinnedColumns,
} from "./pinnedColumns";
import {
  columnWidthsToArray,
  hasCompleteColumnWidths,
  type TableColumnWidths,
} from "./tableColumnResize";

export function usePinnedColumnOffsets(
  columnIds: string[],
  pinnedColumns: PinnedColumns | undefined,
  tableRef: RefObject<HTMLTableElement | null>,
  columnWidths?: TableColumnWidths,
): Map<string, PinnedColumnMeta> {
  const columnIdsKey = columnIds.join("|");
  const pinnedColumnsKey = getPinnedColumnsKey(pinnedColumns);
  const columnWidthsKey = columnWidths
    ? columnIds.map((id) => columnWidths[id] ?? 0).join(",")
    : "";
  const useExplicitWidths = hasCompleteColumnWidths(columnIds, columnWidths);

  const explicitMeta = useMemo(() => {
    if (!pinnedColumns || pinnedColumnsKey === "" || !useExplicitWidths) {
      return null;
    }

    return buildPinnedColumnMeta(
      columnIds,
      pinnedColumns,
      columnWidthsToArray(columnIds, columnWidths!),
    );
  }, [
    columnIds,
    columnIdsKey,
    columnWidths,
    columnWidthsKey,
    pinnedColumns,
    pinnedColumnsKey,
    useExplicitWidths,
  ]);

  const [measuredMeta, setMeasuredMeta] = useState<Map<string, PinnedColumnMeta>>(
    () => new Map(),
  );

  useLayoutEffect(() => {
    if (explicitMeta) {
      return;
    }

    const table = tableRef.current;

    if (!table || !pinnedColumns || pinnedColumnsKey === "") {
      setMeasuredMeta((previous) => (previous.size === 0 ? previous : new Map()));
      return;
    }

    let frame = 0;

    const measure = () => {
      const headerCells =
        table.querySelectorAll<HTMLTableCellElement>("thead th");
      if (headerCells.length !== columnIds.length) {
        return;
      }

      const widths = Array.from(headerCells).map(
        (cell) => cell.getBoundingClientRect().width,
      );
      const nextMeta = buildPinnedColumnMeta(columnIds, pinnedColumns, widths);

      setMeasuredMeta((previous) =>
        pinnedColumnMapsEqual(previous, nextMeta) ? previous : nextMeta,
      );
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    scheduleMeasure();

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(table);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [
    columnIds,
    columnIdsKey,
    explicitMeta,
    pinnedColumns,
    pinnedColumnsKey,
    tableRef,
  ]);

  return explicitMeta ?? measuredMeta;
}
