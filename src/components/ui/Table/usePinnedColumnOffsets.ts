"use client";

import {
  useLayoutEffect,
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

export function usePinnedColumnOffsets(
  columnIds: string[],
  pinnedColumns: PinnedColumns | undefined,
  tableRef: RefObject<HTMLTableElement | null>,
): Map<string, PinnedColumnMeta> {
  const columnIdsKey = columnIds.join("|");
  const pinnedColumnsKey = getPinnedColumnsKey(pinnedColumns);

  const [metaMap, setMetaMap] = useState<Map<string, PinnedColumnMeta>>(
    () => new Map(),
  );

  useLayoutEffect(() => {
    const table = tableRef.current;

    if (!table || !pinnedColumns || pinnedColumnsKey === "") {
      setMetaMap((previous) => (previous.size === 0 ? previous : new Map()));
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

      setMetaMap((previous) =>
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
  }, [columnIds, columnIdsKey, pinnedColumns, pinnedColumnsKey]);

  return metaMap;
}
