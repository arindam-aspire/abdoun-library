import type { ReactNode } from "react";
import type { BadgeAppearance, BadgeVariant } from "../ui/Badge/types";

export type PropertyCardBadge = {
  label: string;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  className?: string;
};

export type PropertyListItem = {
  propertyId: number;
  title: string;
  images: string[];
  brokerName?: string;
  isFavourite?: boolean;
  isExclusive?: boolean;
  badges?: string[];
};

export type PropertyCardImageGalleryProps = {
  propertyDetails: PropertyListItem;
  isAuthenticated?: boolean;
  showAgents?: boolean;
  showBadges?: boolean;
  onFavourite?: (propertyId: number) => void;
  onDetailsClick?: (propertyId: number) => void;
  /** When true, the favourite control shows a loading spinner and ignores clicks. */
  isFavouriteLoading?: boolean;
  showImageNavigation?: boolean;
  imageOverlayContent?: ReactNode;
  imageSizes?: string;
  className?: string;
  imageLinkClassName?: string;
  /** When true, clicking the image opens a full-screen viewer instead of triggering `onDetailsClick`. */
  enableImageLightbox?: boolean;
};
