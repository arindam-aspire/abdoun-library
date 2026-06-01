import { FileText, Info, MapPin, Sparkles } from "lucide-react";
import type {
  PropertyDetails,
  PropertyFeatureDefinition,
  PropertyViewTabOption,
} from "./types";

const TAB_ICON_CLASS = "size-4";

export const propertyViewStoryTabOptions: PropertyViewTabOption[] = [
  {
    value: "overview",
    label: "Overview",
    icon: <Info className={TAB_ICON_CLASS} aria-hidden />,
  },
  {
    value: "features",
    label: "Features",
    icon: <Sparkles className={TAB_ICON_CLASS} aria-hidden />,
  },
  {
    value: "locations",
    label: "Locations",
    icon: <MapPin className={TAB_ICON_CLASS} aria-hidden />,
  },
  {
    value: "documents",
    label: "Documents",
    icon: <FileText className={TAB_ICON_CLASS} aria-hidden />,
  },
];

export const propertyViewStoryFeatures: PropertyFeatureDefinition[] = [
  { id: 1, feature_group: "AMENITIES", slug: "elevator", name: "Elevator" },
  { id: 2, feature_group: "AMENITIES", slug: "decorations", name: "Decorations" },
  {
    id: 3,
    feature_group: "AMENITIES",
    slug: "wall_hung_toilets",
    name: "Wall-hung toilets",
  },
];

const localized = (en: string) => ({
  en,
  ar: en,
  esp: en,
  fr: en,
});

const sampleImageUrl =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop";

/** Minimal property payload for PropertyView / tabs stories. */
export const propertyViewStoryProperty: PropertyDetails = {
  id: 501,
  reference_number: "REF-2024-501",
  url: null,
  title: localized("2 Bedrooms Apartment"),
  description: localized("Sample property for Storybook tab stories."),
  category: "Residential",
  property_type: "Duplex",
  status: "Available",
  listing_type: "rent",
  selling_price_amount: null,
  selling_price_currency: null,
  rent_price_amount: 12000,
  rent_price_currency: "JOD",
  bedrooms: 4,
  bathrooms: 3,
  built_up_area: 3200,
  more_features: null,
  media: {
    thumbnail: sampleImageUrl,
    images: [
      {
        id: 1,
        url: sampleImageUrl,
        thumb_url: sampleImageUrl,
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
  latitude: 31.9522,
  longitude: 35.8847,
  location_name: "Abdoun, Amman",
  is_exclusive: true,
  location_detail: {
    country_id: 1,
    country: "Jordan",
    city_id: 1,
    city: "Amman",
    region_id: 1,
    region: "Abdoun",
    address: localized("1st Circle"),
    latitude: 31.9522,
    longitude: 35.8847,
    map_embed_url: null,
    local_highlights: ["3 minutes to Abdoun Circle"],
    lifestyle_description: "Quiet residential area.",
  },
  general: {
    floor_type: null,
    floor_number: null,
    building_status: null,
    built_in_year: null,
    furniture_status: null,
    furniture_condition: null,
    garage_type: null,
    total_floors_in_building: null,
  },
  details: {
    built_up_area: 3200,
    land_area: null,
    garden_area: null,
    terrace_area: null,
    area_unit: "sqft",
    bedrooms: 4,
    master_bedrooms: null,
    bathrooms: 3,
    living_rooms: null,
    salons: null,
    balconies: null,
    entrances: null,
    kitchens: null,
    kitchen_type: null,
    maid_rooms: null,
    driver_rooms: null,
    store_rooms: null,
  },
  features: { amenities: [] },
  features_list: [
    { id: 1, feature_group: "AMENITIES" },
    { id: 2, feature_group: "AMENITIES" },
  ],
  pricing: {
    listing_type: "rent",
    selling_price: null,
    currency: "JOD",
    price_on_request: false,
    rent_commission_percent: null,
    contract_duration: null,
    payment_method: null,
    is_negotiable: false,
    installment_available: false,
  },
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-02-01T12:00:00Z",
  published_at: null,
  expires_at: null,
  sold_at: null,
  rented_at: null,
  agent: {
    id: 12,
    name: "Jalal Yance",
    phone: "+962790000000",
    whatsapp: "+962790000000",
    email: "agent@abdoun.test",
    photo: null,
    license_number: null,
  },
  owner: {
    id: 8,
    name: "Palash Kundu",
    phone: "+962780000000",
    email: "owner@example.com",
    is_private: false,
  },
  created_by: { id: 3, name: "Admin User", role: "admin" },
  agency: null,
};
