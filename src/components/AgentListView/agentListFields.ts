import type { Agent } from "./types";

const activityDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatAgentActivityDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return activityDateFormatter.format(date);
}

export function resolveAgentContacts(agent: Agent): {
  email?: string;
  phone?: string;
} {
  return {
    email: agent.email?.trim() || undefined,
    phone: agent.phone?.trim() || undefined,
  };
}

export function getAgentInitials(name?: string | null): string {
  if (!name) return "A";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  if (words.length === 1) return words[0]!.charAt(0).toUpperCase();
  return `${words[0]!.charAt(0)}${words[1]!.charAt(0)}`.toUpperCase();
}

export function isAgentRow(row: unknown): row is Agent {
  if (typeof row !== "object" || row === null) {
    return false;
  }

  const candidate = row as Partial<Agent>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.city === "string" &&
    typeof candidate.activityDate === "string" &&
    typeof candidate.status === "object" &&
    candidate.status !== null &&
    typeof candidate.status.key === "string" &&
    typeof candidate.status.label === "string"
  );
}
