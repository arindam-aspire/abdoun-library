import { Mail, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textMetaClasses } from "../../lib/typography";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { AgentRowActions } from "./AgentRowActions";
import { AgentStatusBadge } from "./AgentStatusBadge";
import {
  buildAgentStatusRowActions,
  hasAgentWorkflowActions,
  type AgentWorkflowActionsConfig,
} from "./agentStatusRowActions";
import {
  formatAgentActivityDate,
  formatOptionalAgentText,
  resolveAgentContacts,
  resolveAgentDisplayName,
} from "./agentListFields";
import type { Agent } from "./types";

function AgentNameCell({
  agent,
  onClick,
}: {
  agent: Agent;
  onClick?: (agent: Agent) => void;
}) {
  const label = formatOptionalAgentText(agent.name);
  const content = (
    <span
      className={cn(
        "block w-full min-w-0 truncate font-medium text-secondary",
        textBodySmClasses,
        !agent.name?.trim() && "text-muted",
      )}
    >
      {label}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(agent)}
        className="block w-full min-w-0 text-start underline-offset-2 hover:underline"
      >
        {content}
      </button>
    );
  }

  return content;
}

function AgentEmailCell({ agent }: { agent: Agent }) {
  const { email, phone } = resolveAgentContacts(agent);

  return (
    <div className="flex min-w-0 flex-col gap-0.5 text-start">
      <span
        className={cn(
          "inline-flex min-w-0 items-center gap-1.5 truncate",
          textBodySmClasses,
        )}
      >
        <Mail className="size-3.5 shrink-0 text-muted" aria-hidden />
        <span className="truncate">{email}</span>
      </span>
      {phone ? (
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1.5 truncate",
            textMetaClasses,
          )}
        >
          <Phone className="size-3.5 shrink-0 text-muted" aria-hidden />
          <span className="truncate">{phone}</span>
        </span>
      ) : null}
    </div>
  );
}

export function buildAgentTableColumns({
  buttonSize = "md",
  onClick,
  workflowActions,
}: {
  buttonSize?: UiControlSize;
  onClick?: (agent: Agent) => void;
  workflowActions?: AgentWorkflowActionsConfig;
} = {}): TableColumn<Agent>[] {
  const rowActions = hasAgentWorkflowActions(workflowActions)
    ? buildAgentStatusRowActions(workflowActions)
    : undefined;
  const showActions = Boolean(rowActions);

  const columns: TableColumn<Agent>[] = [
    {
      id: "name",
      header: "Name",
      align: "start",
      sortable: true,
      minWidth: 160,
      getSortValue: (row) => row.name?.trim() ?? "",
      render: (row) => <AgentNameCell agent={row} onClick={onClick} />,
    },
    {
      id: "email",
      header: "Email",
      align: "start",
      sortable: true,
      minWidth: 180,
      getSortValue: (row) => [row.email, row.phone].filter(Boolean).join(" "),
      render: (row) => <AgentEmailCell agent={row} />,
    },
    {
      id: "city",
      header: "City",
      align: "start",
      sortable: true,
      getSortValue: (row) => row.city?.trim() ?? "",
      cellClassName: "truncate",
      render: (row) => (
        <span
          className={cn(
            "block w-full min-w-0 truncate",
            row.city?.trim() ? "text-text/80" : "text-muted",
          )}
        >
          {formatOptionalAgentText(row.city)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: 140,
      minWidth: 120,
      getSortValue: (row) => row.status.label,
      cellClassName: "whitespace-nowrap",
      render: (row) => (
        <div className="flex justify-center">
          <AgentStatusBadge status={row.status} />
        </div>
      ),
    },
    {
      id: "activityDate",
      header: "Activity Date",
      align: "start",
      sortable: true,
      minWidth: 140,
      getSortValue: (row) => row.activityDate,
      cellClassName: "whitespace-nowrap tabular-nums",
      render: (row) => formatAgentActivityDate(row.activityDate),
    },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      header: "",
      align: "center",
      width: 48,
      minWidth: 48,
      maxWidth: 80,
      resizable: false,
      headerClassName: "w-12 overflow-visible p-0",
      cellClassName: "overflow-visible p-0",
      render: (row) => (
        <div className="flex justify-center">
          <AgentRowActions
            row={row}
            buttonSize={buttonSize}
            rowActions={rowActions}
            ariaLabel={`Actions for ${resolveAgentDisplayName(row)}`}
          />
        </div>
      ),
    });
  }

  return columns;
}
