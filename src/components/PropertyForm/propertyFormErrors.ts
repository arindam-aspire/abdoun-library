import type {
  PropertyFormFieldErrors,
  PropertyFormNavigateReason,
  PropertyFormSectionKey,
  PropertyFormStepErrors,
} from "./types";

export const PROPERTY_FORM_FIELD_PATH_ATTR = "data-property-form-field";

const SECTION_STEP_MAP: Record<string, number> = {
  basic_information: 1,
  basic_info: 1,
  location: 2,
  location_insert: 2,
  property_details: 3,
  owner_information: 4,
  owner_info: 4,
  pricing: 5,
  pricing_details: 5,
  features: 6,
  amenities: 6,
  media_documents: 7,
  media_upload: 7,
};

const FIELD_PATH_ALIASES: Record<string, string> = {
  "basic_information.listing_purposes": "basic_info.listing_purposes",
  "basic_information.listing_purpose": "basic_info.listing_purposes",
  "basic_info.listing_purpose": "basic_info.listing_purposes",
  "location.area_id": "location_insert.area_id",
  "location.area_ids": "location_insert.area_id",
  "location.latitude": "location_insert.latitude",
  "location.longitude": "location_insert.longitude",
  "owner_information.owners.0.email": "owner_info.owners.0.email",
  "pricing.furnished_rent_price": "pricing_details.furnished_rent_price",
  "pricing.furnished_sale_price": "pricing_details.furnished_sale_price",
  "pricing.unfurnished_rent_price": "pricing_details.unfurnished_rent_price",
  "pricing.unfurnished_sale_price": "pricing_details.unfurnished_sale_price",
  "pricing.semi_furnished_rent_price": "pricing_details.semi_furnished_rent_price",
  "media_documents.images": "media_upload.media_files",
};

export function normalizePropertyFormFieldPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (FIELD_PATH_ALIASES[trimmed]) {
    return FIELD_PATH_ALIASES[trimmed];
  }

  const ownerAlias = trimmed.replace(
    /^owner_information\./,
    "owner_info.",
  );
  if (ownerAlias !== trimmed) {
    return ownerAlias;
  }

  const locationAlias = trimmed.replace(/^location\./, "location_insert.");
  if (locationAlias !== trimmed) {
    return locationAlias;
  }

  const pricingAlias = trimmed.replace(/^pricing\./, "pricing_details.");
  if (pricingAlias !== trimmed) {
    return pricingAlias;
  }

  const basicAlias = trimmed.replace(/^basic_information\./, "basic_info.");
  if (basicAlias !== trimmed) {
    return basicAlias;
  }

  return trimmed;
}

export function getStepNumberForFieldPath(path: string): number | null {
  const normalized = normalizePropertyFormFieldPath(path);
  const section = normalized.split(".")[0] ?? "";
  return SECTION_STEP_MAP[section] ?? null;
}

export function getStepNumberForSection(
  section: PropertyFormSectionKey | number | string,
): number | null {
  if (typeof section === "number" && Number.isFinite(section)) {
    return section;
  }

  return SECTION_STEP_MAP[String(section)] ?? null;
}

export function getFirstExternalErrorPath(
  fieldErrors?: PropertyFormFieldErrors,
  stepErrors?: PropertyFormStepErrors,
): { step: number; fieldPath?: string } | null {
  const fieldPaths = Object.entries(fieldErrors ?? {}).filter(
    ([, message]) => Boolean(message?.trim()),
  );

  if (fieldPaths.length > 0) {
    const [path] = fieldPaths[0]!;
    const normalized = normalizePropertyFormFieldPath(path);
    return {
      step: getStepNumberForFieldPath(normalized) ?? 1,
      fieldPath: normalized,
    };
  }

  const stepEntries = Object.entries(stepErrors ?? {}).filter(
    ([, message]) => Boolean(message?.trim()),
  );

  if (stepEntries.length > 0) {
    const [section] = stepEntries[0]!;
    const numericStep = Number(section);
    return {
      step: Number.isFinite(numericStep)
        ? numericStep
        : (getStepNumberForSection(section) ?? 1),
    };
  }

  return null;
}

export function getExternalFieldError(
  fieldErrors: PropertyFormFieldErrors | undefined,
  ...paths: string[]
): string | undefined {
  if (!fieldErrors) {
    return undefined;
  }

  for (const path of paths) {
    const direct = fieldErrors[path];
    if (direct?.trim()) {
      return direct;
    }

    const normalized = normalizePropertyFormFieldPath(path);
    if (normalized !== path && fieldErrors[normalized]?.trim()) {
      return fieldErrors[normalized];
    }

    const aliased = Object.entries(fieldErrors).find(
      ([key, message]) =>
        Boolean(message?.trim()) &&
        normalizePropertyFormFieldPath(key) === normalized,
    );
    if (aliased?.[1]) {
      return aliased[1];
    }
  }

  return undefined;
}

export function mergeFieldError(
  clientError?: string,
  externalError?: string,
): string | undefined {
  const client = clientError?.trim();
  const external = externalError?.trim();

  if (client && external && client !== external) {
    return `${client} ${external}`;
  }

  return client || external || undefined;
}

export function propertyFormFieldProps(path: string) {
  return {
    [PROPERTY_FORM_FIELD_PATH_ATTR]: path,
    id: `property-form-field-${path.replace(/\./g, "-")}`,
  };
}

export function focusPropertyFormField(fieldPath?: string): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const targetPath = fieldPath
    ? normalizePropertyFormFieldPath(fieldPath)
    : undefined;
  const selector = targetPath
    ? `[${PROPERTY_FORM_FIELD_PATH_ATTR}="${targetPath}"]`
    : `[${PROPERTY_FORM_FIELD_PATH_ATTR}]`;
  const node = document.querySelector<HTMLElement>(selector);

  if (!node) {
    return false;
  }

  node.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusable =
    node.matches("input, textarea, button, select, [tabindex]")
      ? node
      : node.querySelector<HTMLElement>(
          "input, textarea, button, select, [tabindex]",
        );

  focusable?.focus();
  return true;
}

export type PropertyFormNavigateRequest = {
  step: number;
  fieldPath?: string;
  reason: PropertyFormNavigateReason;
};
