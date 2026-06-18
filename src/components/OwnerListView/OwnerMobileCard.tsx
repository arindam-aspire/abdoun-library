"use client";

import { Building2, CalendarDays, Mail, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import {
  textAvatarInitialClasses,
  textBodySmClasses,
  textBodyTightClasses,
  textPersonDetailClasses,
  textPersonNameClasses,
} from "../../lib/typography";
import { Card } from "../ui/Card";
import type { UiControlSize } from "../ui/commonTypes";
import { OwnerRowActions } from "./OwnerRowActions";
import { OwnerStatusBadge } from "./OwnerStatusBadge";
import {
  formatOwnerJoinedAt,
  formatPropertyOwnedCount,
  getOwnerInitials,
  resolveOwnerContacts,
  resolveOwnerDisplayName,
} from "./ownerListFields";
import { ownerGridCardClassName } from "./OwnerGridCard";
import type { Owner } from "./types";
import {
  resolveOwnerMobileRowActionsConfig,
  type OwnerMobileRowActionsConfig,
  type OwnerRowActionsInput,
} from "./rowActionTypes";

type OwnerMobileCardProps = {
  owner: Owner;
  rowActions?: OwnerRowActionsInput<Owner>;
  mobileRowActions?: OwnerMobileRowActionsConfig;
  buttonSize?: UiControlSize;
  className?: string;
};

function OwnerAvatar({ owner }: { owner: Owner }) {
  return (
    <div
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary ring-1 ring-secondary/10",
        textAvatarInitialClasses,
      )}
      aria-hidden
    >
      {getOwnerInitials(owner)}
    </div>
  );
}

export function OwnerMobileCard({
  owner,
  rowActions,
  mobileRowActions,
  buttonSize = "md",
  className,
}: OwnerMobileCardProps) {
  const displayName = resolveOwnerDisplayName(owner);
  const { email, phone } = resolveOwnerContacts(owner);
  const joinedLabel = formatOwnerJoinedAt(owner.joinedAt);
  const propertyLabel = formatPropertyOwnedCount(owner.propertyOwned);
  const { placement, variant } = resolveOwnerMobileRowActionsConfig(mobileRowActions);
  const showHeaderActions = Boolean(rowActions) && placement === "header";
  const showInlineActions = Boolean(rowActions) && placement === "inline";
  const showFooterActions = Boolean(rowActions) && placement === "footer";
  const actionAriaLabel = `Actions for ${displayName}`;

  return (
    <Card
      role="article"
      className={cn(
        ownerGridCardClassName,
        "border border-secondary/10 shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <OwnerAvatar owner={owner} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "min-w-0 flex-1 truncate text-secondary",
                  textPersonNameClasses,
                )}
              >
                {displayName}
              </h3>

              <div className="flex shrink-0 items-center gap-1">
                <OwnerStatusBadge status={owner.status} />
                {showHeaderActions ? (
                  <OwnerRowActions
                    row={owner}
                    rowActions={rowActions}
                    buttonSize={buttonSize}
                    ariaLabel={actionAriaLabel}
                    display={variant}
                  />
                ) : null}
              </div>
            </div>

            <div
              className={cn(
                "mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-text/80",
                textBodyTightClasses,
              )}
            >
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Building2 className="size-3.5 shrink-0 text-muted" aria-hidden />
                <span className="truncate">{propertyLabel}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5 text-muted">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate tabular-nums">{joinedLabel}</span>
              </span>
            </div>
          </div>
        </div>

        {email || phone ? (
          <div className="rounded-lg bg-page p-3">
            {email ? (
              <a
                href={`mailto:${email}`}
                className={cn(
                  "flex min-w-0 items-center gap-2 text-text transition-colors hover:text-secondary",
                  textBodySmClasses,
                )}
              >
                <Mail className="size-4 shrink-0 text-muted" aria-hidden />
                <span className="truncate">{email}</span>
              </a>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className={cn(
                  "flex min-w-0 items-center gap-2 text-text transition-colors hover:text-secondary",
                  phone && email ? "mt-2" : undefined,
                  textPersonDetailClasses,
                )}
              >
                <Phone className="size-4 shrink-0 text-muted" aria-hidden />
                <span className="truncate">{phone}</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {showInlineActions ? (
          <OwnerRowActions
            row={owner}
            rowActions={rowActions}
            buttonSize={buttonSize}
            ariaLabel={actionAriaLabel}
            display={variant}
          />
        ) : null}

        {showFooterActions ? (
          <OwnerRowActions
            row={owner}
            rowActions={rowActions}
            buttonSize={buttonSize}
            ariaLabel={actionAriaLabel}
            display={variant}
          />
        ) : null}
      </div>
    </Card>
  );
}
