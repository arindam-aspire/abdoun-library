import {
  PROPERTY_LISTING_STATUS_KEYS,
  createListingStatus,
  type PropertyListingStatusKey,
} from "../PropertyCardList/listingStatus";
import type { PropertyListing } from "../PropertyCardList/types";

const EMPTY_LOCATION: PropertyListing["location"] = {
  country_id: 0,
  country: "",
  city_id: 0,
  city: "",
  region_id: 0,
  region: "",
  address: { en: "", ar: "", esp: "", fr: "" },
  latitude: null,
  longitude: null,
  map_embed_url: null,
};

const EMPTY_MEDIA: PropertyListing["media"] = {
  thumbnail: null,
  images: [],
  videos: [],
  virtual_tour_url: null,
  floor_plan_images: [],
  documents: [],
};

/** Shape returned by the MLS submissions list API. */
export type SubmissionApiListing = {
  property_id: string;
  property_hash: number;
  title: string;
  listing_purpose: string;
  type_name: string;
  type_slug: string;
  category_name: string;
  category_slug: string;
  status_name: string;
  status_slug: string;
  price: string;
  currency: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
  submission_id: string;
  submission_status: string;
  submission_submitted_at: string;
  submission_reviewed_at: string | null;
  submission_review_reason: string | null;
  submission_workflow_label: string;
  can_edit_submission: boolean;
  can_delete_submission: boolean;
  agency: PropertyListing["agency"] | null;
};

function isPropertyListingStatusKey(
  value: string,
): value is PropertyListingStatusKey {
  return (PROPERTY_LISTING_STATUS_KEYS as readonly string[]).includes(value);
}

function resolveListingStatus(item: SubmissionApiListing) {
  const workflowKey = item.submission_workflow_label;
  const statusKey = isPropertyListingStatusKey(workflowKey)
    ? workflowKey
    : isPropertyListingStatusKey(item.status_slug)
      ? item.status_slug
      : "draft";

  return createListingStatus(statusKey, item.status_name);
}

function formatApiPrice(price: string, currency: string): string {
  const numeric = Number(price);
  const formatted = Number.isFinite(numeric)
    ? numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : price;

  return `${currency} ${formatted}`;
}

function localizedTitle(title: string): PropertyListing["title"] {
  return { en: title, ar: title, esp: title, fr: title };
}

/** Maps MLS submission API rows to `PropertyListing` for `ListTableView`. */
export function mapSubmissionApiListingToPropertyListing(
  item: SubmissionApiListing,
  index = 0,
): PropertyListing {
  return {
    id: item.property_hash || index + 1,
    property_id: item.property_id,
    property_hash: String(item.property_hash),
    reference_number: item.reference_number,
    title: localizedTitle(item.title),
    description: { en: null, ar: null, esp: null, fr: null },
    price: formatApiPrice(item.price, item.currency),
    status: resolveListingStatus(item),
    category: item.category_name,
    searchPropertyType: item.type_slug,
    city: "",
    areaName: "",
    propertyType: item.type_name,
    media: EMPTY_MEDIA,
    location: EMPTY_LOCATION,
    location_detail: EMPTY_LOCATION,
    beds: 0,
    baths: 0,
    area: null,
    acres: null,
    highlights: item.listing_purpose,
    badges: [item.listing_purpose],
    handover: null,
    paymentPlan: null,
    validatedDate: item.updated_at,
    brokerName: item.agency?.agency_name ?? "",
    brokerLogo: null,
    agency: item.agency ?? undefined,
    owners: [],
    is_exclusive: false,
    is_favourite: false,
  };
}

export function mapSubmissionApiListingsToPropertyListings(
  items: SubmissionApiListing[],
): PropertyListing[] {
  return items.map(mapSubmissionApiListingToPropertyListing);
}
