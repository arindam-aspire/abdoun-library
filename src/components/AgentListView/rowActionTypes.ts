import type { ReactNode } from "react";

export type AgentRowActionTone = "default" | "danger";

export type AgentRowAction<T> = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick: (row: T) => void;
  tone?: AgentRowActionTone;
  /** Render as a compact icon button (label used for aria-label). */
  iconOnly?: boolean;
  hidden?: boolean | ((row: T) => boolean);
  disabled?: boolean | ((row: T) => boolean);
  loading?: boolean | ((row: T) => boolean);
  loadingLabel?: ReactNode;
};

export type AgentRowActionsInput<T> =
  | AgentRowAction<T>[]
  | ((row: T) => AgentRowAction<T>[]);

/** Where row actions render on mobile cards (`< md`). */
export type AgentMobileRowActionsPlacement = "header" | "footer" | "inline";

/**
 * How row actions render on mobile cards.
 * - `menu` — overflow `…` menu
 * - `icon-buttons` — compact icon buttons
 * - `buttons` — labeled buttons (best for footer placement)
 */
export type AgentMobileRowActionsVariant = "menu" | "icon-buttons" | "buttons";

export type AgentMobileRowActionsConfig = {
  placement?: AgentMobileRowActionsPlacement;
  variant?: AgentMobileRowActionsVariant;
};

export const DEFAULT_AGENT_MOBILE_ROW_ACTIONS: AgentMobileRowActionsConfig = {
  placement: "inline",
  variant: "buttons",
};

export function resolveAgentMobileRowActionsConfig(
  config?: AgentMobileRowActionsConfig,
): Required<AgentMobileRowActionsConfig> {
  return {
    placement: config?.placement ?? DEFAULT_AGENT_MOBILE_ROW_ACTIONS.placement!,
    variant: config?.variant ?? DEFAULT_AGENT_MOBILE_ROW_ACTIONS.variant!,
  };
}

export type AgentRowActionsDisplay =
  | "responsive"
  | AgentMobileRowActionsVariant;

export function resolveAgentRowActions<T>(
  row: T,
  rowActions?: AgentRowActionsInput<T>,
): AgentRowAction<T>[] {
  if (!rowActions) {
    return [];
  }

  const items = typeof rowActions === "function" ? rowActions(row) : rowActions;

  return items.filter((action) => {
    if (action.hidden == null) {
      return true;
    }
    return typeof action.hidden === "function" ? !action.hidden(row) : !action.hidden;
  });
}

export function isAgentRowActionLoading<T>(
  row: T,
  action: AgentRowAction<T>,
): boolean {
  if (action.loading == null) {
    return false;
  }
  return typeof action.loading === "function" ? action.loading(row) : action.loading;
}

export function isAgentRowActionDisabled<T>(
  row: T,
  action: AgentRowAction<T>,
): boolean {
  if (isAgentRowActionLoading(row, action)) {
    return true;
  }
  if (action.disabled == null) {
    return false;
  }
  return typeof action.disabled === "function"
    ? action.disabled(row)
    : action.disabled;
}
