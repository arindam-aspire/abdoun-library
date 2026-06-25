import { cn } from "../../lib/cn";
import type { BadgeVariant } from "../ui/Badge";
import { Badge } from "../ui/Badge";
import type { AgentStatus, AgentStatusKey } from "./types";

const AGENT_STATUS_BADGE_VARIANT: Record<AgentStatusKey, BadgeVariant> = {
  active: "success",
  inactive: "outline",
  pending: "warning",
  suspended: "destructive",
  declined: "destructive",
  invited: "info",
};

const AGENT_STATUS_BADGE_CLASSNAME: Partial<Record<AgentStatusKey, string>> = {
  inactive: "border-muted/30 bg-muted/15 text-muted shadow-none ring-0",
};

type AgentStatusBadgeProps = {
  status: AgentStatus;
};

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  return (
    <Badge
      variant={AGENT_STATUS_BADGE_VARIANT[status.key]}
      appearance="soft"
      className={cn(
        "w-fit max-w-max shrink-0 whitespace-nowrap",
        AGENT_STATUS_BADGE_CLASSNAME[status.key],
      )}
    >
      {status.label}
    </Badge>
  );
}
