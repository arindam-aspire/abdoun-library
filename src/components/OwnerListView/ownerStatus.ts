import type { OwnerStatus, OwnerStatusKey } from "./types";

const OWNER_API_STATUS_KEY_MAP: Record<string, OwnerStatusKey> = {
  ACTIVE: "active",
  INACTIVE: "suspended",
  SUSPENDED: "suspended",
};

function formatApiStatusLabel(status: string): string {
  return status
    .trim()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function mapOwnerApiStatus(status: string): OwnerStatus {
  const normalized = status.trim().toUpperCase();
  const key = OWNER_API_STATUS_KEY_MAP[normalized] ?? "suspended";

  return {
    key,
    label: formatApiStatusLabel(normalized || status),
  };
}
