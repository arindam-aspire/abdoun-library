"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/cn";
import { textBodySmClasses } from "../../lib/typography";
import type { PropertyListing } from "../PropertyCardList/types";
import { IconButton } from "../ui/IconButton";
import {
  cardListIconButtonGlyphClasses,
  cardListIconButtonSizeClasses,
  dropdownOptionSizeClasses,
} from "../ui/responsiveSizes";
import type { UiControlSize } from "../ui/commonTypes";
import {
  isPropertyTableRowActionDisabled,
  isPropertyTableRowActionLoading,
  resolvePropertyTableRowActions,
  type PropertyTableRowAction,
  type PropertyTableRowActionsInput,
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

type PropertyTableRowActionsProps = {
  listing: PropertyListing;
  buttonSize?: UiControlSize;
  rowActions?: PropertyTableRowActionsInput;
};

function getActionAriaLabel(action: PropertyTableRowAction): string {
  if (typeof action.label === "string") {
    return action.label;
  }
  return action.id;
}

function getActionLoadingLabel(action: PropertyTableRowAction): string | undefined {
  return typeof action.loadingLabel === "string" ? action.loadingLabel : undefined;
}

type RowActionControlProps = {
  listing: PropertyListing;
  action: PropertyTableRowAction;
  buttonSize: UiControlSize;
};

function PropertyTableRowActionIconButton({
  listing,
  action,
  buttonSize,
}: RowActionControlProps) {
  const isLoading = isPropertyTableRowActionLoading(listing, action);
  const isDisabled = isPropertyTableRowActionDisabled(listing, action);
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
        action.onClick(listing);
      }}
    />
  );
}

export function PropertyTableRowActions({
  listing,
  buttonSize = "md",
  rowActions,
}: PropertyTableRowActionsProps) {
  const actions = resolvePropertyTableRowActions(listing, rowActions);

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="inline-flex items-center gap-0.5 sm:hidden"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {actions.map((action) => (
          <PropertyTableRowActionIconButton
            key={action.id}
            listing={listing}
            action={action}
            buttonSize={buttonSize}
          />
        ))}
      </div>

      <Menu as="div" className="relative hidden sm:inline-flex">
        <MenuButton
          type="button"
          aria-label={`Actions for ${listing.reference_number ?? listing.property_id}`}
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
            const isLoading = isPropertyTableRowActionLoading(listing, action);
            const isDisabled = isPropertyTableRowActionDisabled(listing, action);
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
                    action.onClick(listing);
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
    </>
  );
}
