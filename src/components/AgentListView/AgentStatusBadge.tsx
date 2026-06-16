import type { BadgeVariant } from "../ui/Badge";
import { Badge } from "../ui/Badge";
import type { AgentStatus, AgentStatusKey } from "./types";

const AGENT_STATUS_BADGE_VARIANT: Record<AgentStatusKey, BadgeVariant> = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
  suspended: "destructive",
};

type AgentStatusBadgeProps = {
  status: AgentStatus;
};

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  return (
    <Badge
      variant={AGENT_STATUS_BADGE_VARIANT[status.key]}
      appearance="soft"
      className="w-fit max-w-max shrink-0 whitespace-nowrap"
    >
      {status.label}
    </Badge>
  );
}
