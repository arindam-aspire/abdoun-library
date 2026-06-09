export type PinnedColumns = {
  left?: string[];
  right?: string[];
};

export type PinnedColumnMeta = {
  side: "left" | "right";
  offset: number;
  /** Outermost edge of the pinned group (shows a scroll shadow). */
  isEdge: boolean;
  /** Stacking order within the same pin side (later columns sit above earlier). */
  stackIndex: number;
};

export function buildPinnedColumnMeta(
  columnIds: string[],
  pinnedColumns: PinnedColumns | undefined,
  widths: number[],
): Map<string, PinnedColumnMeta> {
  const meta = new Map<string, PinnedColumnMeta>();
  if (!pinnedColumns) {
    return meta;
  }

  const leftIds = pinnedColumns.left ?? [];
  const rightIds = pinnedColumns.right ?? [];
  const leftSet = new Set(leftIds);
  const rightSet = new Set(rightIds);

  const leftPinnedVisible = leftIds.filter((id) => columnIds.includes(id));
  const rightPinnedVisible = rightIds.filter((id) => columnIds.includes(id));

  let leftOffset = 0;
  let leftStackIndex = 0;
  columnIds.forEach((id, index) => {
    if (!leftSet.has(id)) {
      return;
    }

    meta.set(id, {
      side: "left",
      offset: leftOffset,
      isEdge: id === leftPinnedVisible[leftPinnedVisible.length - 1],
      stackIndex: leftStackIndex,
    });
    leftOffset += widths[index] ?? 0;
    leftStackIndex += 1;
  });

  let rightOffset = 0;
  let rightStackIndex = 0;
  for (let index = columnIds.length - 1; index >= 0; index -= 1) {
    const id = columnIds[index]!;
    if (!rightSet.has(id)) {
      continue;
    }

    meta.set(id, {
      side: "right",
      offset: rightOffset,
      isEdge: id === rightPinnedVisible[0],
      stackIndex: rightStackIndex,
    });
    rightOffset += widths[index] ?? 0;
    rightStackIndex += 1;
  }

  return meta;
}

export function getPinnedCellClassName(
  meta: PinnedColumnMeta | undefined,
  { isHeader = false }: { isHeader?: boolean } = {},
): string {
  if (!meta) {
    return "";
  }

  const background = isHeader
    ? "bg-surface"
    : "bg-surface group-hover:bg-page";

  const edgeShadow =
    meta.side === "left"
      ? "shadow-[4px_0_8px_-4px] shadow-secondary/15"
      : "shadow-[-4px_0_8px_-4px] shadow-secondary/15";

  return [
    "sticky isolate overflow-visible",
    background,
    meta.isEdge ? edgeShadow : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function pinnedColumnMapsEqual(
  a: Map<string, PinnedColumnMeta>,
  b: Map<string, PinnedColumnMeta>,
): boolean {
  if (a.size !== b.size) {
    return false;
  }

  for (const [key, value] of a) {
    const other = b.get(key);
    if (
      !other ||
      other.side !== value.side ||
      Math.round(other.offset) !== Math.round(value.offset) ||
      other.isEdge !== value.isEdge ||
      other.stackIndex !== value.stackIndex
    ) {
      return false;
    }
  }

  return true;
}

export function getPinnedColumnsKey(
  pinnedColumns: PinnedColumns | undefined,
): string {
  if (!pinnedColumns) {
    return "";
  }

  return `${pinnedColumns.left?.join("|") ?? ""}:${pinnedColumns.right?.join("|") ?? ""}`;
}

export function getPinnedCellStyle(
  meta: PinnedColumnMeta | undefined,
  { isHeader = false }: { isHeader?: boolean } = {},
): { left?: number; right?: number; zIndex: number } | undefined {
  if (!meta) {
    return undefined;
  }

  const baseZIndex = isHeader ? 30 : 10;
  const sideBoost = meta.side === "right" ? 10 : 0;
  const position =
    meta.side === "left"
      ? { left: meta.offset }
      : { right: meta.offset };

  return {
    ...position,
    zIndex: baseZIndex + meta.stackIndex + sideBoost,
  };
}
