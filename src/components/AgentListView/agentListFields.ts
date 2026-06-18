import type { Agent } from "./types";

export const EMPTY_AGENT_FIELD_VALUE = "—";

const activityDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatOptionalAgentText(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed || EMPTY_AGENT_FIELD_VALUE;
}

export function formatAgentActivityDate(value: string): string {
  if (!value.trim()) {
    return EMPTY_AGENT_FIELD_VALUE;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return EMPTY_AGENT_FIELD_VALUE;
  }

  return activityDateFormatter.format(date);
}

export function resolveAgentDisplayName(agent: Agent): string {
  const name = agent.name?.trim();
  if (name) {
    return name;
  }
  return agent.email.trim();
}

export function resolveAgentContacts(agent: Agent): {
  email: string;
  phone?: string;
} {
  return {
    email: agent.email.trim(),
    phone: agent.phone?.trim() || undefined,
  };
}

export function getAgentInitials(agent: Pick<Agent, "name" | "email">): string {
  const name = agent.name?.trim();
  if (name) {
    const words = name.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return "A";
    }
    if (words.length === 1) {
      return words[0]!.charAt(0).toUpperCase();
    }
    return `${words[0]!.charAt(0)}${words[1]!.charAt(0)}`.toUpperCase();
  }

  const email = agent.email.trim();
  if (!email) {
    return "A";
  }

  const localPart = email.split("@")[0] ?? "";
  if (localPart.length >= 2) {
    return localPart.slice(0, 2).toUpperCase();
  }

  return localPart.charAt(0).toUpperCase() || "A";
}

export function isAgentRow(row: unknown): row is Agent {
  if (typeof row !== "object" || row === null) {
    return false;
  }

  const candidate = row as Partial<Agent>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    candidate.email.trim().length > 0 &&
    typeof candidate.activityDate === "string" &&
    candidate.activityDate.trim().length > 0 &&
    typeof candidate.status === "object" &&
    candidate.status !== null &&
    typeof candidate.status.key === "string" &&
    typeof candidate.status.label === "string"
  );
}
