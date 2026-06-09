import { createListingStatus } from "../PropertyCardList/listingStatus";
import type { PropertyListing } from "../PropertyCardList/types";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
];

function buildProperty(
  id: number,
  title: string,
  price: string,
  overrides: Partial<PropertyListing> = {},
): PropertyListing {
  return {
    id,
    property_id: `PROP-${id}`,
    reference_number: `REF-${id}`,
    title: { en: title, ar: title, esp: title, fr: title },
    description: { en: `${title} description`, ar: null, esp: null, fr: null },
    price,
    status: createListingStatus("verified"),
    category: "Residential",
    searchPropertyType: "villa",
    city: "Amman",
    areaName: "Abdoun",
    propertyType: "Villa",
    media: {
      thumbnail: sampleImages[0]!,
      images: sampleImages.map((url, index) => ({
        id: index + 1,
        url,
        thumb_url: url,
        is_primary: index === 0,
        order: index,
        caption: null,
      })),
      videos: [],
      virtual_tour_url: null,
      floor_plan_images: [],
      documents: [],
    },
    location: {
      country_id: 1,
      country: "Jordan",
      city_id: 1,
      city: "Amman",
      region_id: 1,
      region: "Abdoun",
      address: { en: "Abdoun", ar: "Abdoun", esp: "Abdoun", fr: "Abdoun" },
      latitude: 31.9488329,
      longitude: 35.8926603,
      map_embed_url: "https://maps.google.com/?q=31.9488329,35.8926603",
    },
    location_detail: {
      country_id: 1,
      country: "Jordan",
      city_id: 1,
      city: "Amman",
      region_id: 1,
      region: "Abdoun",
      address: { en: "Abdoun", ar: "Abdoun", esp: "Abdoun", fr: "Abdoun" },
      latitude: 31.9488329,
      longitude: 35.8926603,
      map_embed_url: "https://maps.google.com/?q=31.9488329,35.8926603",
    },
    beds: 4,
    baths: 3,
    area: "3200",
    acres: null,
    highlights: "Garden · Parking",
    badges: ["For Sale"],
    handover: null,
    paymentPlan: null,
    validatedDate: "2026-01-15",
    brokerName: "Abdoun Real Estate",
    brokerLogo: null,
    agent: {
      id: 21,
      name: "Steven G. Copeland",
      phone: "+962791234567",
      whatsapp: "+962791234567",
      email: "steven.copeland@example.com",
      photo: null,
      license_number: null,
    },
    owners: [],
    is_exclusive: true,
    is_favourite: false,
    ...overrides,
  };
}

export const listTableStoryListings: PropertyListing[] = [
  buildProperty(301, "Modern Villa with Garden", "JOD 450,000", {
    status: createListingStatus("verified"),
  }),
  buildProperty(302, "Luxury Apartment in Abdoun", "JOD 320,000", {
    propertyType: "Apartment",
    area: "1850",
    beds: 3,
    baths: 2,
    status: createListingStatus("pending_approval"),
  }),
  buildProperty(303, "Family Home with Terrace", "JOD 280,000", {
    areaName: "Khalda",
    propertyType: "Townhouse",
    status: createListingStatus("approved"),
  }),
  buildProperty(304, "Penthouse with Panoramic Views", "JOD 620,000", {
    propertyType: "Penthouse",
    status: createListingStatus("rejected"),
  }),
  buildProperty(305, "Cozy Studio in Shmeisani", "JOD 125,000", {
    areaName: "Shmeisani",
    propertyType: "Studio",
    beds: 1,
    baths: 1,
    status: createListingStatus("changes_requested"),
  }),
];
