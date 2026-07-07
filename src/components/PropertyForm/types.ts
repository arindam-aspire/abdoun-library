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

export type OwnerInfoValidationMessages = {
  ownerNameRequired?: string;
  phoneRequired?: string;
  emailRequired?: string;
  ownerDocumentRequired?: string;
};

export type OwnerInfoReadOnlyField =
  | "owner_name"
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
};

export interface PropertyFormProps {
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
}


export interface PropertyFormValues {
  /** Included in onNext/onDraft payloads (1-based). */
  active_step?: number;
  /** Included in onNext/onDraft payloads (1-based). */
  max_reached_step?: number;
  basic_info?: BasicInfoFormValues;
  location_insert?: LocationInsertFormValues;
  property_details?: PropertyDetailsFormValues;
  owner_info?: OwnerInfoFormValues;
  pricing_details?: PricingDetailsFormValues;
  amenities?: AmenitiesFormValues;
  media_upload?: MediaUploadFormValues;
  terms_acceptance?: TermsAcceptanceFormValues;
}

export type TermsAcceptanceFormValues = {
  terms_accepted: boolean;
  privacy_accepted: boolean;
  public_display_authorized: boolean;
  fees_acknowledged: boolean;
};

export type BasicInfoFormValues = {
  title: string;
  description: string;
  listing_purpose: string | null;
  category_id: number | null;
  type_id: number | null;
};


export type LocationInsertFormValues = {
  city_id: number | null;
  area_ids: number[];
  address: string;
};

export type PropertyDetailsFormValues = {
  bedrooms: number | null;
  bathrooms: number | null;
  built_up_area: string;
  parking_spaces: number | null;
  property_age: string | null;
  completion_status: string | null;
  total_floor: string;
  occupancy: string | null;
  ownership_type: string | null;
  reference_number: string;
  permit_dld_number: string;
  orientation: string | null;
};


export type { SelectedDocument };

export type OwnerInfoItem = {
  owner_name: string;
  country_code: string;
  phone_number: string;
  email: string;
  social_security_id: string;
  nationality: string;
  owner_address: string;
  owner_documents: SelectedDocument[];
};

export type OwnerInfoFormValues = {
  owners: OwnerInfoItem[];
};

export type PricingDetailsFormValues = {
  price: string;
  service_charge: string;
  maintenance_fee: string;
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
  media_files: SelectedDocument[];
  youtube_url: string;
  virtual_tour_url: string;
  documents: SelectedDocument[];
};