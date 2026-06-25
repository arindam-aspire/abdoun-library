"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { TableNoDataFound } from "../ListTableView/TableNoDataFound";
import type { TableNoDataFoundContent } from "../ListTableView/TableNoDataFound";
import { isOwnerRow } from "./ownerListFields";
import { OwnerGridCard } from "./OwnerGridCard";
import { OwnerGridSkeleton } from "./OwnerGridSkeleton";
import { OwnerMobileCard } from "./OwnerMobileCard";
import type { Owner } from "./types";
import type { OwnerMobileRowActionsConfig, OwnerRowActionsInput } from "./rowActionTypes";

type OwnerGridViewProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel: (row: T) => string;
  rowActions?: OwnerRowActionsInput<T>;
  mobileRowActions?: OwnerMobileRowActionsConfig;
  buttonSize?: UiControlSize;
  gridTitleColumnId: string;
  gridHiddenColumnIds: Set<string>;
  renderGridCard?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  mobileCardVariant?: "auto" | "generic";
  isLoading?: boolean;
  loadingCount?: number;
  isEmpty?: boolean;
  noDataFound?: TableNoDataFoundContent;
  className?: string;
  cardClassName?: string;
};

export function OwnerGridView<T>({
  data,
  columns,
  getRowId,
  getRowLabel,
  rowActions,
  mobileRowActions,
  buttonSize = "md",
  gridTitleColumnId,
  gridHiddenColumnIds,
  renderGridCard,
  onRowClick,
  mobileCardVariant = "auto",
  isLoading = false,
  loadingCount = 4,
  isEmpty = false,
  noDataFound,
  className,
  cardClassName,
}: OwnerGridViewProps<T>) {
  if (isLoading) {
    return <OwnerGridSkeleton count={loadingCount} className={className} />;
  }

  if (isEmpty) {
    return (
      <div className={cn("rounded-xl border border-secondary/10 bg-card-background", className)}>
        <TableNoDataFound
          title={noDataFound?.title ?? "No owners found"}
          description={
            noDataFound?.description ??
            "Try adjusting your filters or search terms to find matching owners."
          }
          actions={noDataFound?.actions}
        />
      </div>
    );
  }

  const renderCard = (row: T) => {
    if (renderGridCard) {
      return renderGridCard(row);
    }

    if (mobileCardVariant === "auto" && isOwnerRow(row)) {
      const owner = row as Owner;
      return (
        <OwnerMobileCard
          owner={owner}
          rowActions={rowActions as OwnerRowActionsInput<Owner> | undefined}
          mobileRowActions={mobileRowActions}
          buttonSize={buttonSize}
          className={cardClassName}
        />
      );
    }

    return (
      <OwnerGridCard
        row={row}
        columns={columns}
        rowActions={rowActions}
        mobileRowActions={mobileRowActions}
        buttonSize={buttonSize}
        titleColumnId={gridTitleColumnId}
        hiddenColumnIds={gridHiddenColumnIds}
        getRowLabel={getRowLabel}
        className={cardClassName}
      />
    );
  };

  return (
    <ul className={cn("m-0 flex list-none flex-col gap-3 p-0", className)}>
      {data.map((row) => (
        <li key={getRowId(row)}>{renderCard(row)}</li>
      ))}
    </ul>
  );
}
