import type { LocalizedText, PropertyDetails, Locale } from "./types";

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

export function formatListingTypeLabel(listingType: "sale" | "rent"): string {
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
