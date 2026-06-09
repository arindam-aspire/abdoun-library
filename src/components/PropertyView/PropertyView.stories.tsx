import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText, Info, MapPin, Sparkles } from "lucide-react";
import { fn } from "storybook/test";
import { useState } from "react";
import { PropertyView } from "./index";
import type {
  PropertyDetails as PropertyViewDetails,
  PropertyFeatureDefinition,
  PropertyMediaItem,
  PropertyViewProps,
  PropertyViewTabOption,
} from "./types";

const storyFeatures: PropertyFeatureDefinition[] = [
  {
    id: 1,
    feature_group: "AMENITIES",
    slug: "elevator",
    name: "Elevator",
  },
  {
    id: 2,
    feature_group: "AMENITIES",
    slug: "decorations",
    name: "Decorations",
  },
  {
    id: 3,
    feature_group: "AMENITIES",
    slug: "wall_hung_toilets",
    name: "Wall-hung toilets",
  },
  {
    id: 4,
    feature_group: "AMENITIES",
    slug: "marble_floors",
    name: "Marble floors",
  },
  {
    id: 5,
    feature_group: "AMENITIES",
    slug: "wall_closets",
    name: "Wall closets",
  },
  {
    id: 6,
    feature_group: "FEATURE",
    slug: "smart_home",
    name: "Smart home system",
  },
];

const TAB_ICON_CLASS = "size-4";

const storyTabOptions: PropertyViewTabOption[] = [
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

const sampleImageUrls = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop",
];

function toMediaItems(
  urls: string[],
  options?: { startId?: number; startOrder?: number },
): PropertyMediaItem[] {
  const startId = options?.startId ?? 1;
  const startOrder = options?.startOrder ?? 1;

  return urls.map((url, index) => ({
    id: startId + index,
    url,
    thumb_url: url,
    is_primary: index === 0,
    order: startOrder + index,
    caption: null,
  }));
}

const sampleImages = toMediaItems(sampleImageUrls);

const SAMPLE_VIRTUAL_TOUR_URL =
  "https://my.matterport.com/show/?m=xxeWJqmc5zf";

const localized = (en: string) => ({
  en,
  ar: en,
  esp: en,
  fr: en,
});

const sampleProperty: PropertyViewDetails = {
  id: 501,
  reference_number: "REF-2024-501",
  url: null,
  title: localized("2 Bedrooms Apartment"),
  description: localized(
    "Spacious apartment with modern finishes and a premium Abdoun location.\n\nOpen-plan living opens to a bright reception area with floor-to-ceiling glazing and curated built-ins throughout.",
  ),
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
    thumbnail: sampleImageUrls[0]!,
    images: sampleImages,
    videos: [],
    virtual_tour_url: SAMPLE_VIRTUAL_TOUR_URL,
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
    local_highlights: [
      "3 minutes to Abdoun Circle",
      "7 minutes to Taj Lifestyle Center",
      "15 minutes to Abdali Boulevard",
      "Easy access to airport road",
    ],
    lifestyle_description:
      "A quiet, tree-lined residential enclave with boutique cafés, international schools and close-knit community feel.",
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
  features: {
    amenities: [],
  },
  features_list: [
    { id: 1, feature_group: "AMENITIES" },
    { id: 2, feature_group: "AMENITIES" },
    { id: 3, feature_group: "AMENITIES" },
    { id: 4, feature_group: "AMENITIES" },
    { id: 5, feature_group: "AMENITIES" },
    { id: 6, feature_group: "FEATURE" },
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

function withMedia(
  imageUrls: string[],
  thumbnail: string | null = imageUrls[0] ?? null,
): PropertyViewDetails {
  return {
    ...sampleProperty,
    media: {
      ...sampleProperty.media,
      thumbnail,
      images: toMediaItems(imageUrls),
    },
  };
}

function withoutVirtualTour(
  property: PropertyViewDetails = sampleProperty,
): PropertyViewDetails {
  return {
    ...property,
    media: {
      ...property.media,
      virtual_tour_url: null,
    },
  };
}

function PropertyViewDemo({ tabs, ...props }: PropertyViewProps) {
  const tabOptions = tabs?.tabOptions ?? storyTabOptions;
  const [activeTab, setActiveTab] = useState(
    () => tabs?.activeTab ?? tabOptions[0]?.value ?? "overview",
  );

  return (
    <PropertyView
      {...props}
      tabs={{
        tabOptions,
        activeTab,
        onTabChange: setActiveTab,
      }}
    />
  );
}

const meta = {
  title: "Components/PropertyView/PropertyView",
  component: PropertyView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    applicationKey: "abdoun_web",
    propertyDetails: sampleProperty,
    features: storyFeatures,
    showAgent: true,
    showOwner: true,
    onClickFavourite: fn(),
    onClickAgentEmail: fn(),
    onClickAgentPhone: fn(),
    onClickAgentWhatsApp: fn(),
    onClickOwnerEmail: fn(),
    onClickOwnerPhone: fn(),
    onClickOwnerWhatsApp: fn(),
    tabs: {
      tabOptions: storyTabOptions,
    },
  },
  argTypes: {
    showAgent: {
      control: "boolean",
      description: "Show listing agent contact section in PropertyInfo.",
    },
    showOwner: {
      control: "boolean",
      description:
        "Show owner contact section in PropertyInfo (hidden when owner is private).",
    },
    applicationKey: {
      control: "select",
      options: ["abdoun_web", "mls_web"],
    },
    propertyDetails: { control: false },
    features: { control: false },
    tabs: { control: false },
    onClickFavourite: { action: "favourite" },
    onClickAgentEmail: { action: "agent email" },
    onClickAgentPhone: { action: "agent phone" },
    onClickAgentWhatsApp: { action: "agent whatsapp" },
    onClickOwnerEmail: { action: "owner email" },
    onClickOwnerPhone: { action: "owner phone" },
    onClickOwnerWhatsApp: { action: "owner whatsapp" },
    onClickAgent: { action: "agent" },
    onClickOwner: { action: "owner" },
    isLoading: { control: "boolean" },
    isFavouriteLoading: { control: "boolean" },
    buttonSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    locale: {
      control: "select",
      options: ["en", "ar", "esp", "fr"],
    },
  },
  render: (args) => <PropertyViewDemo {...args} />,
} satisfies Meta<typeof PropertyView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Larger hero and contact actions from `sm` up; mobile sizing unchanged. */
export const ButtonSizeLarge: Story = {
  args: {
    buttonSize: "lg",
  },
};

/** Compact hero and contact actions from `sm` up; mobile sizing unchanged. */
export const ButtonSizeSmall: Story = {
  args: {
    buttonSize: "sm",
  },
};

export const AgentOnly: Story = {
  name: "Agent only (no owner)",
  args: {
    showAgent: true,
    showOwner: false,
  },
};

export const OwnerOnly: Story = {
  name: "Owner only (no agent)",
  args: {
    showAgent: false,
    showOwner: true,
  },
};

export const PriceOnly: Story = {
  name: "Price only (no agent or owner)",
  args: {
    showAgent: false,
    showOwner: false,
  },
};

export const PrivateOwner: Story = {
  name: "Private owner (hidden despite showOwner)",
  args: {
    showAgent: true,
    showOwner: true,
    propertyDetails: {
      ...sampleProperty,
      owner: {
        ...sampleProperty.owner,
        is_private: true,
      },
    },
  },
};

export const WithVideo: Story = {
  name: "With video",
  args: {
    propertyDetails: {
      ...withMedia(sampleImageUrls),
      media: {
        ...withMedia(sampleImageUrls).media,
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      },
    },
  },
};

export const FallbackImage: Story = {
  name: "No images (fallback)",
  args: {
    propertyDetails: withoutVirtualTour(withMedia([], null)),
  },
};

export const NoFeatures: Story = {
  name: "No features",
  args: {
    propertyDetails: {
      ...sampleProperty,
      features_list: [],
    },
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "features",
    },
  },
};

export const NoNeighborhood: Story = {
  name: "No neighborhood details",
  args: {
    propertyDetails: {
      ...sampleProperty,
      location_detail: {
        ...sampleProperty.location_detail,
        local_highlights: [],
        lifestyle_description: null,
      },
    },
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "locations",
    },
  },
};

const sampleDocuments = toMediaItems(
  [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  ],
  { startId: 136393, startOrder: 1 },
).map((item) => ({
  ...item,
  caption: "property.pdf",
}));

const sampleFloorPlans = toMediaItems(
  [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
  ],
  { startId: 200001, startOrder: 1 },
);

export const WithDocuments: Story = {
  name: "With documents",
  args: {
    propertyDetails: {
      ...sampleProperty,
      media: {
        ...sampleProperty.media,
        documents: sampleDocuments,
        floor_plan_images: sampleFloorPlans,
      },
    },
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "documents",
    },
  },
};

export const WithVirtualTour: Story = {
  name: "With virtual tour",
  args: {
    propertyDetails: sampleProperty,
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "overview",
    },
  },
};

export const WithoutVirtualTour: Story = {
  name: "Without virtual tour",
  args: {
    propertyDetails: withoutVirtualTour(),
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "overview",
    },
  },
};

export const NoDocuments: Story = {
  name: "No documents",
  args: {
    propertyDetails: {
      ...sampleProperty,
      media: {
        ...sampleProperty.media,
        documents: [],
        floor_plan_images: [],
      },
    },
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "documents",
    },
  },
};

export const NoMap: Story = {
  name: "No map preview",
  args: {
    propertyDetails: {
      ...sampleProperty,
      latitude: null,
      longitude: null,
      location_detail: {
        ...sampleProperty.location_detail,
        latitude: null,
        longitude: null,
        map_embed_url: null,
      },
    },
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "locations",
    },
  },
};

export const LoadingOverview: Story = {
  name: "Loading (overview tab)",
  args: {
    isLoading: true,
    propertyDetails: undefined,
    showAgent: true,
    showOwner: true,
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "overview",
    },
  },
};

export const LoadingAgentOnly: Story = {
  name: "Loading (agent only)",
  args: {
    isLoading: true,
    propertyDetails: undefined,
    showAgent: true,
    showOwner: false,
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "overview",
    },
  },
};

export const LoadingFeatures: Story = {
  name: "Loading (features tab)",
  args: {
    isLoading: true,
    propertyDetails: undefined,
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "features",
    },
  },
};

export const LoadingLocations: Story = {
  name: "Loading (locations tab)",
  args: {
    isLoading: true,
    propertyDetails: undefined,
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "locations",
    },
  },
};

export const LoadingDocuments: Story = {
  name: "Loading (documents tab)",
  args: {
    isLoading: true,
    propertyDetails: undefined,
    tabs: {
      tabOptions: storyTabOptions,
      activeTab: "documents",
    },
  },
};
