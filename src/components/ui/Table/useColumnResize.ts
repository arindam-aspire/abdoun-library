"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import {
  clampColumnWidth,
  getInitialColumnWidths,
  measureColumnWidths,
  type TableColumnWidths,
} from "./tableColumnResize";
import type { TableColumn } from "./types";

type UseColumnResizeOptions<T> = {
  enabled: boolean;
  columnIds: string[];
  columns: TableColumn<T>[];
  tableRef: RefObject<HTMLTableElement | null>;
  columnWidths?: TableColumnWidths;
  defaultColumnWidths?: TableColumnWidths;
  onColumnWidthsChange?: (widths: TableColumnWidths) => void;
};

export function useColumnResize<T>({
  enabled,
  columnIds,
  columns,
  tableRef,
  columnWidths: controlledWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
}: UseColumnResizeOptions<T>) {
  const columnMap = useRef(new Map(columns.map((column) => [column.id, column])));
  columnMap.current = new Map(columns.map((column) => [column.id, column]));

  const [internalWidths, setInternalWidths] = useState<TableColumnWidths>(() =>
    getInitialColumnWidths(columnIds, columns, defaultColumnWidths),
  );

  const widths = controlledWidths ?? internalWidths;
  const isControlled = controlledWidths != null;

  const setWidths = useCallback(
    (updater: (previous: TableColumnWidths) => TableColumnWidths) => {
      const previous = controlledWidths ?? internalWidths;
      const next = updater(previous);

      if (!isControlled) {
        setInternalWidths(next);
      }
      onColumnWidthsChange?.(next);
    },
    [controlledWidths, internalWidths, isControlled, onColumnWidthsChange],
  );

  const columnIdsKey = columnIds.join("|");

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const table = tableRef.current;
    if (!table) {
      return;
    }

    const measure = () => {
      const measured = measureColumnWidths(table, columnIds);
      if (Object.keys(measured).length === 0) {
        return;
      }

      setWidths((previous) => {
        const missing = columnIds.some(
          (id) => previous[id] == null || previous[id] <= 0,
        );
        if (!missing) {
          return previous;
        }

        const next = { ...previous };
        columnIds.forEach((id) => {
          if ((next[id] == null || next[id] <= 0) && measured[id] != null) {
            next[id] = measured[id]!;
          }
        });
        return next;
      });
    };

    measure();

    const observer = new ResizeObserver(() => {
      setWidths((previous) => {
        const missing = columnIds.some(
          (id) => previous[id] == null || previous[id] <= 0,
        );
        if (!missing) {
          return previous;
        }
        const measured = measureColumnWidths(table, columnIds);
        if (Object.keys(measured).length === 0) {
          return previous;
        }
        const next = { ...previous };
        columnIds.forEach((id) => {
          if ((next[id] == null || next[id] <= 0) && measured[id] != null) {
            next[id] = measured[id]!;
          }
        });
        return next;
      });
    });
    observer.observe(table);

    return () => observer.disconnect();
  }, [columnIds, columnIdsKey, enabled, setWidths, tableRef]);

  const onResizeStart = useCallback(
    (columnId: string, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!enabled) {
        return;
      }

      const column = columnMap.current.get(columnId);
      if (column?.resizable === false) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth =
        widths[columnId] ??
        (event.currentTarget.parentElement?.getBoundingClientRect().width ?? 0);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = clampColumnWidth(column, startWidth + delta);
        setWidths((previous) => ({
          ...previous,
          [columnId]: nextWidth,
        }));
      };

      const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        document.body.style.removeProperty("cursor");
        document.body.style.removeProperty("user-select");
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [enabled, setWidths, widths],
  );

  const isColumnResizable = useCallback(
    (column: TableColumn<T>) => enabled && column.resizable !== false,
    [enabled],
  );

  return {
    widths,
    onResizeStart,
    isColumnResizable,
  };
}
