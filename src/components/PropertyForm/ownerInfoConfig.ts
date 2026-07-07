import type { OwnerInfoConfig, OwnerInfoReadOnlyField } from "./types";

export const DEFAULT_OWNER_INFO_READ_ONLY_FIELDS: OwnerInfoReadOnlyField[] = [
  "owner_name",
  "country_code",
  "phone_number",
  "email",
];

export function resolveOwnerInfoReadOnlyFields(
  config?: OwnerInfoConfig,
): OwnerInfoReadOnlyField[] {
  return config?.readOnlyOwnerFields ?? DEFAULT_OWNER_INFO_READ_ONLY_FIELDS;
}

export function isOwnerInfoFieldReadOnly(
  ownerIndex: number,
  field: OwnerInfoReadOnlyField,
  config?: OwnerInfoConfig,
): boolean {
  const readOnlyIndices = config?.readOnlyOwnerIndices ?? [];

  if (!readOnlyIndices.includes(ownerIndex)) {
    return false;
  }

  return resolveOwnerInfoReadOnlyFields(config).includes(field);
}
