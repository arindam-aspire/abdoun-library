import { emptyOwnerInfoItem } from "../../hooks/useOwnerInfoFormHook";
import { NAMED_PRICING_FIELD_KEYS } from "./propertyFormConfig";
import { normalizePropertyMediaFiles } from "./propertyFormMedia";
import type {
  AmenitiesFormValues,
  BasicInfoFormValues,
  LocationInsertFormValues,
  MediaUploadFormValues,
  OwnerInfoFormValues,
  OwnerInfoItem,
  PricingCurrency,
  PricingDetailsFormValues,
  PropertyDetailsFormValues,
  PropertyFormValues,
  TermsAcceptanceFormValues,
  NormalizedPropertyFormValues,
} from "./types";

const PRICING_CURRENCIES = ["JOD", "USD", "GBP", "INR"] as const satisfies readonly PricingCurrency[];

function normalizePricingCurrency(
  value: string | undefined,
): PricingCurrency {
  return PRICING_CURRENCIES.includes(value as PricingCurrency)
    ? (value as PricingCurrency)
    : "JOD";
}

export const emptyTermsAcceptanceFormValues: TermsAcceptanceFormValues = {
  terms_accepted: false,
  privacy_accepted: false,
  public_display_authorized: false,
  fees_acknowledged: false,
};

export function areAllTermsAccepted(
  terms: TermsAcceptanceFormValues,
): boolean {
  return (
    terms.terms_accepted &&
    terms.privacy_accepted &&
    terms.public_display_authorized &&
    terms.fees_acknowledged
  );
}

export function createAcceptedTermsValues(): TermsAcceptanceFormValues {
  return {
    terms_accepted: true,
    privacy_accepted: true,
    public_display_authorized: true,
    fees_acknowledged: true,
  };
}

export function createDeclinedTermsValues(): TermsAcceptanceFormValues {
  return { ...emptyTermsAcceptanceFormValues };
}

export function normalizeListingPurposes(
  values?: Partial<BasicInfoFormValues> | null,
): string[] {
  const fromArray = (values?.listing_purposes ?? [])
    .map((value) => value.trim())
    .filter(Boolean);

  if (fromArray.length > 0) {
    return Array.from(new Set(fromArray));
  }

  const legacy = values?.listing_purpose?.trim();
  if (legacy) {
    return [legacy];
  }

  return [];
}

export function deriveLegacyListingPurpose(
  listingPurposes: string[],
): string | null {
  if (listingPurposes.length === 1) {
    return listingPurposes[0] ?? null;
  }

  return listingPurposes.length === 0 ? null : listingPurposes[0] ?? null;
}

function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function isLegacyPropertyAgeBucket(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (/^\d{4}$/.test(normalized)) {
    return false;
  }

  return true;
}

export function normalizeYearBuilt(
  values?: Partial<PropertyDetailsFormValues> | null,
): number | null {
  const yearBuilt = parseFiniteNumber(values?.year_built);
  if (yearBuilt != null) {
    return Math.trunc(yearBuilt);
  }

  const legacyAge = values?.property_age;
  if (legacyAge == null || String(legacyAge).trim() === "") {
    return null;
  }

  if (isLegacyPropertyAgeBucket(String(legacyAge))) {
    return null;
  }

  const parsedYear = parseFiniteNumber(legacyAge);
  return parsedYear != null ? Math.trunc(parsedYear) : null;
}

function firstValidAreaId(
  areaId: number | null | undefined,
  areaIds?: number[],
): number | null {
  if (areaId != null && Number.isFinite(areaId)) {
    return areaId;
  }

  const firstLegacy = (areaIds ?? []).find(
    (id) => typeof id === "number" && Number.isFinite(id),
  );

  return firstLegacy ?? null;
}

function normalizeOwnerItem(owner: Partial<OwnerInfoItem> | undefined): OwnerInfoItem {
  const fullName = owner?.full_name?.trim() || owner?.owner_name?.trim() || "";
  const ssi = owner?.ssi?.trim() || owner?.social_security_id?.trim() || "";

  return {
    ...emptyOwnerInfoItem,
    ...owner,
    owner_id: owner?.owner_id,
    owner_name: fullName,
    full_name: fullName,
    social_security_id: ssi,
    ssi,
    owner_documents: owner?.owner_documents ?? [],
  };
}

export const emptyBasicInfoFormValues: BasicInfoFormValues = {
  title: "",
  description: "",
  listing_purposes: ["sale"],
  listing_purpose: "sale",
  category_id: null,
  type_id: null,
};

export const emptyLocationInsertFormValues: LocationInsertFormValues = {
  city_id: null,
  area_id: null,
  area_ids: [],
  address: "",
  latitude: null,
  longitude: null,
  apartment_number: "",
  plot_number: "",
  basin_number: "",
  parcel_number: "",
  building_number: "",
  identification_fields: {},
};

export const emptyPropertyDetailsFormValues: PropertyDetailsFormValues = {
  bedrooms: null,
  bathrooms: null,
  built_up_area: "",
  built_up_area_unit: "SQM",
  parking_spaces: null,
  year_built: null,
  property_age: null,
  furnishing_status: null,
  floor_level: null,
  completion_status: null,
  total_floor: "",
  occupancy: null,
  ownership_type: null,
  reference_number: "",
  orientation: null,
  guard_name: "",
  guard_country_code: "+962",
  guard_phone_number: "",
};

export const emptyOwnerInfoFormValues: OwnerInfoFormValues = {
  owner_mode: "create",
  owner_id: null,
  owners: [{ ...emptyOwnerInfoItem }],
};

export const emptyPricingDetailsFormValues: PricingDetailsFormValues = {
  price: "",
  price_currency: "JOD",
  service_charge: "",
  service_charge_currency: "JOD",
  maintenance_fee: "",
  maintenance_fee_currency: "JOD",
  furnished_sale_price: "",
  unfurnished_sale_price: "",
  furnished_rent_price: "",
  unfurnished_rent_price: "",
  semi_furnished_rent_price: "",
  additional_prices: {},
};

export const emptyAmenitiesFormValues: AmenitiesFormValues = {
  selected_amenities: [],
  feature_ids: [],
};

export const emptyMediaUploadFormValues: MediaUploadFormValues = {
  media_files: [],
  youtube_url: "",
  virtual_tour_url: "",
  documents: [],
};

function mergeBasicInfo(
  values?: Partial<BasicInfoFormValues>,
): BasicInfoFormValues {
  const listing_purposes = normalizeListingPurposes(values);

  if (listing_purposes.length === 0) {
    listing_purposes.push("sale");
  }

  return {
    ...emptyBasicInfoFormValues,
    ...values,
    listing_purposes,
    listing_purpose: deriveLegacyListingPurpose(listing_purposes),
  };
}

function mergeLocationInsert(
  values?: Partial<LocationInsertFormValues>,
): LocationInsertFormValues {
  const area_id = firstValidAreaId(values?.area_id, values?.area_ids);

  return {
    ...emptyLocationInsertFormValues,
    ...values,
    area_id,
    area_ids: area_id != null ? [area_id] : [],
    latitude: parseFiniteNumber(values?.latitude),
    longitude: parseFiniteNumber(values?.longitude),
    apartment_number: values?.apartment_number ?? "",
    plot_number: values?.plot_number ?? "",
    basin_number: values?.basin_number ?? "",
    parcel_number: values?.parcel_number ?? "",
    building_number: values?.building_number ?? "",
    identification_fields: { ...values?.identification_fields },
  };
}

function mergePropertyDetails(
  values?: Partial<PropertyDetailsFormValues>,
  options?: { enableLegacyPermitDld?: boolean },
): PropertyDetailsFormValues {
  const merged: PropertyDetailsFormValues = {
    ...emptyPropertyDetailsFormValues,
    ...values,
    built_up_area_unit:
      values?.built_up_area_unit === "SQFT" ? "SQFT" : "SQM",
    year_built: normalizeYearBuilt(values),
    property_age: values?.property_age ?? null,
    furnishing_status: values?.furnishing_status ?? null,
    floor_level: values?.floor_level ?? null,
  };

  if (options?.enableLegacyPermitDld || values?.permit_dld_number) {
    merged.permit_dld_number = values?.permit_dld_number ?? "";
  } else {
    delete merged.permit_dld_number;
  }

  return merged;
}

function mergeOwnerInfo(
  values?: Partial<OwnerInfoFormValues>,
): OwnerInfoFormValues {
  const owners =
    values?.owners?.length && values.owners.length > 0
      ? values.owners.map((owner) => normalizeOwnerItem(owner))
      : emptyOwnerInfoFormValues.owners.map((owner) =>
          normalizeOwnerItem(owner),
        );

  const selectedOwnerId =
    values?.owner_id ??
    owners.find((owner) => owner.owner_id)?.owner_id ??
    null;

  return {
    owner_mode:
      values?.owner_mode ?? (selectedOwnerId ? "search" : "create"),
    owner_id: selectedOwnerId,
    owners: selectedOwnerId
      ? owners.map((owner, index) =>
          index === 0
            ? { ...owner, owner_id: owner.owner_id ?? selectedOwnerId }
            : owner,
        )
      : owners,
  };
}

function mergePricingDetails(
  values?: Partial<PricingDetailsFormValues>,
): PricingDetailsFormValues {
  const additionalPrices = { ...(values?.additional_prices ?? {}) };

  for (const [key, value] of Object.entries(values ?? {})) {
    if (
      !(NAMED_PRICING_FIELD_KEYS as readonly string[]).includes(key) &&
      ![
        "price",
        "price_currency",
        "service_charge",
        "service_charge_currency",
        "maintenance_fee",
        "maintenance_fee_currency",
        "additional_prices",
      ].includes(key) &&
      typeof value === "string"
    ) {
      additionalPrices[key] = value;
    }
  }

  return {
    ...emptyPricingDetailsFormValues,
    ...values,
    price_currency: normalizePricingCurrency(values?.price_currency),
    service_charge_currency: normalizePricingCurrency(
      values?.service_charge_currency,
    ),
    maintenance_fee_currency: normalizePricingCurrency(
      values?.maintenance_fee_currency,
    ),
    furnished_sale_price: values?.furnished_sale_price ?? "",
    unfurnished_sale_price: values?.unfurnished_sale_price ?? "",
    furnished_rent_price: values?.furnished_rent_price ?? "",
    unfurnished_rent_price: values?.unfurnished_rent_price ?? "",
    semi_furnished_rent_price: values?.semi_furnished_rent_price ?? "",
    additional_prices: additionalPrices,
  };
}

function mergeMediaUpload(
  values?: Partial<MediaUploadFormValues>,
): MediaUploadFormValues {
  return {
    ...emptyMediaUploadFormValues,
    ...values,
    media_files: normalizePropertyMediaFiles(values?.media_files ?? []),
  };
}

export function mergePropertyFormValues(
  propertyDetails: PropertyFormValues,
  options?: { enableLegacyPermitDld?: boolean },
): NormalizedPropertyFormValues {
  const {
    active_step: _activeStep,
    max_reached_step: _maxReachedStep,
    ...formSections
  } = propertyDetails;

  return {
    basic_info: mergeBasicInfo(formSections.basic_info),
    location_insert: mergeLocationInsert(formSections.location_insert),
    property_details: mergePropertyDetails(
      formSections.property_details,
      options,
    ),
    owner_info: mergeOwnerInfo(formSections.owner_info),
    pricing_details: mergePricingDetails(formSections.pricing_details),
    amenities: {
      ...emptyAmenitiesFormValues,
      ...formSections.amenities,
    },
    media_upload: mergeMediaUpload(formSections.media_upload),
    terms_acceptance: {
      ...emptyTermsAcceptanceFormValues,
      ...formSections.terms_acceptance,
    },
  };
}

export function serializePropertyFormValues(
  propertyDetails: PropertyFormValues,
): string {
  const { active_step, max_reached_step, ...formSections } = propertyDetails;

  return JSON.stringify(
    { active_step, max_reached_step, ...formSections },
    (_, value) => {
      if (typeof File !== "undefined" && value instanceof File) {
        return value.name;
      }

      return value;
    },
  );
}

export function getPricingFieldValue(
  values: PricingDetailsFormValues,
  key: string,
): string {
  if (key in values && typeof values[key as keyof PricingDetailsFormValues] === "string") {
    return values[key as keyof PricingDetailsFormValues] as string;
  }

  return values.additional_prices?.[key] ?? "";
}

export function setPricingFieldValue(
  values: PricingDetailsFormValues,
  key: string,
  value: string,
): PricingDetailsFormValues {
  if (key in emptyPricingDetailsFormValues && key !== "additional_prices") {
    return {
      ...values,
      [key]: value,
    };
  }

  return {
    ...values,
    additional_prices: {
      ...values.additional_prices,
      [key]: value,
    },
  };
}

export function getIdentificationFieldValue(
  values: LocationInsertFormValues,
  key: string,
): string {
  if (key in values && typeof values[key as keyof LocationInsertFormValues] === "string") {
    return values[key as keyof LocationInsertFormValues] as string;
  }

  return values.identification_fields?.[key] ?? "";
}

export function setIdentificationFieldValue(
  values: LocationInsertFormValues,
  key: string,
  value: string,
): LocationInsertFormValues {
  if (
    key === "apartment_number" ||
    key === "plot_number" ||
    key === "basin_number" ||
    key === "parcel_number" ||
    key === "building_number" ||
    key === "address"
  ) {
    return {
      ...values,
      [key]: value,
    };
  }

  return {
    ...values,
    identification_fields: {
      ...values.identification_fields,
      [key]: value,
    },
  };
}
