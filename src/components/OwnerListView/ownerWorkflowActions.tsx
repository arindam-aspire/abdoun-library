import { Eye, Trash2, UserCheck, UserX } from "lucide-react";
import type { ReactNode } from "react";
import type { Owner } from "./types";
import type { OwnerRowActionTone, OwnerRowActionsInput } from "./rowActionTypes";

export const OWNER_WORKFLOW_ACTION_IDS = [
  "view",
  "activate",
  "suspend",
  "delete",
] as const;

export type OwnerWorkflowActionId = (typeof OWNER_WORKFLOW_ACTION_IDS)[number];

export type OwnerWorkflowActionsConfig = Partial<
  Record<OwnerWorkflowActionId, (owner: Owner) => void>
>;

type OwnerWorkflowActionDefinition = {
  id: OwnerWorkflowActionId;
  label: string;
  icon: ReactNode;
  tone?: OwnerRowActionTone;
  iconOnly?: boolean;
};

const WORKFLOW_ACTION_ICONS: Record<OwnerWorkflowActionId, ReactNode> = {
  view: <Eye className="size-4 shrink-0" aria-hidden />,
  activate: <UserCheck className="size-4 shrink-0" aria-hidden />,
  suspend: <UserX className="size-4 shrink-0" aria-hidden />,
  delete: <Trash2 className="size-4 shrink-0" aria-hidden />,
};

const OWNER_STATUS_WORKFLOW_ACTION_MATRIX: Record<
  Owner["status"]["key"],
  OwnerWorkflowActionDefinition[]
> = {
  active: [
    { id: "view", label: "View", icon: WORKFLOW_ACTION_ICONS.view },
    {
      id: "suspend",
      label: "Suspend",
      icon: WORKFLOW_ACTION_ICONS.suspend,
    },
    {
      id: "delete",
      label: "Delete",
      icon: WORKFLOW_ACTION_ICONS.delete,
      tone: "danger",
      iconOnly: true,
    },
  ],
  suspended: [
    { id: "view", label: "View", icon: WORKFLOW_ACTION_ICONS.view },
    {
      id: "activate",
      label: "Activate",
      icon: WORKFLOW_ACTION_ICONS.activate,
    },
    {
      id: "delete",
      label: "Delete",
      icon: WORKFLOW_ACTION_ICONS.delete,
      tone: "danger",
      iconOnly: true,
    },
  ],
};

export function hasOwnerWorkflowActions(
  handlers?: OwnerWorkflowActionsConfig,
): handlers is OwnerWorkflowActionsConfig {
  if (!handlers) {
    return false;
  }
  return OWNER_WORKFLOW_ACTION_IDS.some((id) => handlers[id] != null);
}

export function buildOwnerRowActions(
  handlers: OwnerWorkflowActionsConfig = {},
): OwnerRowActionsInput<Owner> {
  return (owner) =>
    (OWNER_STATUS_WORKFLOW_ACTION_MATRIX[owner.status.key] ?? []).flatMap(
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
