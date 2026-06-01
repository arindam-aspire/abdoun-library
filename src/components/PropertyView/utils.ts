import type { PropertyDetails, PropertyMediaItem } from "./types";
import {
  pickDisplayUrls,
  pickFullUrls,
  resolveMediaImages,
} from "../../lib/resolvePropertyMediaImages";

type LocalizedText = PropertyDetails["title"];
type LocalizedNullableText = PropertyDetails["description"];
type Locale = keyof LocalizedText;

export function getLocalizedText(
  text: LocalizedText,
  locale: Locale = "en",
  fallbackLocale: Locale = "en",
): string {
  return (
    text[locale] ??
    text[fallbackLocale] ??
    text.en ??
    text.ar ??
    text.esp ??
    text.fr ??
    ""
  );
}

export function getLocalizedNullableText(
  text: LocalizedNullableText,
  locale: Locale = "en",
  fallbackLocale: Locale = "en",
): string {
  const normalized: LocalizedText = {
    en: text.en ?? "",
    ar: text.ar ?? "",
    esp: text.esp ?? "",
    fr: text.fr ?? "",
  };

  return getLocalizedText(normalized, locale, fallbackLocale);
}

export function formatSpecValue(
  value: string | number | null | undefined,
  unit?: string,
): string {
  if (value == null || value === "") {
    return "";
  }

  const formatted =
    typeof value === "number" ? value.toLocaleString() : String(value);

  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatPropertyLocation(
  propertyDetails: PropertyDetails,
  locale: Locale = "en",
): string {
  if (propertyDetails.location_name) {
    return propertyDetails.location_name;
  }

  const { location_detail: locationDetail } = propertyDetails;
  const address = getLocalizedText(locationDetail.address, locale);
  const parts = [
    address,
    locationDetail.region,
    locationDetail.city,
    locationDetail.country,
  ].filter(Boolean);

  return parts.join(", ");
}

export type PropertyMoreFeatures = {
  payment_plan?: string | null;
  payment_plan_note?: string | null;
  service_charge?: string | null;
  service_charge_note?: string | null;
  expected_rental_yield?: string | null;
  rental_yield_note?: string | null;
};

export function parsePropertyMoreFeatures(
  value: unknown,
): PropertyMoreFeatures {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const record = value as Record<string, unknown>;
  const readString = (key: keyof PropertyMoreFeatures) => {
    const entry = record[key];
    return typeof entry === "string" && entry.trim() ? entry : null;
  };

  return {
    payment_plan: readString("payment_plan"),
    payment_plan_note: readString("payment_plan_note"),
    service_charge: readString("service_charge"),
    service_charge_note: readString("service_charge_note"),
    expected_rental_yield: readString("expected_rental_yield"),
    rental_yield_note: readString("rental_yield_note"),
  };
}

export function formatListingTypeLabel(listingType: string): string {
  return listingType === "sale" ? "For sale" : "For rent";
}

function resolvePropertyCoordinates(
  propertyDetails: PropertyDetails,
): { latitude: number; longitude: number } | null {
  const latitude =
    propertyDetails.location_detail.latitude ?? propertyDetails.latitude;
  const longitude =
    propertyDetails.location_detail.longitude ?? propertyDetails.longitude;

  if (latitude == null || longitude == null) {
    return null;
  }

  return { latitude, longitude };
}

export function getPropertyMapEmbedUrl(
  propertyDetails: PropertyDetails,
): string | null {
  if (propertyDetails.location_detail.map_embed_url) {
    return propertyDetails.location_detail.map_embed_url;
  }

  const coordinates = resolvePropertyCoordinates(propertyDetails);
  if (!coordinates) {
    return null;
  }

  const { latitude, longitude } = coordinates;
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}

export function getPropertyMapsOpenUrl(
  propertyDetails: PropertyDetails,
): string | null {
  const coordinates = resolvePropertyCoordinates(propertyDetails);
  if (!coordinates) {
    return null;
  }

  const { latitude, longitude } = coordinates;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

export function getDocumentLabelFromUrl(url: string, index: number): string {
  try {
    const pathname = new URL(url).pathname;
    const segment = pathname.split("/").filter(Boolean).pop();
    if (segment) {
      return decodeURIComponent(segment.replace(/[-_]/g, " "));
    }
  } catch {
    // ignore invalid URLs
  }

  return `Document ${index + 1}`;
}

export function getDocumentFileType(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop()?.toLowerCase();
    if (extension && extension.length <= 5) {
      return extension.toUpperCase();
    }
  } catch {
    // ignore invalid URLs
  }

  return "FILE";
}

export function sortMediaItems(items: PropertyMediaItem[]): PropertyMediaItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function resolvePropertyMediaImages(
  media: PropertyDetails["media"],
): ReturnType<typeof resolveMediaImages> {
  return resolveMediaImages(media.images, media.thumbnail);
}

/** Display URLs for hero, cards, and thumbnails (prefers `thumb_url`). */
export function resolvePropertyDisplayImageUrls(
  media: PropertyDetails["media"],
): string[] {
  return pickDisplayUrls(resolvePropertyMediaImages(media));
}

/** Full-resolution URLs for property detail lightbox. */
export function resolvePropertyFullImageUrls(
  media: PropertyDetails["media"],
): string[] {
  return pickFullUrls(resolvePropertyMediaImages(media));
}

export function resolvePropertyImageUrls(
  media: PropertyDetails["media"],
): string[] {
  return resolvePropertyDisplayImageUrls(media);
}

export function hasPropertyDocuments(media: PropertyDetails["media"]): boolean {
  return (
    (media.documents?.length ?? 0) > 0 ||
    (media.floor_plan_images?.length ?? 0) > 0
  );
}

export function getMediaItemLabel(
  item: PropertyMediaItem,
  index: number,
  fallback: string,
): string {
  const caption = item.caption?.trim();
  if (caption) {
    return caption;
  }

  const fromUrl = getDocumentLabelFromUrl(item.url, index);
  if (fromUrl !== `Document ${index + 1}`) {
    return fromUrl;
  }

  return fallback;
}
