"use client";

import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
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
import { AgentRowActions } from "./AgentRowActions";
import { AgentStatusBadge } from "./AgentStatusBadge";
import {
  formatAgentActivityDate,
  getAgentInitials,
  resolveAgentContacts,
} from "./agentListFields";
import { agentGridCardClassName } from "./AgentGridCard";
import type { Agent } from "./types";
import {
  resolveAgentMobileRowActionsConfig,
  type AgentMobileRowActionsConfig,
  type AgentRowActionsInput,
} from "./rowActionTypes";

type AgentMobileCardProps = {
  agent: Agent;
  rowActions?: AgentRowActionsInput<Agent>;
  mobileRowActions?: AgentMobileRowActionsConfig;
  buttonSize?: UiControlSize;
  className?: string;
};

function AgentAvatar({ name }: { name: string }) {
  return (
    <div
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary ring-1 ring-secondary/10",
        textAvatarInitialClasses,
      )}
      aria-hidden
    >
      {getAgentInitials(name)}
    </div>
  );
}

export function AgentMobileCard({
  agent,
  rowActions,
  mobileRowActions,
  buttonSize = "md",
  className,
}: AgentMobileCardProps) {
  const { email, phone } = resolveAgentContacts(agent);
  const activityLabel = formatAgentActivityDate(agent.activityDate);
  const { placement, variant } = resolveAgentMobileRowActionsConfig(mobileRowActions);
  const showHeaderActions = Boolean(rowActions) && placement === "header";
  const showInlineActions = Boolean(rowActions) && placement === "inline";
  const showFooterActions = Boolean(rowActions) && placement === "footer";

  return (
    <Card
      role="article"
      className={cn(
        agentGridCardClassName,
        "border border-secondary/10 shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <AgentAvatar name={agent.name} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "min-w-0 flex-1 truncate text-secondary",
                  textPersonNameClasses,
                )}
              >
                {agent.name}
              </h3>

              <div className="flex shrink-0 items-center gap-1">
                <AgentStatusBadge status={agent.status} />
                {showHeaderActions ? (
                  <AgentRowActions
                    row={agent}
                    rowActions={rowActions}
                    buttonSize={buttonSize}
                    ariaLabel={`Actions for ${agent.name}`}
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
                <MapPin className="size-3.5 shrink-0 text-muted" aria-hidden />
                <span className="truncate">{agent.city}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5 text-muted">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate tabular-nums">{activityLabel}</span>
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
          <AgentRowActions
            row={agent}
            rowActions={rowActions}
            buttonSize={buttonSize}
            ariaLabel={`Actions for ${agent.name}`}
            display={variant}
          />
        ) : null}

        {showFooterActions ? (
          <AgentRowActions
            row={agent}
            rowActions={rowActions}
            buttonSize={buttonSize}
            ariaLabel={`Actions for ${agent.name}`}
            display={variant}
          />
        ) : null}
      </div>
    </Card>
  );
}
