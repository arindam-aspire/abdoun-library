"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { TableNoDataFound } from "../ListTableView/TableNoDataFound";
import type { TableNoDataFoundContent } from "../ListTableView/TableNoDataFound";
import { isAgentRow } from "./agentListFields";
import { AgentGridCard } from "./AgentGridCard";
import { AgentGridSkeleton } from "./AgentGridSkeleton";
import { AgentMobileCard } from "./AgentMobileCard";
import type { Agent } from "./types";
import type { AgentRowActionsInput, AgentMobileRowActionsConfig } from "./rowActionTypes";

type AgentGridViewProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel: (row: T) => string;
  rowActions?: AgentRowActionsInput<T>;
  mobileRowActions?: AgentMobileRowActionsConfig;
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

export function AgentGridView<T>({
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
}: AgentGridViewProps<T>) {
  if (isLoading) {
    return <AgentGridSkeleton count={loadingCount} className={className} />;
  }

  if (isEmpty) {
    return (
      <div className={cn("rounded-xl border border-secondary/10 bg-card-background", className)}>
        <TableNoDataFound
          title={noDataFound?.title ?? "No agents found"}
          description={
            noDataFound?.description ??
            "Try adjusting your filters or search terms to find matching agents."
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

    if (mobileCardVariant === "auto" && isAgentRow(row)) {
      const agent = row as Agent;
      return (
        <AgentMobileCard
          agent={agent}
          rowActions={
            rowActions as AgentRowActionsInput<Agent> | undefined
          }
          mobileRowActions={mobileRowActions}
          buttonSize={buttonSize}
          className={cardClassName}
        />
      );
    }

    return (
      <AgentGridCard
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
