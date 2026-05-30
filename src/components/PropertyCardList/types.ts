import type { ReactNode } from "react";

type NullableString = string | null;
type NullableNumber = number | null;

export type ApplicationKey = "abdoun-web" | "mls-web";

export interface PropertyListing {
  id: number;
  property_id: string;
  reference_number: NullableString;

  title: LocalizedText;
  description: LocalizedNullableText;

  price: string;
  status: string;
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
  favourite_id?: string;
  property_hash?: string;
  user_id?: string;
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
}

export interface PropertyCardListProps extends CardListProps {
  isLoading?: boolean;
  layoutVariant?: CardLayoutVariant;
  listTitle?: string;
  toolbar: PropertyCardListToolbar;
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
  className?: string;
}
