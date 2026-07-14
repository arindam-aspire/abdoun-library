import propertyCardSampleImage from "@/assets/property-card-sample.jpg";
import propertyFallbackImage from "@/assets/property-fallback-image.svg";

/** Bundled SVG logo used by PropertyView hero/overview when media is missing. */
export const PROPERTY_FALLBACK_IMAGE = propertyFallbackImage;

/**
 * Realistic sample property photo for PropertyCardList galleries when a listing
 * has no media (or a listing image fails to load). Cover-style object-fit.
 * PropertyView continues to use `PROPERTY_FALLBACK_IMAGE` (SVG).
 */
export const PROPERTY_CARD_SAMPLE_IMAGE = propertyCardSampleImage;

/** True when the library should treat the listing as having API media URLs. */
export function hasListingMediaImages(
  mediaImages: { displayUrl: string }[],
): boolean {
  return mediaImages.length > 0;
}
