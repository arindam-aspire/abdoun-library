"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/cn";
import { textBodySmClasses } from "../../lib/typography";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import {
  cardListButtonSizeClasses,
  cardListIconButtonGlyphClasses,
  cardListIconButtonSizeClasses,
  dropdownOptionSizeClasses,
} from "../ui/responsiveSizes";
import type { UiControlSize } from "../ui/commonTypes";
import {
  isAgentRowActionDisabled,
  isAgentRowActionLoading,
  resolveAgentRowActions,
  type AgentRowAction,
  type AgentRowActionsDisplay,
  type AgentRowActionsInput,
} from "./rowActionTypes";

const menuTriggerClasses = cn(
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent text-text",
  "transition-colors hover:bg-page data-active:bg-page data-open:bg-page",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

const menuItemsPanelClasses = cn(
  "z-[100] min-w-[11rem] origin-top-right rounded-xl border border-secondary-light/80 bg-surface p-1 shadow-xl ring-1 ring-black/5",
  "focus:outline-none [--anchor-gap:0.25rem] [--anchor-padding:0.5rem]",
  "transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100",
);

const menuItemButtonClasses = cn(
  "flex w-full items-center gap-2 rounded-lg text-start text-text transition-colors",
  dropdownOptionSizeClasses,
  "data-focus:bg-page data-hover:bg-page",
);

type AgentRowActionsProps<T> = {
  row: T;
  buttonSize?: UiControlSize;
  rowActions?: AgentRowActionsInput<T>;
  /** Accessible label for the menu trigger. */
  ariaLabel?: string;
  /**
   * Action presentation.
   * - `responsive` — icon buttons below `md`, menu on `md+` (table default)
   * - `menu` | `icon-buttons` | `buttons` — force a single layout (mobile cards)
   */
  display?: AgentRowActionsDisplay;
  className?: string;
  /** @deprecated Use `display="menu"` instead. */
  forceIconButtons?: boolean;
  /** @deprecated Use `display="icon-buttons"` instead. */
  forceMenu?: boolean;
};

function getActionAriaLabel<T>(action: AgentRowAction<T>): string {
  if (typeof action.label === "string") {
    return action.label;
  }
  return action.id;
}

function getActionLoadingLabel<T>(
  action: AgentRowAction<T>,
): string | undefined {
  return typeof action.loadingLabel === "string" ? action.loadingLabel : undefined;
}

function resolveAgentRowActionsDisplay({
  display = "responsive",
  forceIconButtons = false,
  forceMenu = false,
}: Pick<AgentRowActionsProps<unknown>, "display" | "forceIconButtons" | "forceMenu">): AgentRowActionsDisplay {
  if (forceMenu) {
    return "menu";
  }
  if (forceIconButtons) {
    return "icon-buttons";
  }
  return display;
}

function AgentRowActionIconButton<T>({
  row,
  action,
  buttonSize,
}: {
  row: T;
  action: AgentRowAction<T>;
  buttonSize: UiControlSize;
}) {
  const isLoading = isAgentRowActionLoading(row, action);
  const isDisabled = isAgentRowActionDisabled(row, action);
  const isDanger = action.tone === "danger";

  return (
    <IconButton
      type="button"
      size={buttonSize}
      color={isDanger ? "danger" : "inherit"}
      variant="ghost"
      icon={action.icon ?? <MoreHorizontal aria-hidden />}
      aria-label={getActionAriaLabel(action)}
      isLoading={isLoading}
      loadingLabel={getActionLoadingLabel(action)}
      disabled={isDisabled}
      onClick={(event) => {
        event.stopPropagation();
        if (isDisabled) return;
        action.onClick(row);
      }}
    />
  );
}

function AgentRowActionButtons<T>({
  row,
  actions,
  buttonSize,
  className,
}: {
  row: T;
  actions: AgentRowAction<T>[];
  buttonSize: UiControlSize;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-2",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {actions.map((action) => {
        if (action.iconOnly) {
          return (
            <AgentRowActionIconButton
              key={action.id}
              row={row}
              action={action}
              buttonSize={buttonSize}
            />
          );
        }

        const isLoading = isAgentRowActionLoading(row, action);
        const isDisabled = isAgentRowActionDisabled(row, action);
        const isDanger = action.tone === "danger";
        const label =
          isLoading && action.loadingLabel != null
            ? action.loadingLabel
            : action.label;

        return (
          <Button
            key={action.id}
            type="button"
            size="sm"
            color={isDanger ? "danger" : "inherit"}
            variant="outline"
            disabled={isDisabled}
            isLoading={isLoading}
            loadingLabel={
              typeof action.loadingLabel === "string"
                ? action.loadingLabel
                : undefined
            }
            iconStart={action.icon}
            className={cn(cardListButtonSizeClasses(buttonSize), "w-auto shrink-0")}
            onClick={(event) => {
              event.stopPropagation();
              if (isDisabled) return;
              action.onClick(row);
            }}
          >
            <span className="truncate">{label}</span>
          </Button>
        );
      })}
    </div>
  );
}

function AgentRowActionIconButtons<T>({
  row,
  actions,
  buttonSize,
  className,
}: {
  row: T;
  actions: AgentRowAction<T>[];
  buttonSize: UiControlSize;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {actions.map((action) => (
        <AgentRowActionIconButton
          key={action.id}
          row={row}
          action={action}
          buttonSize={buttonSize}
        />
      ))}
    </div>
  );
}

function AgentRowActionMenu<T>({
  row,
  actions,
  buttonSize,
  ariaLabel,
  className,
}: {
  row: T;
  actions: AgentRowAction<T>[];
  buttonSize: UiControlSize;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <Menu as="div" className={cn("relative inline-flex", className)}>
      <MenuButton
        type="button"
        aria-label={ariaLabel}
        className={cn(
          menuTriggerClasses,
          cardListIconButtonSizeClasses(buttonSize),
          cardListIconButtonGlyphClasses(buttonSize),
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <MoreHorizontal aria-hidden />
      </MenuButton>

      <MenuItems
        portal
        anchor="bottom end"
        transition
        className={menuItemsPanelClasses}
      >
        {actions.map((action) => {
          const isLoading = isAgentRowActionLoading(row, action);
          const isDisabled = isAgentRowActionDisabled(row, action);
          const isDanger = action.tone === "danger";

          return (
            <MenuItem key={action.id} disabled={isDisabled}>
              <button
                type="button"
                disabled={isDisabled}
                className={cn(
                  menuItemButtonClasses,
                  isDanger &&
                    "text-danger data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus:bg-danger/10",
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  if (isDisabled) return;
                  action.onClick(row);
                }}
              >
                {isLoading ? (
                  <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                ) : (
                  action.icon ?? null
                )}
                <span className={textBodySmClasses}>
                  {isLoading && action.loadingLabel != null
                    ? action.loadingLabel
                    : action.label}
                </span>
              </button>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}

export function AgentRowActions<T>({
  row,
  buttonSize = "md",
  rowActions,
  ariaLabel = "Row actions",
  display = "responsive",
  className,
  forceIconButtons = false,
  forceMenu = false,
}: AgentRowActionsProps<T>) {
  const actions = resolveAgentRowActions(row, rowActions);
  const resolvedDisplay = resolveAgentRowActionsDisplay({
    display,
    forceIconButtons,
    forceMenu,
  });

  if (actions.length === 0) {
    return null;
  }

  switch (resolvedDisplay) {
    case "buttons":
      return (
        <AgentRowActionButtons
          row={row}
          actions={actions}
          buttonSize={buttonSize}
          className={className}
        />
      );
    case "icon-buttons":
      return (
        <AgentRowActionIconButtons
          row={row}
          actions={actions}
          buttonSize={buttonSize}
          className={className}
        />
      );
    case "menu":
      return (
        <AgentRowActionMenu
          row={row}
          actions={actions}
          buttonSize={buttonSize}
          ariaLabel={ariaLabel}
          className={className}
        />
      );
    case "responsive":
    default:
      return (
        <>
          <AgentRowActionIconButtons
            row={row}
            actions={actions}
            buttonSize={buttonSize}
            className={cn("md:hidden", className)}
          />
          <AgentRowActionMenu
            row={row}
            actions={actions}
            buttonSize={buttonSize}
            ariaLabel={ariaLabel}
            className="hidden md:inline-flex"
          />
        </>
      );
  }
}
