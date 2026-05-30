import type {
  ApplicationKey,
  CardLayoutVariant,
  PropertyListing,
} from "../PropertyCardList/types";

export type { ApplicationKey, CardLayoutVariant, PropertyListing };

export interface PropertyListCardCoreProps {
  propertyDetails: PropertyListing;
  canViewOwners?: boolean;
  canViewAgents?: boolean;
  canViewBadges?: boolean;
  onClick?: (propertyDetails: PropertyListing) => void;
  onClickEmail?: (propertyDetails: PropertyListing) => void;
  onClickCall?: (propertyDetails: PropertyListing) => void;
  onClickWhatsApp?: (propertyDetails: PropertyListing) => void;
  onClickFavourite?: (propertyDetails: PropertyListing) => void;
}

export interface PropertyListCardProps extends PropertyListCardCoreProps {
  layoutVariant: CardLayoutVariant;
  applicationKey?: ApplicationKey;
  isFavouriteLoading?: boolean;
}

export interface ImageGallaryProps
  extends Pick<
    PropertyListCardCoreProps,
    "propertyDetails" | "canViewAgents" | "canViewBadges"
  > {
  layoutVariant: CardLayoutVariant;
  applicationKey?: ApplicationKey;
  onClickFavourite?: PropertyListCardCoreProps["onClickFavourite"];
  isFavouriteLoading?: boolean;
}

export interface GridCardSkeletonProps {
  canViewOwners?: boolean;
  canViewAgents?: boolean;
}

export interface ListCardSkeletonProps {
  canViewOwners?: boolean;
  canViewAgents?: boolean;
}

export interface PropertyListCardSkeletonProps
  extends GridCardSkeletonProps,
    ListCardSkeletonProps {
  layoutVariant: CardLayoutVariant;
}
