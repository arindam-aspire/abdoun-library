import type {
  ApplicationKey,
  CardLayoutVariant,
  ListingLocale,
  PropertyListing,
} from "../PropertyCardList/types";
import type { UiControlSize } from "../ui/commonTypes";

export type { ApplicationKey, CardLayoutVariant, ListingLocale, PropertyListing };

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
  canViewDelete?: boolean;
  onClickDelete?: (propertyDetails: PropertyListing) => void;
  /** Card action control size from `sm` breakpoint up; below `sm` always uses compact `sm` tier. */
  buttonSize?: UiControlSize;
  /** Locale for listing title resolution. Defaults to `"en"`. */
  locale?: ListingLocale;
}

export interface PropertyListCardProps extends PropertyListCardCoreProps {
  layoutVariant: CardLayoutVariant;
  applicationKey?: ApplicationKey;
  isFavouriteLoading?: boolean;
  isDeleteLoading?: boolean;
}

export interface ImageGallaryProps
  extends Pick<
    PropertyListCardCoreProps,
    "propertyDetails" | "canViewAgents" | "canViewBadges" | "locale"
  > {
  layoutVariant: CardLayoutVariant;
  applicationKey?: ApplicationKey;
  onClickFavourite?: PropertyListCardCoreProps["onClickFavourite"];
  canViewDelete?: PropertyListCardCoreProps["canViewDelete"];
  onClickDelete?: PropertyListCardCoreProps["onClickDelete"];
  buttonSize?: PropertyListCardCoreProps["buttonSize"];
  isFavouriteLoading?: boolean;
  isDeleteLoading?: boolean;
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
