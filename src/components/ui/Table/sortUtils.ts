import type { SortConfig } from "./types";

/**
 * Next sort state after a header click. Single click: one primary column (asc, then toggles).
 * Shift+click: add or toggle a column in the multi-sort chain.
 */
export function getNextSortConfig(
  prev: SortConfig,
  columnId: string,
  sortable: boolean,
  shiftKey: boolean,
): SortConfig {
  if (!sortable) return prev;
  if (shiftKey) {
    const i = prev.findIndex((r) => r.id === columnId);
    if (i === -1) return [...prev, { id: columnId, direction: "asc" as const }];
    const next = [...prev];
    const cur = next[i]!;
    next[i] = {
      id: columnId,
      direction: cur.direction === "asc" ? "desc" : "asc",
    };
    return next;
  }
  if (prev.length === 1 && prev[0]!.id === columnId) {
    return [
      {
        id: columnId,
        direction: prev[0]!.direction === "asc" ? "desc" : "asc",
      },
    ];
  }
  return [{ id: columnId, direction: "asc" }];
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (
    typeof a === "number" &&
    typeof b === "number" &&
    !Number.isNaN(a) &&
    !Number.isNaN(b)
  ) {
    return a - b;
  }
  const aStr = String(a);
  const bStr = String(b);
  if (/^\d{4}-\d{2}-\d{2}/.test(aStr) && /^\d{4}-\d{2}-\d{2}/.test(bStr)) {
    const ta = Date.parse(aStr);
    const tb = Date.parse(bStr);
    if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta - tb;
  }
  return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
}

/** Client-side sort for current rows only. Does not call APIs. */
export function sortRowsByConfig<T>(
  rows: T[],
  config: SortConfig,
  getValue: (row: T, columnId: string) => unknown,
): T[] {
  if (config.length === 0) return rows;
  return [...rows].sort((a, b) => {
    for (const rule of config) {
      const va = getValue(a, rule.id);
      const vb = getValue(b, rule.id);
      const c = compareValues(va, vb);
      if (c !== 0) return rule.direction === "asc" ? c : -c;
    }
    return 0;
  });
}
