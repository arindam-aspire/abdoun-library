import type { PropertyListItem } from "../PropertyCardImageGallery/types";

export type PropertyOwner = {
  owner_id: number | string;
  full_name?: string;
  phone?: string;
};

export type PropertyCardDetails = PropertyListItem & {
  price: string;
  location: string;
  highlights?: string;
  area?: number;
  areaName?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  owners?: PropertyOwner[];
};

export type PropertyCardProps = {
  propertyDetails: PropertyCardDetails;
  isAuthenticated?: boolean;
  showOwners?: boolean;
  showAgents?: boolean;
  showBadges?: boolean;
  onEmail?: (propertyId: number) => void;
  onCall?: (propertyId: number) => void;
  onWhatsApp?: (propertyId: number) => void;
  onFavourite?: (propertyId: number) => void;
  onDetailsClick?: (propertyId: number) => void;
};

/** @deprecated Use `PropertyCardDetails` */
export type PropertyGridCardPropertyDetails = PropertyCardDetails;

/** @deprecated Use `PropertyCardDetails` */
export type PropertyListCardPropertyDetails = PropertyCardDetails;

/** @deprecated Use `PropertyCardProps` */
export type PropertyGridCardProps = PropertyCardProps;

/** @deprecated Use `PropertyCardProps` */
export type PropertyListCardProps = PropertyCardProps;
