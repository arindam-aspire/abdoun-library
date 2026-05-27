import { fn } from "storybook/test";
import { useMemo, useState } from "react";
import { PropertyList } from "./index";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
];

const propertyTemplates = [
  {
    price: "JOD 450,000",
    location: "Abdoun, Amman",
    area: 3200,
    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    images: sampleImages,
    brokerName: "Abdoun Real Estate",
    isFavourite: false,
    isExclusive: true,
    badges: ["For Sale", "Verified"],
  },
  {
    price: "JOD 185,000",
    location: "Shmeisani, Amman",
    area: 1200,
    propertyType: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    images: sampleImages,
    brokerName: "City Homes",
    isFavourite: true,
    badges: ["For Rent"],
  },
  {
    price: "JOD 1,200,000",
    location: "Khalda, Amman",
    area: 5200,
    propertyType: "Penthouse",
    bedrooms: 5,
    bathrooms: 4,
    images: sampleImages,
    highlights: "Luxury finish · Smart home",
    brokerName: "Elite Properties",
    badges: ["Featured"],
  },
];

const allProperties = Array.from(
  { length: 18 },
  (_, index) => {
    const template = propertyTemplates[index % propertyTemplates.length];
    return {
      ...template,
      propertyId: 201 + index,
      title: `Property ${index + 1}`,
    };
  },
);

function PropertyListDemo({
  initialView = "grid",
  initialPage = 1,
  initialPageSize = 4,
}) {
  const [layoutVariant, setLayoutVariant] =
    useState(initialView);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allProperties.slice(start, start + pageSize);
  }, [page, pageSize]);

  return (
    <PropertyList
      data={paginatedData}
      layoutVariant={layoutVariant}
      isAuthenticated
      toolbar={{
        title: "Properties in Amman",
        layoutVariant,
        onViewChange: setLayoutVariant,
      }}
      pagination={{
        totalResults: allProperties.length,
        page,
        pageSize,
        pageSizeOptions: [4, 8, 12],
        onPageChange: setPage,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setPage(1);
        },
      }}
      onEmail={fn()}
      onCall={fn()}
      onWhatsApp={fn()}
      onFavourite={fn()}
      onDetailsClick={fn()}
    />
  );
}

const meta = {
  title: "Components/PropertyList/PropertyList",
  component: PropertyList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-5xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Grid = {
  render: () => <PropertyListDemo />,
};

export const List = {
  render: () => <PropertyListDemo initialView="list" />,
};

export const SecondPage = {
  render: () => <PropertyListDemo initialPage={2} />,
};

const loadingPagination = {
  totalResults: 0,
  page: 1,
  pageSize: 4,
  pageSizeOptions: [4, 8, 12],
  onPageChange: fn(),
  onPageSizeChange: fn(),
};

export const LoadingGrid = {
  render: () => (
    <PropertyList
      isLoading
      data={[]}
      layoutVariant="grid"
      toolbar={{
        title: "Properties in Amman",
        layoutVariant: "grid",
      }}
      pagination={loadingPagination}
    />
  ),
};

export const LoadingList = {
  render: () => (
    <PropertyList
      isLoading
      data={[]}
      layoutVariant="list"
      toolbar={{
        title: "Properties in Amman",
        layoutVariant: "list",
      }}
      pagination={loadingPagination}
    />
  ),
};

export const Empty = {
  render: () => (
    <PropertyList
      data={[]}
      layoutVariant="grid"
      toolbar={{
        title: "Properties in Amman",
        layoutVariant: "grid",
      }}
      pagination={loadingPagination}
    />
  ),
};
