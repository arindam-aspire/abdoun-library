import type { ReactNode } from "react";
import type { UiControlSize } from "../ui/commonTypes";

type NullableString = string | null;
type NullableNumber = number | null;
export type ApplicationKey = "abdoun_web" | "mls_web";

export interface HeroCarouselControlsProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isPaused?: boolean;
  onPauseToggle?: () => void;
  /** Control size from `sm` breakpoint up; below `sm` always uses compact tier. */
  buttonSize?: UiControlSize;
  className?: string;
}

export interface HeroSectionLightBoxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  title: string;
  ariaLabel?: string;
  /** Control size from `sm` breakpoint up; below `sm` always uses compact tier. */
  buttonSize?: UiControlSize;
}

export interface HeroSectionProps {
  images: string[];
  /** Full-size URLs for the lightbox; defaults to `images` when omitted. */
  lightboxImages?: string[];
  videos?: string[];
  virtualTourUrl?: NullableString;
  title: string;
  location: string;
  listingType: "sale" | "rent";
  isExclusive?: boolean;
  exclusiveLabel?: string;
  brokerName?: string;
  listingBadgeLabel?: string;
  isFavourite?: boolean;
  isFavouriteLoading?: boolean;
  onFavourite?: () => void;
  /** Control size from `sm` breakpoint up; below `sm` always uses compact tier. */
  buttonSize?: UiControlSize;
  className?: string;
}

interface LocalizedText {
  en: string;
  ar: string;
  esp: string;
  fr: string;
}

interface LocalizedNullableText {
  en: NullableString;
  ar: NullableString;
  esp: NullableString;
  fr: NullableString;
}

export interface PropertyMediaItem {
  id: number;
  url: string;
  thumb_url: string;
  is_primary: boolean;
  order: number;
  caption: NullableString;
}

interface PropertyMedia {
  thumbnail: NullableString;
  images: PropertyMediaItem[];
  videos: string[];
  virtual_tour_url: NullableString;
  floor_plan_images: PropertyMediaItem[];
  documents: PropertyMediaItem[];
}

interface PropertyLocationDetail {
  country_id: number;
  country: string;
  city_id: number;
  city: string;
  region_id: number;
  region: string;
  address: LocalizedText;
  latitude: NullableNumber;
  longitude: NullableNumber;
  map_embed_url: NullableString;
  local_highlights?: string[];
  lifestyle_description?: NullableString;
}

interface PropertyGeneral {
  floor_type: NullableString;
  floor_number: NullableNumber;
  building_status: NullableString;
  built_in_year: NullableNumber;
  furniture_status: NullableString;
  furniture_condition: NullableString;
  garage_type: NullableString;
  total_floors_in_building: NullableNumber;
}

interface PropertyInfo {
  built_up_area: NullableNumber;
  land_area: NullableNumber;
  garden_area: NullableNumber;
  terrace_area: NullableNumber;
  area_unit: NullableString;
  bedrooms: NullableNumber;
  master_bedrooms: NullableNumber;
  bathrooms: NullableNumber;
  living_rooms: NullableNumber;
  salons: NullableNumber;
  balconies: NullableNumber;
  entrances: NullableNumber;
  kitchens: NullableNumber;
  kitchen_type: NullableString;
  maid_rooms: NullableNumber;
  driver_rooms: NullableNumber;
  store_rooms: NullableNumber;
}

interface PropertyFeatures {
  amenities: string[];
}

interface PropertyPricing {
  listing_type: string;
  selling_price: NullableNumber;
  currency: NullableString;
  price_on_request: boolean;
  rent_commission_percent: NullableNumber;
  contract_duration: NullableNumber;
  payment_method: NullableString;
  is_negotiable: boolean;
  installment_available: boolean;
}

interface PropertyAgent {
  id: number;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: NullableString;
  license_number: NullableString;
}

interface PropertyOwner {
  id: number;
  name: string;
  phone: string;
  email: string;
  is_private: boolean;
}

interface PropertyCreatedBy {
  id: number;
  name: string;
  role: string;
}

export interface PropertyDetails {
  id: number;
  reference_number: string;
  url: NullableString;

  title: LocalizedText;
  description: LocalizedNullableText;

  category: string;
  property_type: string;
  status: string;
  listing_type: string;

  selling_price_amount: NullableNumber;
  selling_price_currency: NullableString;

  rent_price_amount: NullableNumber;
  rent_price_currency: NullableString;

  bedrooms: NullableNumber;
  bathrooms: NullableNumber;
  built_up_area: NullableNumber;

  more_features: string[] | null;

  media: PropertyMedia;

  latitude: NullableNumber;
  longitude: NullableNumber;
  location_name: NullableString;

  is_exclusive: boolean;

  location_detail: PropertyLocationDetail;

  general: PropertyGeneral;

  details: PropertyInfo;

  features: PropertyFeatures;

  /** Selected features/amenities for this listing (matched to catalog by `id`). */
  features_list: PropertyFeatureListItem[];

  pricing: PropertyPricing;

  created_at: string;
  updated_at: string;

  published_at: NullableString;
  expires_at: NullableString;
  sold_at: NullableString;
  rented_at: NullableString;

  agent: PropertyAgent | null;

  owner: PropertyOwner | null;

  created_by: PropertyCreatedBy;

  agency: AgencyDetails | null;
}

interface AgencyDetails {
  agency_id: number | string;
  agency_name: string;
  agency_trade_name?: NullableString;
  email?: NullableString;
  phone?: NullableString;
  website?: NullableString;
}


export type Locale = keyof LocalizedText;

export type OverviewTabProps = {
  propertyDetails: PropertyDetails;
  applicationKey?: ApplicationKey;
  locale?: Locale;
  className?: string;
};

export type PropertyFeatureType = "FEATURE" | "AMENITIES";

/** Catalog entry for a feature or amenity (from API / CMS). */
export type PropertyFeatureDefinition = {
  id: number;
  feature_group: PropertyFeatureType;
  slug: string;
  name: string;
};

/** Property listing reference to a catalog feature or amenity. */
export type PropertyFeatureListItem = {
  id: number;
  feature_group: PropertyFeatureType;
};

export type FeatureTabProps = {
  propertyDetails: PropertyDetails;
  features: PropertyFeatureDefinition[];
  className?: string;
};

export type LocationTabProps = {
  propertyDetails: PropertyDetails;
  locale?: Locale;
  className?: string;
};

export type DocumentsTabProps = {
  propertyDetails: PropertyDetails;
  className?: string;
};

export type PropertyStatusActionCard = {
  statusLabel?: string;
  pendingActions?: string[];
};

export type PropertyInfoProps = {
  propertyDetails: PropertyDetails;
  applicationKey?: ApplicationKey;
  className?: string;
  showAgent?: boolean;
  showOwner?: boolean;
  statusActionCard?: PropertyStatusActionCard;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
  onOwnerEmail?: () => void;
  onOwnerPhone?: () => void;
  onOwnerWhatsApp?: () => void;
  /** Control size from `sm` breakpoint up; below `sm` always uses compact tier. */
  buttonSize?: UiControlSize;
};

export type PropertyViewTabOption = {
  label: string;
  value: string;
  icon?: ReactNode;
  /** Alias of `icon` (e.g. when matching ToggleButton item shape). */
  iconStart?: ReactNode;
};

export type PropertyViewTabs = {
  tabOptions?: PropertyViewTabOption[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
};

export type PropertyDetailsTabsProps = {
  tabOptions?: PropertyViewTabOption[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  className?: string;
  propertyDetails?: PropertyDetails;
  applicationKey?: ApplicationKey;
  locale?: Locale;
  features?: PropertyFeatureDefinition[];
  /** Renders tab-panel skeletons instead of tab content. */
  isLoading?: boolean;
  showAgent?: boolean;
  showOwner?: boolean;
  statusActionCard?: PropertyStatusActionCard;
  onAgentEmail?: () => void;
  onAgentPhone?: () => void;
  onAgentWhatsApp?: () => void;
  onOwnerEmail?: () => void;
  onOwnerPhone?: () => void;
  onOwnerWhatsApp?: () => void;
  /** Control size from `sm` breakpoint up; below `sm` always uses compact tier. */
  buttonSize?: UiControlSize;
};

export interface PropertyViewProps {
  isLoading?: boolean;
  applicationKey?: ApplicationKey;
  propertyDetails?: PropertyDetails;
  isFavouriteLoading?: boolean;
  onClickFavourite?: (id: number) => void;
  tabs?: PropertyViewTabs;
  /** Catalog of feature/amenity definitions; matched against `propertyDetails.features_list` by `id`. */
  features?: PropertyFeatureDefinition[];
  showAgent?: boolean;
  showOwner?: boolean;
  statusActionCard?: PropertyStatusActionCard;
  onClickAgentEmail?: (id: number) => void;
  onClickAgentPhone?: (id: number) => void;
  onClickAgentWhatsApp?: (id: number) => void;
  onClickAgent?: (id: number) => void;
  onClickOwnerEmail?: (id: number) => void;
  onClickOwnerPhone?: (id: number) => void;
  onClickOwnerWhatsApp?: (id: number) => void;
  onClickOwner?: (id: number) => void;
  locale?: Locale;
  /** Action control size from `sm` breakpoint up; below `sm` viewport unchanged. */
  buttonSize?: UiControlSize;
  className?: string;
}

