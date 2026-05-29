import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import type { PropertyListing } from "../PropertyCardList/types";

type LocalizedText = PropertyListing["title"];
type LocalizedNullableText = PropertyListing["description"];
type PropertyLocation = PropertyListing["location"];
import { GridCardSkeleton, ListCardSkeleton, PropertyListCard } from "./index";
import type { PropertyListCardProps } from "./types";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
];

function localized(en: string): LocalizedText {
  return { en, ar: en, esp: en, fr: en };
}

function localizedNullable(en: string): LocalizedNullableText {
  return { en, ar: null, esp: null, fr: null };
}

const sampleLocation: PropertyLocation = {
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

const emptyMedia: PropertyListing["media"] = {
  thumbnail: null,
  images: [],
  videos: [],
  virtual_tour_url: null,
  floor_plan_images: [],
  documents: [],
};

function buildPropertyListing(
  overrides: Partial<PropertyListing> = {},
): PropertyListing {
  return {
    id: 301,
    property_id: "PROP-301",
    reference_number: "REF-301",
    title: localized("Modern Villa with Garden"),
    description: localizedNullable(
      "Spacious villa with modern finishes in Abdoun.",
    ),
    price: "JOD 450,000",
    status: "Available",
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
    location: sampleLocation,
    location_detail: sampleLocation,
    beds: 4,
    baths: 3,
    area: "3200",
    acres: null,
    highlights: "Garden · Parking",
    badges: ["For Sale", "Verified"],
    handover: null,
    paymentPlan: null,
    validatedDate: "2024-01-15",
    brokerName: "Abdoun Real Estate",
    brokerLogo: null,
    agent: {
      id: 21,
      name: "Steven G. Copeland",
      phone: "+962791234567",
      whatsapp: "+962791234567",
      email: "steven.copeland@example.com",
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces",
      license_number: null,
    },
    owners: [
      {
        owner_id: "1",
        full_name: "Ahmad Al-Khatib",
        email: "ahmad.khatib@example.com",
        phone: "+962 79 000 0000",
        nationality: "Jordanian",
        ssi: "SSI-001-2026",
        address: "1st Circle, Abdoun, Amman",
        documents: [
          {
            url: "https://example.com/docs/owner-1-passport.pdf",
            file_name: "Passport - Ahmad Al-Khatib.pdf",
          },
        ],
        is_active: true,
      },
      {
        owner_id: "2",
        full_name: "Lina Al-Khalidi",
        email: "lina.khalidi@example.com",
        phone: "+962 79 765 4321",
        nationality: "Jordanian",
        ssi: "SSI-002-2026",
        address: "7th Circle, Amman",
        documents: [
          {
            url: "https://example.com/docs/owner-2-id.pdf",
            file_name: "National ID - Lina Al-Khalidi.pdf",
          },
          {
            url: "https://example.com/docs/owner-2-proof.pdf",
            file_name: "Proof of Address - Lina Al-Khalidi.pdf",
          },
        ],
        is_active: true,
      },
    ],
    is_exclusive: true,
    is_favourite: false,
    ...overrides,
  };
}

const samplePropertyListing = buildPropertyListing();

const sharedHandlers: Pick<
  PropertyListCardProps,
  "onClickEmail" | "onClickCall" | "onClickWhatsApp" | "onClickFavourite" | "onClick"
> = {
  onClickEmail: () => {},
  onClickCall: () => {},
  onClickWhatsApp: () => {},
  onClickFavourite: () => {},
  onClick: () => {},
};

const listDecorator = (Story: () => ReactNode) => (
  <div className="mx-auto w-full max-w-3xl">
    <Story />
  </div>
);

const gridDecorator = (Story: () => ReactNode) => (
  <div className="mx-auto w-full max-w-sm">
    <Story />
  </div>
);

function createLayoutPair(
  cardArgs: Omit<Partial<PropertyListCardProps>, "layoutVariant"> = {},
): { list: Story; grid: Story } {
  const propertyDetails =
    cardArgs.propertyDetails ?? samplePropertyListing;

  return {
    list: {
      args: {
        ...sharedHandlers,
        ...cardArgs,
        propertyDetails,
        layoutVariant: "list",
        canViewOwners: cardArgs.canViewOwners ?? true,
        canViewAgents: cardArgs.canViewAgents ?? true,
        canViewBadges: cardArgs.canViewBadges ?? true,
      },
      decorators: [listDecorator],
    },
    grid: {
      args: {
        ...sharedHandlers,
        ...cardArgs,
        propertyDetails,
        layoutVariant: "grid",
        canViewOwners: cardArgs.canViewOwners ?? true,
        canViewAgents: cardArgs.canViewAgents ?? true,
        canViewBadges: cardArgs.canViewBadges ?? true,
      },
      decorators: [gridDecorator],
    },
  };
}

const meta = {
  title: "Components/PropertyListCard",
  component: PropertyListCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    layoutVariant: {
      control: "radio",
      options: ["list", "grid"],
    },
    canViewOwners: { control: "boolean" },
    canViewAgents: { control: "boolean" },
    canViewBadges: { control: "boolean" },
  },
  args: {
    propertyDetails: samplePropertyListing,
    layoutVariant: "list",
    canViewOwners: true,
    canViewAgents: true,
    canViewBadges: true,
    ...sharedHandlers,
  },
} satisfies Meta<typeof PropertyListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultPair = createLayoutPair();
export const List = defaultPair.list;
export const Grid = defaultPair.grid;

const withoutFavouritePair = createLayoutPair({ onClickFavourite: undefined });
export const ListWithoutFavourite = withoutFavouritePair.list;
export const GridWithoutFavourite = withoutFavouritePair.grid;

const noBadgesPair = createLayoutPair({
  canViewBadges: false,
  propertyDetails: buildPropertyListing({ badges: [] }),
});
export const ListNoBadges = noBadgesPair.list;
export const GridNoBadges = noBadgesPair.grid;

const withoutAgentPair = createLayoutPair({ canViewAgents: false });
export const ListWithoutAgent = withoutAgentPair.list;
export const GridWithoutAgent = withoutAgentPair.grid;

const hideOwnersPair = createLayoutPair({ canViewOwners: false });
export const ListHideOwners = hideOwnersPair.list;
export const GridHideOwners = hideOwnersPair.grid;

const minimalPair = createLayoutPair({
  canViewOwners: false,
  canViewAgents: false,
  canViewBadges: false,
  onClickFavourite: undefined,
  propertyDetails: buildPropertyListing({ badges: [], is_exclusive: false }),
});
export const ListMinimal = minimalPair.list;
export const GridMinimal = minimalPair.grid;

const singleImagePair = createLayoutPair({
  propertyDetails: buildPropertyListing({
    media: {
      thumbnail: sampleImages[0]!,
      images: [
        {
          id: 1,
          url: sampleImages[0]!,
          thumb_url: sampleImages[0]!,
          is_primary: true,
          order: 0,
          caption: null,
        },
      ],
      videos: [],
      virtual_tour_url: null,
      floor_plan_images: [],
      documents: [],
    },
    badges: ["For Rent"],
  }),
});
export const ListSingleImage = singleImagePair.list;
export const GridSingleImage = singleImagePair.grid;

const fallbackImagePair = createLayoutPair({
  propertyDetails: buildPropertyListing({
    title: localized("Property without photos"),
    media: emptyMedia,
    badges: ["New"],
  }),
});
export const ListFallbackImage = fallbackImagePair.list;
export const GridFallbackImage = fallbackImagePair.grid;

const favouritePair = createLayoutPair({
  propertyDetails: buildPropertyListing({ is_favourite: true }),
});
export const ListFavourite = favouritePair.list;
export const GridFavourite = favouritePair.grid;

const favouriteLoadingPair = createLayoutPair({
  isFavouriteLoading: true,
});
export const ListFavouriteLoading = favouriteLoadingPair.list;
export const GridFavouriteLoading = favouriteLoadingPair.grid;

const noMapPair = createLayoutPair({
  propertyDetails: buildPropertyListing({
    location_detail: {
      ...sampleLocation,
      latitude: null,
      longitude: null,
      map_embed_url: null,
    },
  }),
});
export const ListNoMap = noMapPair.list;
export const GridNoMap = noMapPair.grid;

const noOwnersDataPair = createLayoutPair({
  canViewOwners: true,
  propertyDetails: buildPropertyListing({ owners: [] }),
});
export const ListNoOwnersData = noOwnersDataPair.list;
export const GridNoOwnersData = noOwnersDataPair.grid;

const agentEmailFallbackPair = createLayoutPair({
  canViewAgents: true,
  propertyDetails: buildPropertyListing({
    agent: {
      id: 99,
      name: "Dana Haddad",
      phone: null,
      whatsapp: null,
      email: "dana.haddad@example.com",
      photo: null,
      license_number: null,
    },
  }),
});
export const ListAgentEmailFallback = agentEmailFallbackPair.list;
export const GridAgentEmailFallback = agentEmailFallbackPair.grid;

const noHighlightsPair = createLayoutPair({
  propertyDetails: buildPropertyListing({ highlights: "" }),
});
export const ListNoHighlights = noHighlightsPair.list;
export const GridNoHighlights = noHighlightsPair.grid;

const noSpecsPair = createLayoutPair({
  propertyDetails: buildPropertyListing({
    beds: null as unknown as number,
    baths: null as unknown as number,
    area: null,
  }),
});
export const ListNoSpecs = noSpecsPair.list;
export const GridNoSpecs = noSpecsPair.grid;

const localizedFallbackPair = createLayoutPair({
  propertyDetails: buildPropertyListing({
    title: { en: "", ar: "فيلا فاخرة", esp: "", fr: "" },
  }),
});
export const ListLocalizedTitleFallback = localizedFallbackPair.list;
export const GridLocalizedTitleFallback = localizedFallbackPair.grid;

export const InList: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <PropertyListCard
        layoutVariant="list"
        propertyDetails={buildPropertyListing({ id: 301 })}
        canViewOwners
        canViewAgents
        canViewBadges
        {...sharedHandlers}
      />
      <PropertyListCard
        layoutVariant="list"
        propertyDetails={buildPropertyListing({
          id: 302,
          title: localized("Downtown Apartment"),
          price: "JOD 185,000",
          areaName: "Shmeisani",
          badges: ["For Rent"],
          is_exclusive: false,
        })}
        canViewOwners
        canViewAgents
        canViewBadges
        {...sharedHandlers}
      />
    </div>
  ),
  decorators: [listDecorator],
};

export const InGrid: Story = {
  render: () => (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <PropertyListCard
        layoutVariant="grid"
        propertyDetails={buildPropertyListing({ id: 401 })}
        canViewOwners
        canViewAgents
        canViewBadges
        {...sharedHandlers}
      />
      <PropertyListCard
        layoutVariant="grid"
        propertyDetails={buildPropertyListing({
          id: 402,
          title: localized("Garden Villa"),
          price: "JOD 620,000",
          areaName: "Khalda",
          badges: ["Featured"],
          is_exclusive: false,
        })}
        canViewOwners
        canViewAgents
        canViewBadges
        {...sharedHandlers}
      />
      <PropertyListCard
        layoutVariant="grid"
        propertyDetails={buildPropertyListing({
          id: 403,
          title: localized("Property without photos"),
          media: emptyMedia,
          badges: ["New"],
        })}
        canViewAgents
        canViewBadges
        {...sharedHandlers}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-4xl">
        <Story />
      </div>
    ),
  ],
};

export const ListSkeleton: Story = {
  render: () => <ListCardSkeleton canViewOwners canViewAgents />,
  decorators: [listDecorator],
};

export const GridSkeleton: Story = {
  render: () => <GridCardSkeleton canViewOwners canViewAgents />,
  decorators: [gridDecorator],
};
