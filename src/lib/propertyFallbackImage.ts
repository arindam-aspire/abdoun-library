import propertyFallbackImage from "@/assets/property-fallback-image.svg";

export const PROPERTY_FALLBACK_IMAGE = propertyFallbackImage;

/** True when the library should use the bundled SVG (no API media URLs). */
export function hasListingMediaImages(
  mediaImages: { displayUrl: string }[],
): boolean {
  return mediaImages.length > 0;
}
