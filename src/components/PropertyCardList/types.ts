import type { ReactNode } from "react";
import type { UiControlSize } from "../ui/commonTypes";
import type { PropertyListingStatus } from "./listingStatus";

export type {
  PropertyListingStatus,
  PropertyListingStatusKey,
  StatusColorScheme,
} from "./listingStatus";
export {
  STATUS_COLOR_MAP,
  PROPERTY_LISTING_STATUS_KEYS,
  createListingStatus,
  getPropertyListingStatusColorScheme,
  statusColorSchemeToBadgeVariant,
} from "./listingStatus";

type NullableString = string | null;
type NullableNumber = number | null;

export type ApplicationKey = "abdoun-web" | "mls-web";

/** JSON-serializable row action descriptor on each listing (from API). */
export type PropertyListingRowActionDescriptor = {
  id: string;
  label?: string;
  tone?: "default" | "danger";
  hidden?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

export interface PropertyListing {
  id: number;
  property_id: string;
  reference_number: NullableString;

  title: LocalizedText;
  description: LocalizedNullableText;

  price: string;
  status: PropertyListingStatus;
  category: string;

  searchPropertyType: string;
  city: string;
  areaName: string;
  propertyType: string;

  media: PropertyMedia;

  location: PropertyLocation;
  location_detail: PropertyLocation;

  beds: number;
  baths: number;

  area: NullableString;
  acres: NullableString;

  highlights: string;
  badges: string[];

  handover: NullableString;
  paymentPlan: NullableString;

  validatedDate: string;

  brokerName: string;
  brokerLogo: NullableString;

  owners: PropertyOwner[];
  agency?: AgencyDetails;
  agent?: AgentDetails;

  is_exclusive: boolean;
  is_favourite: boolean;
  is_favourite_loading?: boolean;
  is_delete_loading?: boolean;
  favourite_id?: string;
  property_hash?: string;
  user_id?: string;
  /** Review / rejection reason from submission API (`submission_review_reason`). */
  submission_review_reason?: NullableString;
  /** ISO timestamp when the submission was sent (`submitted_on`). */
  submitted_on?: NullableString;
  /** Submitter display name from API (`submission_submitted_by`). */
  submission_submitted_by?: NullableString;
  /**
   * Per-row action menu items from API JSON.
   * Each listing may define a different set; use `[]` for no actions on that row.
   */
  actions?: PropertyListingRowActionDescriptor[];
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

interface PropertyMedia {
  thumbnail: NullableString;

  images: PropertyImage[];
  videos: PropertyVideo[];

  virtual_tour_url: NullableString;

  floor_plan_images: PropertyImage[];
  documents: PropertyDocument[];
}

interface PropertyImage {
  id: number;

  url: string;
  thumb_url: string;

  is_primary: boolean;
  order: number;

  caption: NullableString;
}

interface PropertyVideo {
  id?: number;

  url?: string;
  thumb_url?: string;

  is_primary?: boolean;
  order?: number;

  caption?: NullableString;
}

interface PropertyDocument {
  id?: number;

  url: string;
  thumb_url?: string;

  is_primary?: boolean;
  order?: number;

  caption?: NullableString;
}

interface PropertyLocation {
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
}

interface PropertyOwner {
  owner_id: string;

  full_name: string;

  email: NullableString;
  phone: NullableString;

  nationality: NullableString;

  ssi: NullableString;
  address: NullableString;

  documents: OwnerDocument[];

  is_active: boolean;
}

interface OwnerDocument {
  url: string;
  file_name?: string;
}

interface AgencyDetails {
  agency_id: number | string;
  agency_name: string;
  agency_trade_name?: NullableString;
  email?: NullableString;
  phone?: NullableString;
  website?: NullableString;
}

interface AgentDetails {
  id: number;
  name: string;
  phone: NullableString;
  whatsapp: NullableString;
  email: NullableString;
  photo: NullableString;
  license_number: NullableString;
}

export type CardLayoutVariant = "grid" | "list";

export interface CardListProps {
  data: PropertyListing[];
  canViewOwners?: boolean;
  canViewAgents?: boolean;
  canViewBadges?: boolean;
  onClick?: (propertyDetails: PropertyListing) => void;
  onClickEmail?: (propertyDetails: PropertyListing) => void;
  onClickCall?: (propertyDetails: PropertyListing) => void;
  onClickWhatsApp?: (propertyDetails: PropertyListing) => void;
  onClickFavourite?: (propertyDetails: PropertyListing) => void;
  /** Show delete control on each card when `onClickDelete` is provided. */
  canViewDelete?: boolean;
  onClickDelete?: (propertyDetails: PropertyListing) => void;
  /** Card action control size from `sm` breakpoint up; below `sm` always uses compact `sm` tier. */
  buttonSize?: UiControlSize;
}

export interface PropertyCardListProps extends CardListProps {
  isLoading?: boolean;
  layoutVariant?: CardLayoutVariant;
  listTitle?: string;
  toolbar?: PropertyCardListToolbar;
  noDataFound?: NoDataFoundContent;
  pagination?: PaginitionContent;
  className?: string;
}

export interface PaginitionContent {
  total: number;
  page: number;
  pageOptions?: number[];
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  maxPageButtons?: number;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (page: number) => void;
}

export interface PropertyCardListToolbar {
  listingsLabel?: string;
  sortOptions?: PropertyCardListSortOptions[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  onViewChange?: (view: CardLayoutVariant) => void;
}

export interface PropertyCardListToolbarProps extends PropertyCardListToolbar {
  isLoading?: boolean;
  totalCount?: number;
  /** Control size from `sm` breakpoint up; below `sm` unchanged. */
  buttonSize?: UiControlSize;
  className?: string;
}

export interface NoDataFoundContent {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export interface NoDataFoundProps extends NoDataFoundContent {
  className?: string;
}

export interface PropertyCardListSortOptions {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PropertyPaginitionProps extends PaginitionContent {
  isLoading?: boolean;
  /** Control size from `sm` breakpoint up; below `sm` unchanged. */
  buttonSize?: UiControlSize;
  className?: string;
}
