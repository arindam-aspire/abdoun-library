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

export interface PropertyFormProps {
  activeStep: number;
  categoryTaxonomy: PropertyTaxonomyCategory[];
  locationTaxonomy: LocationTaxonomyResponse;
  featuresAndAmenities: FeaturesAndAmenities[];
  propertyDetails: PropertyFormValues;
  title?: string;
  onSubmit?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onDraft?: () => void;
  onUploadOwnerDocument?: (file: File) => Promise<string | null>;
  onUploadPropertyMedia?: (file: File) => Promise<string | null>;
  onUploadPropertyDocument?: (file: File) => Promise<string | null>;
  onStepClick?: (index: number, step: PropertyFormStep) => void;
}


export interface PropertyFormValues {
  basic_info?: BasicInfoFormValues;
  location_insert?: LocationInsertFormValues;
  property_details?: PropertyDetailsFormValues;
  owner_info?: OwnerInfoFormValues;
  pricing_details?: PricingDetailsFormValues;
  amenities?: AmenitiesFormValues;
  media_upload?: MediaUploadFormValues;
}

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
  selected_amenities: string[];
};

export type MediaUploadFormValues = {
  media_files: SelectedDocument[];
  youtube_url: string;
  virtual_tour_url: string;
  documents: SelectedDocument[];
};