import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  UserMinus,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import type { PropertyListingStatusKey } from "../PropertyCardList/listingStatus";
import type { PropertyListing } from "../PropertyCardList/types";
import type { PropertyTableRowAction } from "./rowActionTypes";
import { resolvePropertyTableRowActions } from "./rowActionTypes";

export const PROPERTY_TABLE_WORKFLOW_ACTION_IDS = [
  "view",
  "approve",
  "reject",
  "continue",
  "assign",
  "reassign",
  "unassign",
] as const;

export type PropertyTableWorkflowActionId =
  (typeof PROPERTY_TABLE_WORKFLOW_ACTION_IDS)[number];

/**
 * Which workflow actions are available per listing status.
 * Use each action's `hidden` / `disabled` in `workflowActions` for conditional cases (*, ‡, §, ¶, †).
 */
export const STATUS_WORKFLOW_ACTION_MATRIX: Record<
  PropertyListingStatusKey,
  readonly PropertyTableWorkflowActionId[]
> = {
  draft: ["view", "continue", "reassign", "unassign"],
  in_progress: ["view", "continue", "reassign", "unassign"],
  submitted: ["view", "approve", "reject", "assign", "reassign", "unassign"],
  pending_approval: ["view", "reassign", "unassign"],
  pending_admin_approval: ["view", "reassign", "unassign"],
  changes_requested: ["view", "reassign", "unassign"],
  approved: ["view", "assign", "reassign", "unassign"],
  verified: ["view", "assign", "reassign", "unassign"],
  rejected: ["view", "reassign", "unassign"],
};

export type PropertyTableWorkflowActionConfig = {
  onClick: (listing: PropertyListing) => void;
  label?: string;
  icon?: ReactNode;
  hidden?: boolean | ((listing: PropertyListing) => boolean);
  disabled?: boolean | ((listing: PropertyListing) => boolean);
  loading?: boolean | ((listing: PropertyListing) => boolean);
  loadingLabel?: string;
};

/** Handler config keyed by workflow action id (JSON-friendly from the host app). */
export type PropertyTableWorkflowActionsConfig = Partial<
  Record<PropertyTableWorkflowActionId, PropertyTableWorkflowActionConfig>
>;

const WORKFLOW_ACTION_LABELS: Record<PropertyTableWorkflowActionId, string> = {
  view: "View",
  approve: "Approve",
  reject: "Reject",
  continue: "Continue",
  assign: "Assign",
  reassign: "Reassign",
  unassign: "Unassign",
};

const WORKFLOW_ACTION_ICONS: Record<
  PropertyTableWorkflowActionId,
  ReactNode
> = {
  view: <Eye className="size-4 shrink-0" aria-hidden />,
  approve: <CheckCircle2 className="size-4 shrink-0" aria-hidden />,
  reject: <XCircle className="size-4 shrink-0" aria-hidden />,
  continue: <ArrowRight className="size-4 shrink-0" aria-hidden />,
  assign: <UserPlus className="size-4 shrink-0" aria-hidden />,
  reassign: <Users className="size-4 shrink-0" aria-hidden />,
  unassign: <UserMinus className="size-4 shrink-0" aria-hidden />,
};

export function getWorkflowActionsForStatus(
  statusKey: PropertyListingStatusKey,
): readonly PropertyTableWorkflowActionId[] {
  return STATUS_WORKFLOW_ACTION_MATRIX[statusKey] ?? [];
}

export function buildStatusBasedRowActions(
  listing: PropertyListing,
  workflowActions: PropertyTableWorkflowActionsConfig,
): PropertyTableRowAction[] {
  const allowedActionIds = getWorkflowActionsForStatus(listing.status.key);

  const actions = allowedActionIds.flatMap((actionId) => {
    const config = workflowActions[actionId];
    if (!config) {
      return [];
    }

    return [
      {
        id: actionId,
        label: config.label ?? WORKFLOW_ACTION_LABELS[actionId],
        icon: config.icon ?? WORKFLOW_ACTION_ICONS[actionId],
        onClick: config.onClick,
        tone: actionId === "reject" ? "danger" : "default",
        hidden: config.hidden,
        disabled: config.disabled,
        loading: config.loading,
        loadingLabel: config.loadingLabel,
      } satisfies PropertyTableRowAction,
    ];
  });

  return resolvePropertyTableRowActions(listing, actions);
}

export function createWorkflowActionsResolver(
  workflowActions: PropertyTableWorkflowActionsConfig,
) {
  return (listing: PropertyListing) =>
    buildStatusBasedRowActions(listing, workflowActions);
}
