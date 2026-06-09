import type { PinnedColumns } from "../ui/Table/pinnedColumns";

const PINNED_COLUMN_ID_ALIASES: Record<string, string> = {
  property: "title",
  action: "actions",
};

function mapPinnedIds(ids?: string[]): string[] | undefined {
  if (!ids) {
    return undefined;
  }

  return ids.map((id) => PINNED_COLUMN_ID_ALIASES[id] ?? id);
}

/** Maps consumer-friendly pin ids (`property`, `action`) to table column ids. */
export function resolvePinnedColumns(
  pinnedColumns?: PinnedColumns,
): PinnedColumns | undefined {
  if (!pinnedColumns) {
    return undefined;
  }

  return {
    left: mapPinnedIds(pinnedColumns.left),
    right: mapPinnedIds(pinnedColumns.right),
  };
}
