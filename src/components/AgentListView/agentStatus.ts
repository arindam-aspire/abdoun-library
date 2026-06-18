import type { AgentStatus, AgentStatusKey } from "./types";

const AGENT_API_STATUS_KEY_MAP: Record<string, AgentStatusKey> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  PENDING_APPROVAL: "pending",
  SUSPENDED: "suspended",
  DECLINED: "declined",
  INVITED: "invited",
};

function formatApiStatusLabel(status: string): string {
  return status
    .trim()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function mapAgentApiStatus(status: string): AgentStatus {
  const normalized = status.trim().toUpperCase();
  const key = AGENT_API_STATUS_KEY_MAP[normalized] ?? "inactive";

  return {
    key,
    label: formatApiStatusLabel(normalized || status),
  };
}
