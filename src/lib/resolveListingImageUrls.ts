import type { PropertyListing } from "../components/PropertyCardList/types";
import {
  pickDisplayUrls,
  pickFullUrls,
  resolveMediaImages,
  type ResolvedMediaImage,
} from "./resolvePropertyMediaImages";

/** Card/listing gallery URLs optimized for display (prefers `thumb_url`). */
export function resolveListingImageUrls(
  media: PropertyListing["media"] | undefined,
): string[] {
  return pickDisplayUrls(resolveListingMediaImages(media));
}

/** Full-resolution listing gallery URLs for lightbox / zoom. */
export function resolveListingFullImageUrls(
  media: PropertyListing["media"] | undefined,
): string[] {
  return pickFullUrls(resolveListingMediaImages(media));
}

export function resolveListingMediaImages(
  media: PropertyListing["media"] | undefined,
): ResolvedMediaImage[] {
  return resolveMediaImages(media?.images, media?.thumbnail);
}
