import type {
  PropertyFormConfig,
  PropertyFormIdentificationFieldLabels,
  PropertyFormMapLocationLabels,
  PropertyFormOption,
  PropertyFormOwnerModeLabels,
  PropertyFormPricingFieldLabels,
  PropertyIdentificationFieldDefinition,
  PropertyOwnerDuplicateIdentityField,
  PropertyPricingFieldDefinition,
} from "./types";

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_LISTING_PURPOSE_OPTIONS: PropertyFormOption[] = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_FURNISHING_STATUS_OPTIONS: PropertyFormOption[] = [
  { value: "furnished", label: "Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi_furnished", label: "Semi-Furnished" },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_FLOOR_LEVEL_OPTIONS: PropertyFormOption[] = [
  { value: "ground", label: "Ground" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "penthouse", label: "Penthouse" },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_COMPLETION_STATUS_OPTIONS: PropertyFormOption[] = [
  { value: "ready", label: "Ready" },
  { value: "off-plan", label: "Off-plan" },
  { value: "under-construction", label: "Under construction" },
  { value: "secondary", label: "Secondary" },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_ORIENTATION_OPTIONS: PropertyFormOption[] = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "northeast", label: "Northeast" },
  { value: "northwest", label: "Northwest" },
  { value: "southeast", label: "Southeast" },
  { value: "southwest", label: "Southwest" },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_NATIONALITY_OPTIONS: PropertyFormOption[] = [
  { value: "jordanian", label: "Jordanian" },
  { value: "saudi", label: "Saudi" },
  { value: "emirati", label: "Emirati" },
  { value: "egyptian", label: "Egyptian" },
  { value: "other", label: "Other" },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_OWNER_MODE_LABELS: Required<PropertyFormOwnerModeLabels> =
  {
    searchExisting: "Search Existing Owner",
    createNew: "Create New Owner",
    searchPlaceholder: "Search by name, email, phone, or SSI",
    searchEmpty: "No matching owners found.",
    searchLoading: "Searching owners…",
    selectOwner: "Select owner",
    selectedOwner: "Selected owner",
    duplicateDetected:
      "An owner with matching identity details already exists.",
    duplicateSelectExisting:
      "Select the existing owner to continue. Creating a duplicate is not allowed.",
  };

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_PRICING_FIELD_LABELS: Required<PropertyFormPricingFieldLabels> =
  {
    price: "Price",
    currency: "Currency",
    serviceCharge: "Service Charge",
    maintenanceFee: "Maintenance Fee",
    furnishedSalePrice: "Furnished Sale Price",
    unfurnishedSalePrice: "Unfurnished Sale Price",
    furnishedRentPrice: "Furnished Rent Price",
    unfurnishedRentPrice: "Unfurnished Rent Price",
    semiFurnishedRentPrice: "Semi-Furnished Rent Price",
  };

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_IDENTIFICATION_FIELD_LABELS: Required<PropertyFormIdentificationFieldLabels> =
  {
    apartmentNumber: "Apartment Number",
    plotNumber: "Plot Number",
    basinNumber: "Basin Number",
    parcelNumber: "Parcel Number",
    buildingNumber: "Building Number",
  };

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_MAP_LOCATION_LABELS: Required<PropertyFormMapLocationLabels> =
  {
    mapTitle: "Map Location",
    latitude: "Latitude",
    longitude: "Longitude",
    coordinates: "Coordinates",
    selectPinHint: "Select or drag the pin to set the property location.",
  };

export const BUILT_IN_IDENTIFICATION_FIELD_KEYS = [
  "apartment_number",
  "plot_number",
  "basin_number",
  "parcel_number",
  "building_number",
] as const;

export const NAMED_PRICING_FIELD_KEYS = [
  "furnished_sale_price",
  "unfurnished_sale_price",
  "furnished_rent_price",
  "unfurnished_rent_price",
  "semi_furnished_rent_price",
] as const;

export type NamedPricingFieldKey = (typeof NAMED_PRICING_FIELD_KEYS)[number];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_PRICING_FIELDS: PropertyPricingFieldDefinition[] = [
  {
    key: "furnished_sale_price",
    label: DEPRECATED_PRICING_FIELD_LABELS.furnishedSalePrice,
    purpose: "sale",
    furnishingStatus: "furnished",
  },
  {
    key: "unfurnished_sale_price",
    label: DEPRECATED_PRICING_FIELD_LABELS.unfurnishedSalePrice,
    purpose: "sale",
    furnishingStatus: "unfurnished",
  },
  {
    key: "furnished_rent_price",
    label: DEPRECATED_PRICING_FIELD_LABELS.furnishedRentPrice,
    purpose: "rent",
    furnishingStatus: "furnished",
  },
  {
    key: "unfurnished_rent_price",
    label: DEPRECATED_PRICING_FIELD_LABELS.unfurnishedRentPrice,
    purpose: "rent",
    furnishingStatus: "unfurnished",
  },
  {
    key: "semi_furnished_rent_price",
    label: DEPRECATED_PRICING_FIELD_LABELS.semiFurnishedRentPrice,
    purpose: "rent",
    furnishingStatus: "semi_furnished",
  },
];

/** @deprecated Compatibility defaults used only when the host omits `config`. */
export const DEPRECATED_IDENTIFICATION_FIELDS: PropertyIdentificationFieldDefinition[] =
  [
    {
      key: "apartment_number",
      label: DEPRECATED_IDENTIFICATION_FIELD_LABELS.apartmentNumber,
    },
    {
      key: "plot_number",
      label: DEPRECATED_IDENTIFICATION_FIELD_LABELS.plotNumber,
    },
    {
      key: "basin_number",
      label: DEPRECATED_IDENTIFICATION_FIELD_LABELS.basinNumber,
    },
    {
      key: "parcel_number",
      label: DEPRECATED_IDENTIFICATION_FIELD_LABELS.parcelNumber,
    },
    {
      key: "building_number",
      label: DEPRECATED_IDENTIFICATION_FIELD_LABELS.buildingNumber,
    },
  ];

export const DEFAULT_OWNER_SEARCH_DEBOUNCE_MS = 300;

export const DEFAULT_DUPLICATE_IDENTITY_FIELDS: PropertyOwnerDuplicateIdentityField[] =
  ["email", "phone", "ssi", "duplicate_key"];

export type ResolvedPropertyFormConfig = {
  listingPurposeOptions: PropertyFormOption[];
  furnishingStatusOptions: PropertyFormOption[];
  floorLevelOptions: PropertyFormOption[];
  completionStatusOptions: PropertyFormOption[];
  orientationOptions: PropertyFormOption[];
  nationalityOptions: PropertyFormOption[];
  ownerModeLabels: Required<PropertyFormOwnerModeLabels>;
  pricingFieldLabels: Required<PropertyFormPricingFieldLabels>;
  pricingFields: PropertyPricingFieldDefinition[];
  identificationFieldLabels: Required<PropertyFormIdentificationFieldLabels>;
  identificationFields: PropertyIdentificationFieldDefinition[];
  extraIdentificationFields: PropertyIdentificationFieldDefinition[];
  mapLocationLabels: Required<PropertyFormMapLocationLabels>;
  setAsPrimaryImageLabel: string;
  yearBuiltLabel: string;
  yearBuiltPlaceholder: string;
  floorLevelLabel: string;
  furnishingStatusLabel: string;
  listingPurposeLabel: string;
  listingPurposePlaceholder: string;
  areaLabel: string;
  areaPlaceholder: string;
  enableLegacyPermitDld: boolean;
  emitLegacyListingPurpose: boolean;
  emitLegacyAreaIds: boolean;
  ownerSearchDebounceMs: number;
  duplicateIdentityFields: PropertyOwnerDuplicateIdentityField[];
};

function mergeOptions(
  provided: PropertyFormOption[] | undefined,
  fallback: PropertyFormOption[],
): PropertyFormOption[] {
  return provided ?? fallback;
}

export function resolvePropertyFormConfig(
  config?: PropertyFormConfig,
  ownerNationalityOptions?: PropertyFormOption[],
): ResolvedPropertyFormConfig {
  const identificationFields = [
    ...(config?.identificationFields?.length
      ? config.identificationFields
      : DEPRECATED_IDENTIFICATION_FIELDS),
  ];
  const seenIdentificationKeys = new Set<string>();
  const uniqueIdentificationFields: PropertyIdentificationFieldDefinition[] =
    [];

  for (const field of identificationFields) {
    if (seenIdentificationKeys.has(field.key)) {
      continue;
    }
    seenIdentificationKeys.add(field.key);
    uniqueIdentificationFields.push(field);
  }

  const extraIdentificationFields = uniqueIdentificationFields.filter(
    (field) =>
      !(BUILT_IN_IDENTIFICATION_FIELD_KEYS as readonly string[]).includes(
        field.key,
      ),
  );

  const pricingFields = config?.pricingFields?.length
    ? config.pricingFields
    : DEPRECATED_PRICING_FIELDS.map((field) => ({
        ...field,
        label:
          config?.pricingFieldLabels?.[
            field.key === "furnished_sale_price"
              ? "furnishedSalePrice"
              : field.key === "unfurnished_sale_price"
                ? "unfurnishedSalePrice"
                : field.key === "furnished_rent_price"
                  ? "furnishedRentPrice"
                  : field.key === "unfurnished_rent_price"
                    ? "unfurnishedRentPrice"
                    : field.key === "semi_furnished_rent_price"
                      ? "semiFurnishedRentPrice"
                      : "price"
          ] ?? field.label,
      }));

  return {
    listingPurposeOptions: mergeOptions(
      config?.listingPurposeOptions,
      DEPRECATED_LISTING_PURPOSE_OPTIONS,
    ),
    furnishingStatusOptions: mergeOptions(
      config?.furnishingStatusOptions,
      DEPRECATED_FURNISHING_STATUS_OPTIONS,
    ),
    floorLevelOptions: mergeOptions(
      config?.floorLevelOptions,
      DEPRECATED_FLOOR_LEVEL_OPTIONS,
    ),
    completionStatusOptions: mergeOptions(
      config?.completionStatusOptions,
      DEPRECATED_COMPLETION_STATUS_OPTIONS,
    ),
    orientationOptions: mergeOptions(
      config?.orientationOptions,
      DEPRECATED_ORIENTATION_OPTIONS,
    ),
    nationalityOptions: mergeOptions(
      config?.nationalityOptions ?? ownerNationalityOptions,
      DEPRECATED_NATIONALITY_OPTIONS,
    ),
    ownerModeLabels: {
      ...DEPRECATED_OWNER_MODE_LABELS,
      ...config?.ownerModeLabels,
    },
    pricingFieldLabels: {
      ...DEPRECATED_PRICING_FIELD_LABELS,
      ...config?.pricingFieldLabels,
    },
    pricingFields,
    identificationFieldLabels: {
      ...DEPRECATED_IDENTIFICATION_FIELD_LABELS,
      ...config?.identificationFieldLabels,
    },
    identificationFields: uniqueIdentificationFields,
    extraIdentificationFields,
    mapLocationLabels: {
      ...DEPRECATED_MAP_LOCATION_LABELS,
      ...config?.mapLocationLabels,
    },
    setAsPrimaryImageLabel:
      config?.setAsPrimaryImageLabel ?? "Set as Primary Image",
    yearBuiltLabel: config?.yearBuiltLabel ?? "Year Built",
    yearBuiltPlaceholder:
      config?.yearBuiltPlaceholder ?? "Enter year of construction",
    floorLevelLabel: config?.floorLevelLabel ?? "Floor Level",
    furnishingStatusLabel:
      config?.furnishingStatusLabel ?? "Furnishing Status",
    listingPurposeLabel: config?.listingPurposeLabel ?? "Listing purpose",
    listingPurposePlaceholder:
      config?.listingPurposePlaceholder ?? "Select listing purposes",
    areaLabel: config?.areaLabel ?? "Area",
    areaPlaceholder: config?.areaPlaceholder ?? "Select area",
    enableLegacyPermitDld: Boolean(config?.legacyFields?.permit_dld_number),
    emitLegacyListingPurpose: config?.legacyFields?.listing_purpose !== false,
    emitLegacyAreaIds: config?.legacyFields?.area_ids !== false,
    ownerSearchDebounceMs:
      config?.ownerSearchDebounceMs ?? DEFAULT_OWNER_SEARCH_DEBOUNCE_MS,
    duplicateIdentityFields:
      config?.duplicateIdentityFields ?? DEFAULT_DUPLICATE_IDENTITY_FIELDS,
  };
}

export function optionLabel(
  options: readonly PropertyFormOption[],
  value: string | number | null | undefined,
  emptyValue = "—",
): string {
  if (value === null || value === undefined || value === "") {
    return emptyValue;
  }

  const match = options.find((option) => option.value === String(value));
  return match?.label ?? String(value);
}

export function optionLabels(
  options: readonly PropertyFormOption[],
  values: string[],
  emptyValue = "—",
): string {
  if (values.length === 0) {
    return emptyValue;
  }

  return values.map((value) => optionLabel(options, value, value)).join(", ");
}
