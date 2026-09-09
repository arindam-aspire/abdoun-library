import type {
  OwnerInfoItem,
  PropertyOwnerDuplicateIdentityField,
  PropertyOwnerSearchResult,
} from "./types";

export function normalizeOwnerPhone(
  countryCode?: string,
  phoneNumber?: string,
): string {
  return `${countryCode ?? ""}${phoneNumber ?? ""}`.replace(/\D/g, "");
}

export function normalizeOwnerIdentityValue(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

export function ownerItemToSearchResult(
  owner: OwnerInfoItem,
): PropertyOwnerSearchResult | null {
  if (!owner.owner_id) {
    return null;
  }

  return {
    owner_id: owner.owner_id,
    full_name: owner.full_name || owner.owner_name,
    email: owner.email,
    country_code: owner.country_code,
    phone_number: owner.phone_number,
    nationality: owner.nationality,
    ssi: owner.ssi || owner.social_security_id,
    owner_documents: owner.owner_documents,
  };
}

export function searchResultToOwnerItem(
  result: PropertyOwnerSearchResult,
  fallback: OwnerInfoItem,
): OwnerInfoItem {
  const fullName = result.full_name ?? fallback.full_name ?? fallback.owner_name;
  const ssi = result.ssi ?? fallback.ssi ?? fallback.social_security_id;

  return {
    ...fallback,
    owner_id: result.owner_id,
    owner_name: fullName,
    full_name: fullName,
    email: result.email ?? fallback.email,
    country_code: result.country_code ?? fallback.country_code,
    phone_number: result.phone_number ?? fallback.phone_number,
    nationality: result.nationality ?? fallback.nationality,
    social_security_id: ssi,
    ssi,
    owner_documents: result.owner_documents ?? fallback.owner_documents,
  };
}

export function findDuplicateOwnerMatch(
  owner: Pick<
    OwnerInfoItem,
    "email" | "country_code" | "phone_number" | "ssi" | "social_security_id"
  >,
  results: PropertyOwnerSearchResult[],
  fields: PropertyOwnerDuplicateIdentityField[],
): PropertyOwnerSearchResult | null {
  const email = normalizeOwnerIdentityValue(owner.email);
  const phone = normalizeOwnerPhone(owner.country_code, owner.phone_number);
  const ssi = normalizeOwnerIdentityValue(owner.ssi || owner.social_security_id);

  for (const result of results) {
    if (fields.includes("email") && email && normalizeOwnerIdentityValue(result.email) === email) {
      return result;
    }

    if (
      fields.includes("phone") &&
      phone &&
      normalizeOwnerPhone(result.country_code, result.phone_number) === phone
    ) {
      return result;
    }

    if (fields.includes("ssi") && ssi && normalizeOwnerIdentityValue(result.ssi) === ssi) {
      return result;
    }

    if (fields.includes("duplicate_key") && result.duplicate_key) {
      return result;
    }
  }

  return null;
}
