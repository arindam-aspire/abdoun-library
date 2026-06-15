import { emptyOwnerInfoItem } from "../../hooks/useOwnerInfoFormHook";
import type {
  AmenitiesFormValues,
  BasicInfoFormValues,
  LocationInsertFormValues,
  MediaUploadFormValues,
  OwnerInfoFormValues,
  PricingDetailsFormValues,
  PropertyDetailsFormValues,
  PropertyFormValues,
  TermsAcceptanceFormValues,
} from "./types";

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

export const emptyBasicInfoFormValues: BasicInfoFormValues = {
  title: "",
  description: "",
  listing_purpose: "sale",
  category_id: null,
  type_id: null,
};

export const emptyLocationInsertFormValues: LocationInsertFormValues = {
  city_id: null,
  area_ids: [],
  address: "",
};

export const emptyPropertyDetailsFormValues: PropertyDetailsFormValues = {
  bedrooms: null,
  bathrooms: null,
  built_up_area: "",
  parking_spaces: null,
  property_age: null,
  completion_status: null,
  total_floor: "",
  occupancy: null,
  ownership_type: null,
  reference_number: "",
  permit_dld_number: "",
  orientation: null,
};

export const emptyOwnerInfoFormValues: OwnerInfoFormValues = {
  owners: [{ ...emptyOwnerInfoItem }],
};

export const emptyPricingDetailsFormValues: PricingDetailsFormValues = {
  price: "",
  service_charge: "",
  maintenance_fee: "",
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

export function mergePropertyFormValues(
  propertyDetails: PropertyFormValues,
): Required<Omit<PropertyFormValues, "active_step" | "max_reached_step">> {
  const {
    active_step: _activeStep,
    max_reached_step: _maxReachedStep,
    ...formSections
  } = propertyDetails;

  return {
    basic_info: {
      ...emptyBasicInfoFormValues,
      ...formSections.basic_info,
    },
    location_insert: {
      ...emptyLocationInsertFormValues,
      ...formSections.location_insert,
    },
    property_details: {
      ...emptyPropertyDetailsFormValues,
      ...formSections.property_details,
    },
    owner_info: {
      owners:
        formSections.owner_info?.owners?.length &&
        formSections.owner_info.owners.length > 0
          ? formSections.owner_info.owners
          : emptyOwnerInfoFormValues.owners,
    },
    pricing_details: {
      ...emptyPricingDetailsFormValues,
      ...formSections.pricing_details,
    },
    amenities: {
      ...emptyAmenitiesFormValues,
      ...formSections.amenities,
    },
    media_upload: {
      ...emptyMediaUploadFormValues,
      ...formSections.media_upload,
    },
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
