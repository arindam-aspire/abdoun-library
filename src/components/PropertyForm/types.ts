import type { ReactNode } from "react";
import type { SelectedDocument } from "../ui/FileSelectInput";

export type PropertyFormStep = {
  value: string;
  /** Short label for the horizontal stepper. */
  label: string;
  /** Long label for the vertical stepper sidebar. */
  verticalLabel?: string;
  icon?: ReactNode;
  /** Alias of `icon`. */
  iconStart?: ReactNode;
};

export type PropertyTaxonomyType = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
};

export type PropertyTaxonomyCategory = {
  id: number;
  name: string;
  slug: string;
  property_types: PropertyTaxonomyType[];
};

export type LocationTaxonomyArea = {
  id: number;
  name: string;
};

export type LocationTaxonomyCity = {
  id: number;
  name: string;
  areas: LocationTaxonomyArea[];
};

export type LocationTaxonomyResponse = {
  data: LocationTaxonomyCity[];
  total: number;
};

export type FeaturesAndAmenities = {
  id: number;
  name: string;
  slug: string;
  feature_group: string;
  category: string | null;
  category_id: number | null;
  property_type: string | null;
  property_type_id: number | null;
};

export type PropertyFormOption = {
  value: string;
  label: string;
  id?: string | number;
};

export type PropertyFormOwnerMode = "search" | "create";

export type PropertyIdentificationFieldKey =
  | "apartment_number"
  | "plot_number"
  | "basin_number"
  | "parcel_number"
  | "building_number"
  | (string & {});

export type PropertyIdentificationFieldDefinition = {
  key: PropertyIdentificationFieldKey;
  label: string;
  placeholder?: string;
  required?: boolean;
  /** HTML input type. Defaults to "text". Use "number" for floor_number, etc. */
  inputType?: "text" | "number";
  /** Optional inputMode override. For number fields default to "numeric". */
  inputMode?: "text" | "numeric" | "decimal";
  /** Optional step for number inputs. Defaults to "1" when inputType is "number". */
  step?: string | number;
};

export type PropertyPricingFieldPurpose = "sale" | "rent" | (string & {});

export type PropertyPricingFieldDefinition = {
  key: string;
  label: string;
  purpose: PropertyPricingFieldPurpose;
  furnishingStatus?: string | null;
  required?: boolean;
  placeholder?: string;
};

export type PropertyFormOwnerModeLabels = {
  searchExisting?: string;
  createNew?: string;
  searchPlaceholder?: string;
  searchEmpty?: string;
  searchLoading?: string;
  selectOwner?: string;
  selectedOwner?: string;
  duplicateDetected?: string;
  duplicateSelectExisting?: string;
};

export type PropertyFormPricingFieldLabels = {
  price?: string;
  currency?: string;
  serviceCharge?: string;
  maintenanceFee?: string;
  furnishedSalePrice?: string;
  unfurnishedSalePrice?: string;
  furnishedRentPrice?: string;
  unfurnishedRentPrice?: string;
  semiFurnishedRentPrice?: string;
};

export type PropertyFormIdentificationFieldLabels = {
  apartmentNumber?: string;
  plotNumber?: string;
  basinNumber?: string;
  parcelNumber?: string;
  buildingNumber?: string;
};

export type PropertyFormMapLocationLabels = {
  mapTitle?: string;
  latitude?: string;
  longitude?: string;
  coordinates?: string;
  selectPinHint?: string;
};

export type PropertyFormLegacyFieldsConfig = {
  /**
   * When true, the Permit / DLD Number field remains editable and is returned
   * in outgoing payloads. Incoming legacy values are always accepted.
   */
  permit_dld_number?: boolean;
  /** When true, keep emitting legacy `listing_purpose`. Defaults to true. */
  listing_purpose?: boolean;
  /** When true, keep emitting legacy `area_ids`. Defaults to true. */
  area_ids?: boolean;
};

export type PropertyFormConfig = {
  listingPurposeOptions?: PropertyFormOption[];
  furnishingStatusOptions?: PropertyFormOption[];
  floorLevelOptions?: PropertyFormOption[];
  completionStatusOptions?: PropertyFormOption[];
  orientationOptions?: PropertyFormOption[];
  nationalityOptions?: PropertyFormOption[];
  ownerModeLabels?: PropertyFormOwnerModeLabels;
  pricingFieldLabels?: PropertyFormPricingFieldLabels;
  pricingFields?: PropertyPricingFieldDefinition[];
  identificationFieldLabels?: PropertyFormIdentificationFieldLabels;
  identificationFields?: PropertyIdentificationFieldDefinition[];
  mapLocationLabels?: PropertyFormMapLocationLabels;
  setAsPrimaryImageLabel?: string;
  yearBuiltLabel?: string;
  yearBuiltPlaceholder?: string;
  floorLevelLabel?: string;
  furnishingStatusLabel?: string;
  listingPurposeLabel?: string;
  listingPurposePlaceholder?: string;
  areaLabel?: string;
  areaPlaceholder?: string;
  legacyFields?: PropertyFormLegacyFieldsConfig;
  ownerSearchDebounceMs?: number;
  duplicateIdentityFields?: PropertyOwnerDuplicateIdentityField[];
};

export type PropertyOwnerDuplicateIdentityField =
  | "email"
  | "phone"
  | "ssi"
  | "duplicate_key";

/** @deprecated Use `PropertyOwnerDuplicateIdentityField`. */
export type PropertyFormOwnerDuplicateIdentityField =
  PropertyOwnerDuplicateIdentityField;

export type PropertyOwnerSearchResult = {
  owner_id: string;
  full_name?: string;
  email?: string;
  country_code?: string;
  phone_number?: string;
  nationality?: string;
  ssi?: string;
  duplicate_key?: string;
  owner_documents?: SelectedDocument[];
};

export type PropertyLocationCoordinates = {
  latitude: number | null;
  longitude: number | null;
};

export type PropertyLocationMapRenderProps = PropertyLocationCoordinates & {
  onCoordinatesChange: (coordinates: PropertyLocationCoordinates) => void;
  labels: Required<PropertyFormMapLocationLabels>;
};

export type PropertyFormSectionKey =
  | "basic_information"
  | "basic_info"
  | "location"
  | "location_insert"
  | "property_details"
  | "owner_information"
  | "owner_info"
  | "pricing"
  | "pricing_details"
  | "features"
  | "amenities"
  | "media_documents"
  | "media_upload";

export type PropertyFormFieldErrors = Record<string, string>;

export type PropertyFormStepErrors = Partial<
  Record<PropertyFormSectionKey | number | string, string>
>;

export type PropertyFormExternalErrors = {
  fieldErrors?: PropertyFormFieldErrors;
  stepErrors?: PropertyFormStepErrors;
  submitError?: string | null;
};

export type PropertyFormNavigateReason =
  | "external-error"
  | "field-focus"
  | "imperative";

export type PropertyFormHandle = {
  goToStep: (step: number, meta?: { fieldPath?: string }) => void;
  goToField: (fieldPath: string) => void;
  focusFirstInvalidField: () => boolean;
};

export type OwnerInfoValidationMessages = {
  ownerNameRequired?: string;
  phoneRequired?: string;
  emailRequired?: string;
  ownerDocumentRequired?: string;
};

export type OwnerInfoReadOnlyField =
  | "owner_name"
  | "full_name"
  | "country_code"
  | "phone_number"
  | "email";

export type OwnerInfoConfig = {
  /** When true, each owner must have at least one uploaded document (non-empty `uri`). */
  requireDocuments?: boolean;
  /** Host-provided validation copy (e.g. next-intl strings from MLS). */
  validationMessages?: OwnerInfoValidationMessages;
  /** Owner row indices whose configured fields are read-only. */
  readOnlyOwnerIndices?: number[];
  /** Fields locked on read-only rows. Defaults to name, country code, phone, and email. */
  readOnlyOwnerFields?: OwnerInfoReadOnlyField[];
  nationalityOptions?: PropertyFormOption[];
};

export interface PropertyFormProps extends PropertyFormExternalErrors {
  /** Current step number (1-based). First step is `1`. */
  activeStep: number;
  /** Furthest step reached (1-based). Defaults to `activeStep`. */
  maxReachedStep?: number;
  categoryTaxonomy: PropertyTaxonomyCategory[];
  locationTaxonomy: LocationTaxonomyResponse;
  featuresAndAmenities: FeaturesAndAmenities[];
  propertyDetails: PropertyFormValues;
  title?: string;
  /**
   * When true, pins the horizontal stepper and desktop sidebar while scrolling.
   * Disable when the parent page already manages sticky chrome.
   */
  stickyLayout?: boolean;
  /**
   * Viewport offset for sticky elements (e.g. app header height).
   * Defaults to `var(--property-form-sticky-top, 0px)` — set that CSS variable in your app.
   */
  stickyTopOffset?: string;
  /**
   * When `false`, the form is read-only for submission: terms checkbox, Save as Draft,
   * and Submit are disabled. Defaults to `true`.
   */
  canEdit?: boolean;
  /**
   * Optional rejection reason from the API (`rejection_reason`).
   * When set, shown as an alert above the form steps and the submit button reads "Resubmit".
   */
  rejectionReason?: string | null;
  onSubmit?: () => void;
  onPrevious?: () => void;
  /** Called when the active step is valid; parent persists `propertyDetails` and advances. */
  onNext?: (propertyDetails: PropertyFormValues) => void;
  /** Called without validation; parent persists current `propertyDetails` as draft. */
  onDraft?: (propertyDetails: PropertyFormValues) => void;
  /** Shows loading on **Save as Draft** while the parent saves. Disables all form interaction. */
  isDraftLoading?: boolean;
  /** Shows loading on **Submit** while the parent submits. Disables all form interaction. */
  isSubmitting?: boolean;
  /**
   * @deprecated Use `isSubmitting` instead.
   * Shows loading on **Submit** while the parent submits.
   */
  isSubmitLoading?: boolean;
  /**
   * When loading a different saved draft into the form, change this id so internal
   * form state re-hydrates from `propertyDetails`.
   */
  draftId?: string | number;
  /**
   * Called for each valid file on drop or browse. Return the uploaded file URI.
   * `FileSelectInput` shows the upload queue and progress; on success the document
   * is appended to the owner's `owner_documents` and `onOwnerDocumentsChange` runs.
   */
  onUploadOwnerDocument?: (
    file: File,
    context: { ownerIndex: number },
  ) => Promise<string | null>;
  /** Fired when an owner's committed document list changes (upload complete or remove). */
  onOwnerDocumentsChange?: (
    ownerIndex: number,
    documents: SelectedDocument[],
  ) => void;
  /** Fired when a committed owner document is removed from the queue. */
  onRemoveOwnerDocument?: (
    ownerIndex: number,
    document: SelectedDocument,
  ) => void;
  /**
   * Called for each valid media file on drop or browse. Return the uploaded file URI.
   * `MediaInput` shows the upload queue and progress; on success the item is appended
   * to `media_files` and `onPropertyMediaChange` runs.
   */
  onUploadPropertyMedia?: (file: File) => Promise<string | null>;
  /** Fired when committed property media changes (upload complete or remove). */
  onPropertyMediaChange?: (media: SelectedDocument[]) => void;
  /** Fired when a committed property media item is removed. */
  onRemovePropertyMedia?: (media: SelectedDocument) => void;
  /**
   * Called for each valid document on drop or browse. Return the uploaded file URI.
   * `FileSelectInput` shows the upload queue and progress; on success the document
   * is appended to `documents` and `onPropertyDocumentsChange` runs.
   */
  onUploadPropertyDocument?: (file: File) => Promise<string | null>;
  /** Fired when committed property documents change (upload complete or remove). */
  onPropertyDocumentsChange?: (documents: SelectedDocument[]) => void;
  /** Fired when a committed property document is removed. */
  onRemovePropertyDocument?: (document: SelectedDocument) => void;
  /** When moving forward, receives the latest merged form values after validation. */
  onStepClick?: (
    /** Target step number (1-based). */
    step: number,
    stepConfig: PropertyFormStep,
    propertyDetails: PropertyFormValues,
  ) => void;
  /** MLS host config for the Owner Information step (documents, read-only rows, i18n messages). */
  ownerInfoConfig?: OwnerInfoConfig;
  /**
   * Host-provided master-data options and translated labels. When omitted, deprecated
   * compatibility defaults are used so existing consumers keep rendering.
   */
  config?: PropertyFormConfig;
  onSearchOwners?: (
    query: string,
  ) => Promise<PropertyOwnerSearchResult[]> | PropertyOwnerSearchResult[];
  onSelectOwner?: (owner: PropertyOwnerSearchResult) => void;
  onCreateOwner?: (values: OwnerInfoItem) => void | Promise<void>;
  ownerSearchResults?: PropertyOwnerSearchResult[];
  ownerSearchLoading?: boolean;
  ownerSearchError?: string | null;
  ownerDuplicateError?: string | null;
  /**
   * Vendor-agnostic map slot. Receives current coordinates and a change handler.
   * The library does not depend on a map vendor.
   */
  renderLocationMap?: (props: PropertyLocationMapRenderProps) => ReactNode;
  locationMap?:
    | ReactNode
    | ((props: PropertyLocationMapRenderProps) => ReactNode);
  /**
   * Called when the form needs the parent to change `activeStep` (external errors,
   * imperative `goToStep` / `goToField`).
   */
  onRequestStepChange?: (
    step: number,
    meta?: { fieldPath?: string; reason?: PropertyFormNavigateReason },
  ) => void;
  /**
   * @deprecated Set `pricing_details.price_currency` (and fee currencies) instead.
   * Retained so existing consumers can migrate without a PropertyForm prop change.
   */
  pricingCurrency?: string;
  /**
   * @deprecated Set `property_details.built_up_area_unit` instead.
   * Retained so existing consumers can migrate without a PropertyForm prop change.
   */
  measurementUnit?: "SQFT" | "SQM";
}

export interface PropertyFormValues {
  /** Included in onNext/onDraft payloads (1-based). */
  active_step?: number;
  /** Included in onNext/onDraft payloads (1-based). */
  max_reached_step?: number;
  basic_info?: Partial<BasicInfoFormValues>;
  location_insert?: Partial<LocationInsertFormValues>;
  property_details?: Partial<PropertyDetailsFormValues> & {
    /** Backward-compatible input; omitted units are normalized to `"SQM"`. */
    built_up_area_unit?: "SQM" | "SQFT";
  };
  owner_info?: Partial<OwnerInfoFormValues>;
  pricing_details?: Partial<PricingDetailsFormValues>;
  amenities?: Partial<AmenitiesFormValues>;
  media_upload?: Partial<MediaUploadFormValues>;
  terms_acceptance?: Partial<TermsAcceptanceFormValues>;
}

export type NormalizedPropertyFormValues = {
  basic_info: BasicInfoFormValues;
  location_insert: LocationInsertFormValues;
  property_details: PropertyDetailsFormValues;
  owner_info: OwnerInfoFormValues;
  pricing_details: PricingDetailsFormValues;
  amenities: AmenitiesFormValues;
  media_upload: MediaUploadFormValues;
  terms_acceptance: TermsAcceptanceFormValues;
};

export type TermsAcceptanceFormValues = {
  terms_accepted: boolean;
  privacy_accepted: boolean;
  public_display_authorized: boolean;
  fees_acknowledged: boolean;
};

export type BasicInfoFormValues = {
  title: string;
  description: string;
  listing_purposes: string[];
  /**
   * @deprecated Use `listing_purposes`. Accepted on input and emitted during
   * the deprecation period when a single purpose is selected.
   */
  listing_purpose?: string | null;
  category_id: number | null;
  type_id: number | null;
};

export type LocationInsertFormValues = {
  city_id: number | null;
  area_id: number | null;
  /**
   * @deprecated Use `area_id`. Accepted on input; the first valid id hydrates
   * `area_id`. Still emitted as `[area_id]` during the deprecation period.
   */
  area_ids?: number[];
  address: string;
  latitude: number | null;
  longitude: number | null;
  apartment_number: string;
  plot_number: string;
  basin_number: string;
  parcel_number: string;
  building_number: string;
  /** Extra host-defined identification fields that are not first-class keys. */
  identification_fields?: Record<string, string>;
};

export type BuiltUpAreaUnit = "SQM" | "SQFT";

export type PropertyDetailsFormValues = {
  bedrooms: number | null;
  bathrooms: number | null;
  built_up_area: string;
  built_up_area_unit: BuiltUpAreaUnit;
  parking_spaces: number | null;
  year_built: number | null;
  /**
   * @deprecated Use `year_built`. Legacy bucket strings are preserved as-is and
   * are never reinterpreted as construction years.
   */
  property_age?: string | null;
  furnishing_status: string | null;
  floor_level: string | null;
  completion_status: string | null;
  total_floor: string;
  occupancy: string | null;
  ownership_type: string | null;
  reference_number: string;
  /**
   * @deprecated Removed from the UI. Accepted on input; omitted from newly
   * edited payloads unless the host enables the legacy field.
   */
  permit_dld_number?: string;
  orientation: string | null;
  guard_name: string;
  guard_country_code: string;
  guard_phone_number: string;
};

export type { SelectedDocument };

export type PropertyMediaFile = SelectedDocument & {
  is_primary?: boolean;
  display_order?: number;
  /** Local blob URL used by MediaInput thumbnails; Review & Submit uses the same src. */
  previewUri?: string;
};

export type OwnerInfoItem = {
  owner_id?: string;
  owner_name: string;
  /** Alias of `owner_name` for the new owner contract. */
  full_name?: string;
  country_code: string;
  phone_number: string;
  email: string;
  social_security_id: string;
  /** Alias of `social_security_id` for the new owner contract. */
  ssi?: string;
  nationality: string;
  owner_documents: SelectedDocument[];
};

export type OwnerInfoFormValues = {
  owner_mode?: PropertyFormOwnerMode;
  owner_id?: string | null;
  owners: OwnerInfoItem[];
};

export type PricingCurrency = "JOD" | "USD" | "GBP" | "INR";

export type PricingDetailsFormValues = {
  /** @deprecated Prefer purpose- and furnishing-aware price fields. */
  price: string;
  price_currency: PricingCurrency;
  service_charge: string;
  service_charge_currency: PricingCurrency;
  maintenance_fee: string;
  maintenance_fee_currency: PricingCurrency;
  furnished_sale_price: string;
  unfurnished_sale_price: string;
  furnished_rent_price: string;
  unfurnished_rent_price: string;
  semi_furnished_rent_price: string;
  additional_prices?: Record<string, string>;
};

export type AmenitiesFormValues = {
  /**
   * Selected feature and amenity **names** (both groups share this array in the form API).
   */
  selected_amenities: string[];
  /**
   * Selected feature and amenity **ids** from the API (FEATURE + AMENITIES catalog items).
   * Resolved to `selected_amenities` names in the form UI when names are omitted.
   */
  feature_ids?: number[];
};

export type MediaUploadFormValues = {
  media_files: PropertyMediaFile[];
  youtube_url: string;
  virtual_tour_url: string;
  documents: SelectedDocument[];
};
