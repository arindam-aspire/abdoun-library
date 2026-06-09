import { createListingStatus } from "../PropertyCardList/listingStatus";
import type { PropertyListing } from "../PropertyCardList/types";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600565892932-2518172ba35a?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd7a?w=800&auto=format&fit=crop",
];

const localized = (en: string) => ({ en, ar: en, esp: en, fr: en });

const sampleLocation = {
  country_id: 1,
  country: "Jordan",
  city_id: 1,
  city: "Amman",
  region_id: 1,
  region: "Abdoun",
  address: localized("1st Circle"),
  latitude: 31.9488329,
  longitude: 35.8926603,
  map_embed_url: "https://maps.google.com/?q=31.9488329,35.8926603",
};

function buildListing(
  id: number,
  overrides: Partial<PropertyListing>,
): PropertyListing {
  const imageIndex = id % sampleImages.length;

  return {
    id,
    property_id: `PROP-${id}`,
    reference_number: `REF-${id}`,
    title: localized("Apartment"),
    description: { en: null, ar: null, esp: null, fr: null },
    price: "JOD 200,000",
    status: createListingStatus("verified"),
    category: "Residential",
    searchPropertyType: "apartment",
    city: "Amman",
    areaName: "Abdoun",
    propertyType: "Apartment for Sale / Rent",
    media: {
      thumbnail: sampleImages[imageIndex]!,
      images: [
        {
          id: 1,
          url: sampleImages[imageIndex]!,
          thumb_url: sampleImages[imageIndex]!,
          is_primary: true,
          order: 1,
          caption: null,
        },
      ],
      videos: [],
      virtual_tour_url: null,
      floor_plan_images: [],
      documents: [],
    },
    location: sampleLocation,
    location_detail: sampleLocation,
    beds: 3,
    baths: 2,
    area: "1800",
    acres: null,
    highlights: "",
    badges: ["For Sale"],
    handover: null,
    paymentPlan: null,
    validatedDate: "2024-01-15",
    brokerName: "Abdoun Real Estate",
    brokerLogo: null,
    owners: [],
    is_exclusive: false,
    is_favourite: false,
    ...overrides,
  };
}

export const similarPropertiesStoryListings: PropertyListing[] = [
  buildListing(401, {
    price: "JOD 180,000",
    areaName: "Um Uthayna",
    propertyType: "Apartment for Rent",
    badges: ["For Sale"],
  }),
  buildListing(402, {
    price: "JOD 200,000",
    areaName: "7th Circle",
    propertyType: "Apartment for Sale / Rent",
  }),
  buildListing(403, {
    price: "JOD 200,000",
    areaName: "7th Circle",
    propertyType: "Apartment for Sale / Rent",
  }),
  buildListing(404, {
    price: "JOD 200,000",
    areaName: "7th Circle",
    propertyType: "Apartment for Sale / Rent",
  }),
  buildListing(405, {
    price: "JOD 200,000",
    areaName: "Um Alsumaq",
    propertyType: "Apartment for Rent",
  }),
  buildListing(406, {
    price: "JOD 200,000",
    areaName: "7th Circle",
    propertyType: "Apartment for Sale / Rent",
  }),
];
