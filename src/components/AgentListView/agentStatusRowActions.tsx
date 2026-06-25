import {
  Ban,
  CheckCircle,
  RotateCw,
  ShieldPlus,
  Trash2,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Agent } from "./types";
import type { AgentStatusKey } from "./types";
import type { AgentRowActionTone, AgentRowActionsInput } from "./rowActionTypes";

export const AGENT_WORKFLOW_ACTION_IDS = [
  "activate",
  "approve",
  "deactivate",
  "decline",
  "grant_admin",
  "resend",
  "revoke",
  "remove",
] as const;

export type AgentWorkflowActionId = (typeof AGENT_WORKFLOW_ACTION_IDS)[number];

export type AgentWorkflowActionsConfig = Partial<
  Record<AgentWorkflowActionId, (agent: Agent) => void>
>;

type AgentWorkflowActionDefinition = {
  id: AgentWorkflowActionId;
  label: string;
  icon: ReactNode;
  tone?: AgentRowActionTone;
  iconOnly?: boolean;
};

const WORKFLOW_ACTION_ICONS: Record<AgentWorkflowActionId, ReactNode> = {
  activate: <UserCheck className="size-4 shrink-0" aria-hidden />,
  approve: <CheckCircle className="size-4 shrink-0" aria-hidden />,
  deactivate: <UserX className="size-4 shrink-0" aria-hidden />,
  decline: <XCircle className="size-4 shrink-0" aria-hidden />,
  grant_admin: <ShieldPlus className="size-4 shrink-0" aria-hidden />,
  resend: <RotateCw className="size-4 shrink-0" aria-hidden />,
  revoke: <Ban className="size-4 shrink-0" aria-hidden />,
  remove: <Trash2 className="size-4 shrink-0" aria-hidden />,
};

export const AGENT_STATUS_WORKFLOW_ACTION_MATRIX: Record<
  AgentStatusKey,
  AgentWorkflowActionDefinition[]
> = {
  active: [
    { id: "deactivate", label: "Deactivate", icon: WORKFLOW_ACTION_ICONS.deactivate },
    { id: "grant_admin", label: "Grant Admin", icon: WORKFLOW_ACTION_ICONS.grant_admin },
    { id: "remove", label: "Remove", icon: WORKFLOW_ACTION_ICONS.remove, tone: "danger", iconOnly: true },
  ],
  inactive: [
    { id: "activate", label: "Activate", icon: WORKFLOW_ACTION_ICONS.activate },
    { id: "remove", label: "Remove", icon: WORKFLOW_ACTION_ICONS.remove, tone: "danger", iconOnly: true },
  ],
  pending: [
    { id: "approve", label: "Approve", icon: WORKFLOW_ACTION_ICONS.approve },
    { id: "decline", label: "Decline", icon: WORKFLOW_ACTION_ICONS.decline },
    { id: "remove", label: "Remove", icon: WORKFLOW_ACTION_ICONS.remove, tone: "danger", iconOnly: true },
  ],
  suspended: [
    { id: "activate", label: "Activate", icon: WORKFLOW_ACTION_ICONS.activate },
    { id: "remove", label: "Remove", icon: WORKFLOW_ACTION_ICONS.remove, tone: "danger", iconOnly: true },
  ],
  declined: [
    {
      id: "remove",
      label: "Delete",
      icon: WORKFLOW_ACTION_ICONS.remove,
      tone: "danger",
      iconOnly: true,
    },
  ],
  invited: [
    { id: "resend", label: "Resend", icon: WORKFLOW_ACTION_ICONS.resend },
    { id: "revoke", label: "Revoke", icon: WORKFLOW_ACTION_ICONS.revoke },
  ],
};

export function hasAgentWorkflowActions(
  handlers?: AgentWorkflowActionsConfig,
): handlers is AgentWorkflowActionsConfig {
  if (!handlers) {
    return false;
  }
  return AGENT_WORKFLOW_ACTION_IDS.some((id) => handlers[id] != null);
}

export function buildAgentStatusRowActions(
  handlers: AgentWorkflowActionsConfig = {},
): AgentRowActionsInput<Agent> {
  return (agent) =>
    (AGENT_STATUS_WORKFLOW_ACTION_MATRIX[agent.status.key] ?? []).flatMap(
      (definition) => {
        const onClick = handlers[definition.id];
        if (!onClick) {
          return [];
        }

        return [
          {
            id: definition.id,
            label: definition.label,
            icon: definition.icon,
            tone: definition.tone,
            iconOnly: definition.iconOnly,
            onClick,
          },
        ];
      },
    );
}
