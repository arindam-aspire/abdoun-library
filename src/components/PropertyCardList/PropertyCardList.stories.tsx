import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { createListingStatus } from "./listingStatus";
import { PropertyCardList } from "./index";
import type {
  CardLayoutVariant,
  NoDataFoundContent,
  PropertyCardListProps,
  PropertyListing,
} from "./types";

const sampleEmptyNoDataFound: NoDataFoundContent = {
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

const sampleListings: PropertyListing[] = [
  buildProperty(301, "Modern Villa with Garden", "JOD 450,000"),
  buildProperty(302, "Luxury Apartment in Abdoun", "JOD 320,000", {
    propertyType: "Apartment",
    area: "1850",
    beds: 3,
    baths: 2,
    is_exclusive: false,
  }),
  buildProperty(303, "Family Home with Terrace", "JOD 280,000", {
    areaName: "Khalda",
    propertyType: "Townhouse",
  }),
  buildProperty(304, "Penthouse with Panoramic Views", "JOD 620,000", {
    propertyType: "Penthouse",
    is_favourite: true,
  }),
  buildProperty(305, "Cozy Studio in Shmeisani", "JOD 125,000", {
    areaName: "Shmeisani",
    propertyType: "Studio",
    beds: 1,
    baths: 1,
    badges: ["For Rent"],
    is_exclusive: false,
  }),
  buildProperty(306, "Garden Villa in Dabouq", "JOD 510,000", {
    areaName: "Dabouq",
  }),
];

const defaultSortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const;

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

const sharedVisibility = {
  canViewOwners: true,
  canViewAgents: true,
  canViewBadges: true,
} as const;

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

function createCatalog(total: number): PropertyListing[] {
  return Array.from({ length: total }, (_, index) => {
    const template = sampleListings[index % sampleListings.length]!;
    const id = 400 + index;
    const title =
      template.title.en ||
      template.title.ar ||
      template.title.esp ||
      template.title.fr ||
      "Property";

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

const LARGE_PAGINATION = {
  total: 1469,
  totalPages: 147,
  pageSize: 10,
  page: 1,
} as const;

type FunctionalStoryConfig = {
  totalCount?: number;
  initialPage?: number;
  initialPageSize?: number;
  maxPageButtons?: number;
};

function FunctionalPropertyCardList({
  totalCount = 48,
  initialPage = 1,
  initialPageSize = 10,
  maxPageButtons = 5,
}: FunctionalStoryConfig = {}) {
  const catalog = useMemo(() => createCatalog(totalCount), [totalCount]);
  const [layoutVariant, setLayoutVariant] = useState<CardLayoutVariant>("grid");
  const [sortValue, setSortValue] = useState("newest");
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [favourites, setFavourites] = useState<Record<number, boolean>>({});

  const total = totalCount;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const sortedListings = useMemo(
    () => sortListings(catalog, sortValue),
    [catalog, sortValue],
  );

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedListings.slice(start, start + pageSize).map((item) => ({
      ...item,
      is_favourite: favourites[item.id] ?? item.is_favourite,
    }));
  }, [favourites, pageSize, safePage, sortedListings]);

  const runWithLoading = useCallback((action: () => void) => {
    setIsLoading(true);
    window.setTimeout(() => {
      action();
      setIsLoading(false);
    }, 400);
  }, []);

  return (
    <PropertyCardList
      isLoading={isLoading}
      layoutVariant={layoutVariant}
      listTitle="Properties"
      data={pageItems}
      toolbar={{
        listingsLabel: "listings",
        sortOptions: [...defaultSortOptions],
        sortValue,
        onSortChange: (value) => {
          runWithLoading(() => {
            setSortValue(value);
            setPage(1);
          });
        },
        onViewChange: setLayoutVariant,
      }}
      pagination={{
        total,
        page: safePage,
        pageSize,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrevious: safePage > 1,
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
      }}
      noDataFound={sampleEmptyNoDataFound}
      {...sharedVisibility}
      {...sharedHandlers}
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
} satisfies Meta<typeof PropertyCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sort, layout toggle, pagination, and favourites with simulated loading. */
export const Functional: Story = {
  render: () => <FunctionalPropertyCardList />,
};

/** 1,469 listings · page 1 of 147 · page size 10 — pagination ellipsis + loading. */
export const FunctionalLargePagination: Story = {
  name: "Functional (147 pages)",
  render: () => (
    <FunctionalPropertyCardList
      totalCount={LARGE_PAGINATION.total}
      initialPage={LARGE_PAGINATION.page}
      initialPageSize={LARGE_PAGINATION.pageSize}
      maxPageButtons={2}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: `Interactive list with ${LARGE_PAGINATION.total} results, ${LARGE_PAGINATION.totalPages} pages at ${LARGE_PAGINATION.pageSize} per page (starts on page ${LARGE_PAGINATION.page}).`,
      },
    },
  },
};

/** Full list skeleton (toolbar, cards, pagination). */
export const Loading: Story = {
  args: {
    isLoading: true,
    layoutVariant: "grid",
    listTitle: "Properties",
    data: [],
    toolbar: {
      listingsLabel: "listings",
      sortOptions: [...defaultSortOptions],
      sortValue: "newest",
    },
    pagination: {
      total: 48,
      page: 1,
      pageSize: 10,
      pageOptions: [10, 15, 20],
    },
    ...sharedVisibility,
  },
};

/** Static grid with sample listings. */
export const WithData: Story = {
  args: {
    isLoading: false,
    layoutVariant: "grid",
    listTitle: "Properties",
    data: sampleListings,
    toolbar: {
      listingsLabel: "listings",
      sortOptions: [...defaultSortOptions],
      sortValue: "newest",
    },
    pagination: {
      total: sampleListings.length,
      page: 1,
      pageSize: 10,
      pageOptions: [10, 15, 20],
    },
    ...sharedVisibility,
    ...sharedHandlers,
  },
};

/** Cards only — no toolbar or pagination. */
export const CardsOnly: Story = {
  args: {
    isLoading: false,
    layoutVariant: "grid",
    data: sampleListings.slice(0, 4),
    ...sharedVisibility,
    ...sharedHandlers,
  },
};

/** Larger toolbar, cards, and pagination from `sm` up; mobile unchanged. */
export const ButtonSizeLarge: Story = {
  args: {
    isLoading: false,
    layoutVariant: "grid",
    listTitle: "Properties",
    buttonSize: "lg",
    data: sampleListings,
    toolbar: {
      listingsLabel: "listings",
      sortOptions: [...defaultSortOptions],
      sortValue: "newest",
    },
    pagination: {
      total: sampleListings.length,
      page: 1,
      pageSize: 10,
      pageOptions: [10, 15, 20],
    },
    ...sharedVisibility,
    ...sharedHandlers,
  },
};

/** Compact toolbar, cards, and pagination from `sm` up; mobile unchanged. */
export const ButtonSizeSmall: Story = {
  args: {
    isLoading: false,
    layoutVariant: "list",
    listTitle: "Properties",
    buttonSize: "sm",
    data: sampleListings.slice(0, 4),
    toolbar: {
      listingsLabel: "listings",
      sortOptions: [...defaultSortOptions],
      sortValue: "newest",
    },
    pagination: {
      total: sampleListings.length,
      page: 1,
      pageSize: 10,
      pageOptions: [10, 15, 20],
    },
    ...sharedVisibility,
    ...sharedHandlers,
  },
};

/** Delete control on every card; set `is_delete_loading` on a listing for per-item spinners. */
export const WithDelete: Story = {
  args: {
    isLoading: false,
    layoutVariant: "grid",
    listTitle: "My listings",
    canViewDelete: true,
    data: sampleListings.map((item, index) =>
      index === 1 ? { ...item, is_delete_loading: true } : item,
    ),
    toolbar: {
      listingsLabel: "listings",
      sortOptions: [...defaultSortOptions],
      sortValue: "newest",
    },
    pagination: {
      total: sampleListings.length,
      page: 1,
      pageSize: 10,
    },
    onClickDelete: fn(),
    ...sharedVisibility,
    ...sharedHandlers,
  },
};

/** Empty results with no-data UI. */
export const NoData: Story = {
  args: {
    isLoading: false,
    layoutVariant: "grid",
    listTitle: "Properties",
    data: [],
    toolbar: {
      listingsLabel: "listings",
      sortOptions: [...defaultSortOptions],
      sortValue: "newest",
    },
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
    },
    noDataFound: sampleEmptyNoDataFound,
    ...sharedVisibility,
  },
};
