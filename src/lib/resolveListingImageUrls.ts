import type { PropertyListing } from "../components/PropertyCardList/types";

function getImageOrder(image: unknown): number {
  if (image && typeof image === "object" && "order" in image) {
    const order = Number((image as { order?: number }).order);
    return Number.isFinite(order) ? order : 0;
  }
  return 0;
}

function getImageUrl(image: unknown): string {
  if (typeof image === "string") {
    return image.trim();
  }

  if (image && typeof image === "object") {
    const record = image as { url?: string; thumb_url?: string };
    return (record.url ?? record.thumb_url ?? "").trim();
  }

  return "";
}

/** Resolves gallery URLs from listing media; returns [] when none are usable. */
export function resolveListingImageUrls(
  media: PropertyListing["media"] | undefined,
): string[] {
  const images = media?.images;

  if (Array.isArray(images) && images.length > 0) {
    const urls = [...images]
      .sort((a, b) => getImageOrder(a) - getImageOrder(b))
      .map(getImageUrl)
      .filter(Boolean);

    if (urls.length > 0) {
      return urls;
    }
  }

  const thumbnail = media?.thumbnail?.trim();
  return thumbnail ? [thumbnail] : [];
}
