import { amenityOptions } from "./amenitiesFormOptions";
import type {
  FeaturesAndAmenities,
  LocationTaxonomyResponse,
  PropertyFormValues,
  PropertyTaxonomyCategory,
} from "./types";

export const propertyFormFeaturesAndAmenities: FeaturesAndAmenities[] = [
  {
    id: 101,
    name: "Smart home system",
    slug: "smart_home_system",
    feature_group: "FEATURE",
    category: "Residential",
    category_id: 1,
    property_type: "Apartment",
    property_type_id: 1,
  },
  {
    id: 102,
    name: "Private elevator access",
    slug: "private_elevator_access",
    feature_group: "FEATURE",
    category: "Residential",
    category_id: 1,
    property_type: "Villa",
    property_type_id: 2,
  },
  {
    id: 103,
    name: "Rooftop terrace",
    slug: "rooftop_terrace",
    feature_group: "FEATURE",
    category: "Residential",
    category_id: 1,
    property_type: "Apartment",
    property_type_id: 1,
  },
  {
    id: 1,
    name: amenityOptions[0],
    slug: amenityOptions[0].toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    feature_group: "AMENITIES",
    category: "Residential",
    category_id: 1,
    property_type: "Apartment",
    property_type_id: 1,
  },
  {
    id: 2,
    name: amenityOptions[1],
    slug: amenityOptions[1].toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    feature_group: "AMENITIES",
    category: "Residential",
    category_id: 1,
    property_type: "Villa",
    property_type_id: 2,
  },
  ...amenityOptions.slice(2).map((name, index) => ({
    id: index + 3,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    feature_group: "AMENITIES",
    category: "Residential",
    category_id: 1,
    property_type: "Apartment",
    property_type_id: 1,
  })),
];

export const propertyFormCategoryTaxonomy: PropertyTaxonomyCategory[] = [
  {
    id: 1,
    name: "Residential",
    slug: "residential",
    property_types: [
      { id: 1, category_id: 1, name: "Apartment", slug: "apartment" },
      { id: 2, category_id: 1, name: "Villa", slug: "villa" },
    ],
  },
  {
    id: 2,
    name: "Commercial",
    slug: "commercial",
    property_types: [
      { id: 3, category_id: 2, name: "Office", slug: "office" },
      { id: 4, category_id: 2, name: "Retail", slug: "retail" },
    ],
  },
];

export const propertyFormLocationTaxonomy: LocationTaxonomyResponse = {
  data: [
    {
      id: 1,
      name: "Amman",
      areas: [
        { id: 1, name: "Abdoun" },
        { id: 2, name: "Sweifieh" },
        { id: 3, name: "Khalda" },
      ],
    },
    {
      id: 2,
      name: "Irbid",
      areas: [
        { id: 4, name: "City Center" },
        { id: 5, name: "University District" },
      ],
    },
  ],
  total: 2,
};

export const propertyFormFilledValues: PropertyFormValues = {
  basic_info: {
    title: "Luxury Abdoun Penthouse",
    description:
      "A spacious penthouse with panoramic city views, premium finishes, and private rooftop access.",
    listing_purpose: "sale",
    category_id: 1,
    type_id: 1,
  },
  location_insert: {
    city_id: 1,
    area_ids: [1, 2],
    address: "12 Rainbow Street, Abdoun, Amman",
  },
  property_details: {
    bedrooms: 4,
    bathrooms: 3,
    built_up_area: "3200",
    parking_spaces: 2,
    property_age: "1-5",
    completion_status: "ready",
    total_floor: "12",
    occupancy: "vacant",
    ownership_type: "freehold",
    reference_number: "REF-2026-001",
    permit_dld_number: "DLD-88421",
    orientation: "north",
  },
  owner_info: {
    owners: [
      {
        owner_name: "Sara Al-Khatib",
        country_code: "+962",
        phone_number: "791234567",
        email: "sara.khatib@example.com",
        social_security_id: "9988776655",
        nationality: "jordanian",
        owner_address: "12 Rainbow Street, Abdoun, Amman",
        owner_documents: [
          {
            name: "owner-id.pdf",
            uri: "https://example.com/owner-id.pdf",
            mimeType: "application/pdf",
            size: 245000,
          },
        ],
      },
    ],
  },
  pricing_details: {
    price: "850000",
    service_charge: "1200",
    maintenance_fee: "450",
  },
  amenities: {
    selected_amenities: [
      "Smart home system",
      "Rooftop terrace",
      "Private rooftop plunge pool",
      "Smart home climate & lighting",
    ],
  },
  media_upload: {
    media_files: [
      {
        name: "living-room.jpg",
        uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        mimeType: "image/jpeg",
        size: 204800,
      },
      {
        name: "kitchen.jpg",
        uri: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=800&q=80",
        mimeType: "image/jpeg",
        size: 198400,
      },
    ],
    youtube_url: "https://youtube.com/watch?v=example",
    virtual_tour_url: "https://tour.example.com/property",
    documents: [
      {
        name: "floor-plan.pdf",
        uri: "https://example.com/floor-plan.pdf",
        mimeType: "application/pdf",
        size: 156000,
      },
    ],
  },
};
