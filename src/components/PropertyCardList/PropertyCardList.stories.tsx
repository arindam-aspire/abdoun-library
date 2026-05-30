import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { PropertyCardList } from "./index";
import type {
  CardLayoutVariant,
  NoDataFoundProps,
  PropertyCardListProps,
  PropertyListing,
} from "./types";

const sampleEmptyNoDataFound: NoDataFoundProps = {
  title: "No properties found",
  description:
    "We couldn't find any listings matching your criteria. Try changing your filters or expanding your search area.",
  actions: (
    <>
      <Button
        type="button"
        variant="solid"
        color="secondary"
        size="md"
        onClick={fn()}
      >
        Clear filters
      </Button>
      <Button
        type="button"
        variant="outline"
        color="secondary"
        size="md"
        onClick={fn()}
      >
        Browse all properties
      </Button>
    </>
  ),
};

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
    highlights: "Garden . Parking",
    badges: ["For Sale", "Verified"],
    handover: null,
    paymentPlan: null,
    validatedDate: "2026-01-15",
    brokerName: "Abdoun Real Estate",
    brokerLogo: null,
    agency: {
      agency_id: 1,
      agency_name: "Abdoun Real Estate",
    },
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
        owner_id: `${id}-1`,
        full_name: "Ahmad Al-Khatib",
        email: "ahmad.khatib@example.com",
        phone: "+962790000000",
        nationality: "Jordanian",
        ssi: null,
        address: "Amman",
        documents: [],
        is_active: true,
      },
    ],
    is_exclusive: true,
    is_favourite: false,
    ...overrides,
  };
}

const sampleTemplates: PropertyListing[] = [
  buildProperty(301, "Modern Villa with Garden", "JOD 450,000"),
  buildProperty(302, "Luxury Apartment in Abdoun", "JOD 320,000", {
    propertyType: "Apartment",
    area: "1850",
    beds: 3,
    baths: 2,
    highlights: "City view · Balcony",
    badges: ["For Sale"],
    is_exclusive: false,
  }),
  buildProperty(303, "Family Home with Terrace", "JOD 280,000", {
    areaName: "Khalda",
    propertyType: "Townhouse",
    area: "2400",
    highlights: "Terrace · Near schools",
  }),
  buildProperty(304, "Penthouse with Panoramic Views", "JOD 620,000", {
    propertyType: "Penthouse",
    area: "4100",
    beds: 5,
    baths: 4,
    badges: ["Featured", "Verified"],
    is_favourite: true,
  }),
  buildProperty(305, "Cozy Studio in Shmeisani", "JOD 125,000", {
    areaName: "Shmeisani",
    propertyType: "Studio",
    area: "680",
    beds: 1,
    baths: 1,
    highlights: "Furnished · Walkable",
    badges: ["For Rent"],
    is_exclusive: false,
  }),
  buildProperty(306, "Garden Villa in Dabouq", "JOD 510,000", {
    areaName: "Dabouq",
    propertyType: "Villa",
    area: "3600",
    highlights: "Private garden · Garage",
  }),
  buildProperty(307, "Duplex near Abdali Boulevard", "JOD 395,000", {
    areaName: "Abdali",
    propertyType: "Duplex",
    area: "2100",
    beds: 4,
    baths: 3,
    highlights: "Central location",
  }),
  buildProperty(308, "Spacious Apartment in Sweifieh", "JOD 265,000", {
    areaName: "Sweifieh",
    propertyType: "Apartment",
    area: "1650",
    beds: 3,
    baths: 2,
    is_exclusive: false,
  }),
  buildProperty(309, "New Build Villa in Airport Road", "JOD 480,000", {
    areaName: "Airport Road",
    propertyType: "Villa",
    area: "3400",
    badges: ["New", "Verified"],
  }),
  buildProperty(310, "Renovated Home in Jubeiha", "JOD 210,000", {
    areaName: "Jubeiha",
    propertyType: "House",
    area: "1900",
    beds: 3,
    baths: 2,
    highlights: "Recently renovated",
    is_exclusive: false,
  }),
];

function resolveTitle(title: PropertyListing["title"]): string {
  return title.en || title.ar || title.esp || title.fr || "Property";
}

function createCatalog(total: number): PropertyListing[] {
  return Array.from({ length: total }, (_, index) => {
    const template = sampleTemplates[index % sampleTemplates.length]!;
    const id = 400 + index;
    const title = resolveTitle(template.title);

    return buildProperty(id, title, template.price, {
      propertyType: template.propertyType,
      areaName: template.areaName,
      city: template.city,
      area: template.area,
      beds: template.beds,
      baths: template.baths,
      highlights: template.highlights,
      badges: template.badges,
      is_exclusive: template.is_exclusive,
      is_favourite: template.is_favourite,
    });
  });
}

function parsePrice(price: string): number {
  const match = price.match(/[\d,]+/);
  if (!match) return 0;
  return Number(match[0].replace(/,/g, ""));
}

function sortListings(
  listings: PropertyListing[],
  sortValue: string,
): PropertyListing[] {
  const sorted = [...listings];

  if (sortValue === "oldest") {
    sorted.sort((a, b) => a.id - b.id);
    return sorted;
  }

  if (sortValue === "price-asc") {
    sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    return sorted;
  }

  if (sortValue === "price-desc") {
    sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return sorted;
  }

  sorted.sort((a, b) => b.id - a.id);
  return sorted;
}

const sharedHandlers: Pick<
  PropertyCardListProps,
  | "onClick"
  | "onClickEmail"
  | "onClickCall"
  | "onClickWhatsApp"
  | "onClickFavourite"
> = {
  onClick: fn(),
  onClickEmail: fn(),
  onClickCall: fn(),
  onClickWhatsApp: fn(),
  onClickFavourite: fn(),
};

type InteractivePropertyCardListProps = {
  initialLayout?: CardLayoutVariant;
  catalogSize?: number;
  paginationTotal?: number;
  initialPage?: number;
  initialPageSize?: number;
  maxPageButtons?: number;
  showPagination?: boolean;
  forceLoading?: boolean;
  simulateFetch?: boolean;
};

function InteractivePropertyCardList({
  initialLayout = "grid",
  catalogSize = 48,
  paginationTotal,
  initialPage = 1,
  initialPageSize = 10,
  maxPageButtons = 5,
  showPagination = true,
  forceLoading = false,
  simulateFetch = true,
}: InteractivePropertyCardListProps) {
  const catalog = useMemo(() => createCatalog(catalogSize), [catalogSize]);
  const [listings] = useState(catalog);
  const [layoutVariant, setLayoutVariant] =
    useState<CardLayoutVariant>(initialLayout);
  const [sortValue, setSortValue] = useState("newest");
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(forceLoading);
  const [favourites, setFavourites] = useState<Record<number, boolean>>({});

  const total = paginationTotal ?? listings.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const sortedListings = useMemo(
    () => sortListings(listings, sortValue),
    [listings, sortValue],
  );

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedListings.slice(start, start + pageSize).map((item) => ({
      ...item,
      is_favourite: favourites[item.id] ?? item.is_favourite,
    }));
  }, [favourites, pageSize, safePage, sortedListings]);

  const runWithLoading = useCallback(
    (action: () => void) => {
      if (forceLoading || !simulateFetch) {
        action();
        return;
      }

      setIsLoading(true);
      window.setTimeout(() => {
        action();
        setIsLoading(false);
      }, 400);
    },
    [forceLoading, simulateFetch],
  );

  return (
    <PropertyCardList
      isLoading={isLoading}
      data={{
        items: pageItems,
        meta: {
          total,
          page: safePage,
          pageSize,
          totalPages,
          hasNext: safePage < totalPages,
          hasPrevious: safePage > 1,
        },
      }}
      toolbar={{
        layoutVariant,
        title: "Properties",
        totalCount: total,
        listingsLabel: "listings",
        sortOptions: [
          { label: "Newest", value: "newest" },
          { label: "Oldest", value: "oldest" },
          { label: "Price: Low to High", value: "price-asc" },
          { label: "Price: High to Low", value: "price-desc" },
        ],
        sortValue,
        defaultSortValue: "newest",
        onSortChange: (value) => {
          runWithLoading(() => {
            setSortValue(value);
            setPage(1);
          });
        },
        onViewChange: (view) => setLayoutVariant(view),
      }}
      pagination={
        showPagination
          ? {
              pagination: {
                total,
                page: safePage,
                pageSize,
                totalPages,
                hasNext: safePage < totalPages,
                hasPrevious: safePage > 1,
              },
              pageOptions: [10, 15, 20],
              maxPageButtons,
              onPageChange: (nextPage) => {
                runWithLoading(() => setPage(nextPage));
              },
              onPageSizeChange: (nextPageSize) => {
                runWithLoading(() => {
                  setPageSize(nextPageSize);
                  setPage(1);
                });
              },
            }
          : undefined
      }
      canViewOwners
      canViewAgents
      canViewBadges
      onClick={sharedHandlers.onClick}
      onClickEmail={sharedHandlers.onClickEmail}
      onClickCall={sharedHandlers.onClickCall}
      onClickWhatsApp={sharedHandlers.onClickWhatsApp}
      onClickFavourite={(property) => {
        setFavourites((current) => ({
          ...current,
          [property.id]: !(current[property.id] ?? property.is_favourite),
        }));
        sharedHandlers.onClickFavourite?.(property);
      }}
    />
  );
}

const meta = {
  title: "Components/PropertyCardList/PropertyCardList",
  component: PropertyCardList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    isLoading: false,
    data: { items: [] },
    toolbar: { layoutVariant: "grid" },
    canViewOwners: true,
    canViewAgents: true,
    canViewBadges: true,
  },
} satisfies Meta<typeof PropertyCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <InteractivePropertyCardList />,
};

export const List: Story = {
  render: () => <InteractivePropertyCardList initialLayout="list" />,
};

export const Loading: Story = {
  render: () => (
    <InteractivePropertyCardList forceLoading simulateFetch={false} />
  ),
};

export const LoadingList: Story = {
  render: () => (
    <InteractivePropertyCardList
      initialLayout="list"
      forceLoading
      simulateFetch={false}
    />
  ),
};

export const WithoutPagination: Story = {
  render: () => <InteractivePropertyCardList showPagination={false} />,
};

export const Empty: Story = {
  args: {
    isLoading: false,
    data: { items: [] },
    toolbar: {
      layoutVariant: "grid",
      title: "Properties",
      totalCount: 0,
    },
    noDataFound: sampleEmptyNoDataFound,
    canViewOwners: true,
    canViewAgents: true,
    canViewBadges: true,
  },
};

export const EmptyList: Story = {
  args: {
    ...Empty.args,
    toolbar: {
      layoutVariant: "list",
      title: "Properties",
      totalCount: 0,
    },
  },
};

export const EmptyImages: Story = {
  args: {
    isLoading: false,
    data: {
      items: [
        buildProperty(99, "Property without photos", "JOD 250,000", {
          media: {
            thumbnail: null,
            images: [],
            videos: [],
            virtual_tour_url: null,
            floor_plan_images: [],
            documents: [],
          },
        }),
      ],
    },
    toolbar: {
      layoutVariant: "grid",
      title: "Properties",
      totalCount: 1,
    },
    canViewOwners: true,
    canViewAgents: true,
    canViewBadges: true,
    onClick: fn(),
    onClickEmail: fn(),
    onClickCall: fn(),
    onClickWhatsApp: fn(),
    onClickFavourite: fn(),
  },
};

export const EmptyImagesList: Story = {
  args: {
    ...EmptyImages.args,
    toolbar: {
      layoutVariant: "list",
      title: "Properties",
      totalCount: 1,
    },
  },
};

export const PaginationWithEllipsis: Story = {
  render: () => (
    <InteractivePropertyCardList
      paginationTotal={1470}
      initialPage={4}
      maxPageButtons={2}
    />
  ),
};
