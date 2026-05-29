import type { ApplicationKey, PropertyListing } from "../PropertyCardList/types";

export type { ApplicationKey, PropertyListing };

export interface PropertyListCardProps {
  propertyDetails: PropertyListing;
  canViewOwners?: boolean;
  canViewAgents?: boolean;
  canViewBadges?: boolean;
  layoutVariant: "grid" | "list";
  applicationKey?: ApplicationKey;
  isFavouriteLoading?: boolean;

  onClickEmail?: (propertyDetails: PropertyListing) => void;
  onClickCall?: (propertyDetails: PropertyListing) => void;
  onClickWhatsApp?: (propertyDetails: PropertyListing) => void;
  onClickFavourite?: (propertyDetails: PropertyListing) => void;
  onClick?: (propertyDetails: PropertyListing) => void;
}

export interface ImageGallaryProps {
  propertyDetails: PropertyListing;
  canViewOwners?: boolean;
  canViewAgents?: boolean;
  canViewBadges?: boolean;
  layoutVariant: "grid" | "list";
  applicationKey?: ApplicationKey;

  onClickFavourite?: (propertyDetails: PropertyListing) => void;

  /** When true, the favourite control shows a loading spinner and ignores clicks. */
  isFavouriteLoading?: boolean;
}