import type { PropertyListing } from "../PropertyCardList/types";

type Locale = keyof PropertyListing["title"];

export function resolveListingTitle(
  listing: PropertyListing,
  locale: Locale = "en",
): string {
  return listing.title[locale] || listing.title.en;
}

export function resolveListingLocation(listing: PropertyListing): string {
  return [listing.areaName, listing.city].filter(Boolean).join(", ");
}

export function resolveListingReference(listing: PropertyListing): string {
  return listing.reference_number ?? listing.property_id ?? "";
}

const submissionDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatListingSubmissionDate(
  value: string | null | undefined,
): string {
  if (!value?.trim()) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return submissionDateFormatter.format(date);
}

export function resolveListingSubmittedBy(listing: PropertyListing): string {
  return (
    listing.submission_submitted_by?.trim() ||
    listing.agency?.agency_name?.trim() ||
    listing.brokerName?.trim() ||
    ""
  );
}

export function hasListingSubmissionMeta(listing: PropertyListing): boolean {
  return Boolean(
    formatListingSubmissionDate(listing.submitted_on) ||
      resolveListingSubmittedBy(listing),
  );
}
