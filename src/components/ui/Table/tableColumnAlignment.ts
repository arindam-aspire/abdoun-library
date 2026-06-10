import { cn } from "../../../lib/cn";
import type { TableColumn } from "./types";

export type TableColumnAlign = "start" | "center" | "end";

const TABLE_COLUMN_ALIGN_CLASSES: Record<TableColumnAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

export function getTableColumnAlign<T>(
  column: Pick<TableColumn<T>, "align">,
): TableColumnAlign {
  return column.align ?? "start";
}

export function getTableColumnAlignClass<T>(
  column: Pick<TableColumn<T>, "align">,
): string {
  return TABLE_COLUMN_ALIGN_CLASSES[getTableColumnAlign(column)];
}

export function getTableColumnHeaderButtonClass<T>(
  column: Pick<TableColumn<T>, "align">,
): string {
  const align = getTableColumnAlign(column);

  return cn(
    "-m-0.5 inline-flex w-full items-center gap-1.5 rounded-sm p-0.5 text-text",
    align === "center" && "justify-center text-center",
    align === "end" && "justify-end text-end",
    align === "start" && "justify-start text-start",
    "hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
  );
}

export function getTableColumnHeaderLabelClass<T>(
  column: Pick<TableColumn<T>, "align">,
): string {
  return getTableColumnAlign(column) === "start" ? "min-w-0 flex-1 truncate" : "";
}
