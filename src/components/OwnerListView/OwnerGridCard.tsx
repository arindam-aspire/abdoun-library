"use client";

import { cn } from "../../lib/cn";
import {
  textBodySmClasses,
  textBodyTightClasses,
  textMetaClasses,
} from "../../lib/typography";
import { Card } from "../ui/Card";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { OwnerRowActions } from "./OwnerRowActions";
import type { OwnerMobileRowActionsConfig, OwnerRowActionsInput } from "./rowActionTypes";
import { resolveOwnerMobileRowActionsConfig } from "./rowActionTypes";

export const ownerGridCardClassName = "overflow-hidden";

type OwnerGridCardProps<T> = {
  row: T;
  columns: TableColumn<T>[];
  rowActions?: OwnerRowActionsInput<T>;
  mobileRowActions?: OwnerMobileRowActionsConfig;
  buttonSize?: UiControlSize;
  titleColumnId: string;
  hiddenColumnIds: Set<string>;
  getRowLabel: (row: T) => string;
  className?: string;
};

function getColumnHeaderLabel<T>(column: TableColumn<T>): string {
  if (typeof column.header === "string") {
    return column.header;
  }
  return column.id;
}

export function OwnerGridCard<T>({
  row,
  columns,
  rowActions,
  mobileRowActions,
  buttonSize = "md",
  titleColumnId,
  hiddenColumnIds,
  getRowLabel,
  className,
}: OwnerGridCardProps<T>) {
  const titleColumn = columns.find((column) => column.id === titleColumnId);
  const statusColumn = columns.find((column) => column.id === "status");
  const bodyColumns = columns.filter(
    (column) =>
      column.id !== titleColumnId &&
      column.id !== "status" &&
      column.id !== "actions" &&
      !hiddenColumnIds.has(column.id),
  );
  const hasActions = Boolean(rowActions);
  const { placement, variant } = resolveOwnerMobileRowActionsConfig(mobileRowActions);
  const showHeaderActions = hasActions && placement === "header";
  const showFooterActions = hasActions && placement === "footer";

  return (
    <Card role="article" className={cn(ownerGridCardClassName, className)}>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {titleColumn ? (
              <div className={cn("truncate font-bold text-text", textBodyTightClasses)}>
                {titleColumn.render(row)}
              </div>
            ) : (
              <h3 className={cn("truncate font-bold text-text", textBodyTightClasses)}>
                {getRowLabel(row)}
              </h3>
            )}
          </div>
          {statusColumn ? (
            <div className="shrink-0">{statusColumn.render(row)}</div>
          ) : null}
          {showHeaderActions ? (
            <OwnerRowActions
              row={row}
              rowActions={rowActions}
              buttonSize={buttonSize}
              ariaLabel={`Actions for ${getRowLabel(row)}`}
              display={variant}
            />
          ) : null}
        </div>

        {bodyColumns.length > 0 ? (
          <dl className="m-0 grid grid-cols-1 gap-2.5">
            {bodyColumns.map((column) => (
              <div key={column.id} className="min-w-0">
                <dt className={cn("font-medium text-muted", textMetaClasses)}>
                  {getColumnHeaderLabel(column)}
                </dt>
                <dd className={cn("mt-0.5 text-text", textBodySmClasses)}>
                  {column.render(row)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {showFooterActions ? (
          <OwnerRowActions
            row={row}
            rowActions={rowActions}
            buttonSize={buttonSize}
            ariaLabel={`Actions for ${getRowLabel(row)}`}
            display={variant}
          />
        ) : null}
      </div>
    </Card>
  );
}
