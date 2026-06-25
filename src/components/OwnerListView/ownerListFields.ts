import type { Owner } from "./types";

export const EMPTY_OWNER_FIELD_VALUE = "—";

const joinedAtFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatOptionalOwnerText(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed || EMPTY_OWNER_FIELD_VALUE;
}

export function formatOwnerJoinedAt(value: string): string {
  if (!value.trim()) {
    return EMPTY_OWNER_FIELD_VALUE;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return EMPTY_OWNER_FIELD_VALUE;
  }

  return joinedAtFormatter.format(date);
}

export function resolveOwnerDisplayName(owner: Owner): string {
  return owner.name.trim();
}

export function resolveOwnerContacts(owner: Owner): {
  email?: string;
  phone?: string;
} {
  return {
    email: owner.email?.trim() || undefined,
    phone: owner.phone?.trim() || undefined,
  };
}

export function getOwnerInitials(owner: Pick<Owner, "name">): string {
  const name = owner.name.trim();
  if (!name) {
    return "O";
  }

  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0]!.charAt(0).toUpperCase();
  }

  return `${words[0]!.charAt(0)}${words[1]!.charAt(0)}`.toUpperCase();
}

export function isOwnerRow(row: unknown): row is Owner {
  if (typeof row !== "object" || row === null) {
    return false;
  }

  const candidate = row as Partial<Owner>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.propertyOwned === "number" &&
    typeof candidate.joinedAt === "string" &&
    candidate.joinedAt.trim().length > 0 &&
    typeof candidate.status === "object" &&
    candidate.status !== null &&
    typeof candidate.status.key === "string" &&
    typeof candidate.status.label === "string"
  );
}
