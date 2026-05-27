import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { PropertyDetails } from "./index";
import type { PropertyDetails as PropertyDetailsModel } from "./types";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop",
];

const sampleProperty: PropertyDetailsModel = {
  id: 501,
  reference_number: "REF-2024-501",
  url: null,
  title: {
    en: "Duplex for Rent — Abdoun",
    ar: null,
    esp: null,
    fr: null,
  },
  description: {
    en: "Spacious duplex with modern finishes, private garden, and premium location in Abdoun's first circle.",
    ar: null,
    esp: null,
    fr: null,
  },
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
    thumbnail: sampleImages[0]!,
    images: sampleImages,
    videos: [],
    virtual_tour_url: null,
    floor_plan_images: [],
    documents: [],
  },
  latitude: 31.9522,
  longitude: 35.8847,
  location_name: "Residential in 1st Circle, Amman, Jordan",
  is_exclusive: true,
  location_detail: {
    country_id: 1,
    country: "Jordan",
    city_id: 1,
    city: "Amman",
    region_id: 1,
    region: "Abdoun",
    address: {
      en: "1st Circle",
      ar: null,
      esp: null,
      fr: null,
    },
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
    floor_type: "Marble",
    floor_number: 2,
    building_status: "Ready",
    built_in_year: 2019,
    furniture_status: "Semi-furnished",
    furniture_condition: "Excellent",
    garage_type: "Private",
    total_floors_in_building: 3,
  },
  details: {
    built_up_area: 3200,
    land_area: null,
    garden_area: 450,
    terrace_area: null,
    area_unit: "sqft",
    bedrooms: 4,
    master_bedrooms: 1,
    bathrooms: 3,
    living_rooms: 2,
    salons: 1,
    balconies: 2,
    entrances: 1,
    kitchens: 1,
    kitchen_type: "Open",
    maid_rooms: 1,
    driver_rooms: 0,
    store_rooms: 1,
  },
  features: {
    amenities: [
      "Private rooftop plunge pool",
      "Dual living & dining lounges",
      "Chef's show kitchen & prep kitchen",
      "Panoramic floor-to-ceiling windows",
      "Smart home climate & lighting",
      "En-suite bedrooms with walk-in wardrobes",
      "Private study / library corner",
      "Dedicated maid's room with service entrance",
      "Three allocated parking bays",
      "Residents' indoor fitness studio",
      "Lobby concierge & 24/7 security",
      "Proximity to international schools & embassies",
    ],
  },
  pricing: {
    listing_type: "rent",
    selling_price: null,
    currency: "JOD",
    price_on_request: false,
    rent_commission_percent: 5,
    contract_duration: 12,
    payment_method: "Monthly",
    is_negotiable: true,
    installment_available: false,
  },
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-02-01T12:00:00Z",
  published_at: "2024-01-16T08:00:00Z",
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
    license_number: "LIC-1001",
  },
  owner: {
    id: 8,
    name: "Palash Kundu",
    phone: "+962780000000",
    email: "owner@example.com",
    is_private: false,
  },
  created_by: {
    id: 3,
    name: "Admin User",
    role: "admin",
  },
};

const meta = {
  title: "Components/PropertyDetails/PropertyDetails",
  component: PropertyDetails,
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
    propertyDetails: sampleProperty,
    isAuthenticated: true,
    isFavourite: false,
    ownerCompanyLabel: "Abdoun Real Estate",
    onFavourite: fn(),
    onEmail: fn(),
    onPhone: fn(),
    onWhatsApp: fn(),
    onOwnerEmail: fn(),
    onOwnerPhone: fn(),
    onOwnerWhatsApp: fn(),
    onTabChange: fn(),
  },
} satisfies Meta<typeof PropertyDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ForSale: Story = {
  args: {
    propertyDetails: {
      ...sampleProperty,
      listing_type: "sale",
      title: {
        ...sampleProperty.title,
        en: "Luxury Villa — Dabouq",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows PropertyDetailsSkleton while property data is loading (`isLoading={true}`).",
      },
    },
  },
};

function FavouriteDemo() {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <PropertyDetails
      propertyDetails={sampleProperty}
      isAuthenticated
      isFavourite={isFavourite}
      onFavourite={() => setIsFavourite((prev) => !prev)}
    />
  );
}

export const WithFavouriteToggle: Story = {
  render: () => <FavouriteDemo />,
};

export const SingleImage: Story = {
  args: {
    propertyDetails: {
      ...sampleProperty,
      media: {
        ...sampleProperty.media,
        images: [sampleImages[0]!],
      },
    },
  },
};

export const AsAgent: Story = {
  args: {
    role: "agent",
    propertyDetails: {
      ...sampleProperty,
      media: {
        ...sampleProperty.media,
        documents: [
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/property-title-deed.pdf",
          "https://www.lw.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/building-permit-certificate.pdf",
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/service-charge-schedule.pdf",
        ],
        floor_plan_images: [sampleImages[1]!, sampleImages[2]!],
      },
      location_detail: {
        ...sampleProperty.location_detail,
        map_embed_url:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3387.0!2d35.8847!3d31.9522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU3JzA4LjAiTiAzNcKwNTMnMDUuMCJF!5e0!3m2!1sen!2sjo!4v1234567890",
        local_highlights: [
          "3 minutes to Abdoun Circle",
          "7 minutes to Taj Lifestyle Center",
          "15 minutes to Abdali Boulevard",
          "Easy access to airport road",
        ],
        lifestyle_description:
          "A quiet, tree-lined residential enclave with boutique cafés, international schools and close-knit community feel.",
      },
    },
  },
};

export const AsOwner: Story = {
  args: {
    role: "owner",
    propertyDetails: {
      ...sampleProperty,
      media: {
        ...sampleProperty.media,
        documents: [
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/property-title-deed.pdf",
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/building-permit-certificate.pdf",
        ],
        floor_plan_images: [sampleImages[1]!, sampleImages[2]!],
      },
    },
  },
};

export const RegisteredUser: Story = {
  args: {
    role: "registered_user",
  },
};

const mlsOverviewProperty: PropertyDetailsModel = {
  ...sampleProperty,
  listing_type: "sale",
  property_type: "Penthouse",
  status: "Verified",
  bedrooms: 4,
  bathrooms: 5,
  built_up_area: 6500,
  description: {
    en: "Experience elevated living in this sprawling eco-smart penthouse overlooking Abdoun and the Amman skyline. Thoughtfully crafted with double-height ceilings, floor-to-ceiling windows and a private rooftop plunge pool, The Azure Penthouse combines contemporary design with warm, natural finishes.\n\nA dedicated concierge lobby, direct lift access and three private parking bays ensure complete privacy and convenience for you and your guests.",
    ar: null,
    esp: null,
    fr: null,
  },
  more_features: {
    payment_plan: "30 / 70",
    service_charge: "On request",
    expected_rental_yield: "6.5% - 7.2%",
  },
  details: {
    ...sampleProperty.details,
    bedrooms: 4,
    bathrooms: 5,
    built_up_area: 6500,
  },
  media: {
    ...sampleProperty.media,
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  },
  pricing: {
    ...sampleProperty.pricing,
    listing_type: "sale",
    installment_available: true,
    payment_method: "30 / 70",
  },
};

export const AbdounWebOverview: Story = {
  args: {
    applicationKey: "abdoun_web",
    propertyDetails: {
      ...sampleProperty,
      listing_type: "sale",
      status: "Verified",
      property_type: "Building",
      bedrooms: 1,
      bathrooms: 2,
      built_up_area: 1200,
      description: {
        en: null,
        ar: null,
        esp: null,
        fr: null,
      },
      details: {
        ...sampleProperty.details,
        bedrooms: 1,
        bathrooms: 2,
        built_up_area: 1200,
      },
      pricing: {
        ...sampleProperty.pricing,
        listing_type: "sale",
        price_on_request: true,
        payment_method: null,
      },
    },
  },
};

export const MlsWebOverview: Story = {
  args: {
    applicationKey: "mls_web",
    propertyDetails: mlsOverviewProperty,
  },
};
