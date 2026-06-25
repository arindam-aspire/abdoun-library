import type { PinnedColumns } from "../ui/Table/pinnedColumns";

const PINNED_COLUMN_ID_ALIASES: Record<string, string> = {
  action: "actions",
};

export const DEFAULT_OWNER_PINNED_COLUMNS: PinnedColumns = {
  left: ["name"],
  right: ["actions"],
};

function mapPinnedIds(ids?: string[]): string[] | undefined {
  if (!ids) {
    return undefined;
  }

  const mapped = ids.map((id) => PINNED_COLUMN_ID_ALIASES[id] ?? id);
  return [...new Set(mapped)];
}

function filterPinnedIds(
  ids: string[] | undefined,
  columnIds: string[],
): string[] | undefined {
  if (!ids) {
    return undefined;
  }

  const visible = ids.filter((id) => columnIds.includes(id));
  return visible.length > 0 ? visible : undefined;
}

export function resolveOwnerPinnedColumns(
  pinnedColumns: PinnedColumns | undefined,
  columnIds: string[],
): PinnedColumns | undefined {
  const source = pinnedColumns ?? DEFAULT_OWNER_PINNED_COLUMNS;
  const left = filterPinnedIds(mapPinnedIds(source.left), columnIds);
  const right = filterPinnedIds(mapPinnedIds(source.right), columnIds);

  if (!left && !right) {
    return undefined;
  }

  return {
    ...(left ? { left } : {}),
    ...(right ? { right } : {}),
  };
}
