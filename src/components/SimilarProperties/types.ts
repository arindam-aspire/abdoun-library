import type {
  ApplicationKey,
  ListingLocale,
  PropertyListing,
} from "../PropertyCardList/types";
import type { UiControlSize } from "../ui/commonTypes";

export type { ApplicationKey, ListingLocale, PropertyListing };

export interface SimilarPropertiesEmptyContent {
  title?: string;
  description?: string;
}

export interface SimilarPropertiesProps {
  /** Section heading. */
  title?: string;
  /** Label for the optional header action. */
  viewMoreLabel?: string;
  /** Called when the user clicks View More. Omit to hide the action. */
  onViewMore?: () => void;
  /** Property listings rendered as grid cards in a horizontal carousel. */
  data: PropertyListing[];
  /** Shows skeleton cards instead of listings. */
  isLoading?: boolean;
  /** Skeleton placeholders while loading (default 4). */
  skeletonCount?: number;
  /** Copy and layout when `data` is empty and not loading. */
  noSimilarProperties?: SimilarPropertiesEmptyContent;
  canViewBadges?: boolean;
  applicationKey?: ApplicationKey;
  className?: string;
  onClick?: (propertyDetails: PropertyListing) => void;
  onClickEmail?: (propertyDetails: PropertyListing) => void;
  onClickCall?: (propertyDetails: PropertyListing) => void;
  onClickWhatsApp?: (propertyDetails: PropertyListing) => void;
  onClickFavourite?: (propertyDetails: PropertyListing) => void;
  /** Card and section control size from `sm` breakpoint up; below `sm` unchanged. */
  buttonSize?: UiControlSize;
  /** Locale for listing title resolution. Defaults to `"en"`. */
  locale?: ListingLocale;
}
