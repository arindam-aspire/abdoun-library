import { fn } from "storybook/test";
import { useState } from "react";
import { PropertyListCard } from "./PropertyListCard";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
];

const sampleProperty = {
  propertyId: 301,
  title: "Modern Villa with Garden",
  price: "JOD 450,000",
  location: "Abdoun, Amman",
  bedrooms: 4,
  bathrooms: 3,
  area: 3200,
  images: sampleImages,
  brokerName: "Abdoun Real Estate",
  isFavourite: false,
  isExclusive: true,
  badges: ["For Sale"],
  owners: [
    { owner_id: 1, full_name: "Ahmad Al-Khatib", phone: "+962 79 000 0000" },
  ],
};

function CardDemo({
  property = sampleProperty,
  ...rest
}) {
  const [isFavourite, setIsFavourite] = useState(property.isFavourite ?? false);

  return (
    <PropertyListCard
      propertyDetails={{ ...property, isFavourite }}
      isAuthenticated
      onFavourite={() => setIsFavourite((prev) => !prev)}
      onEmail={fn()}
      onCall={fn()}
      onWhatsApp={fn()}
      onDetailsClick={fn()}
      {...rest}
    />
  );
}

const meta = {
  title: "Components/PropertyCard/PropertyListCard",
  component: PropertyListCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
  args: {
    propertyDetails: sampleProperty,
    isAuthenticated: true,
    onEmail: fn(),
    onCall: fn(),
    onWhatsApp: fn(),
    onFavourite: fn(),
    onDetailsClick: fn(),
  },
};

export default meta;

export const Default = {
  render: () => <CardDemo />,
};

export const WithBadges = {
  render: () => <CardDemo showBadges />,
};

export const WithOwners = {
  render: () => <CardDemo showOwners />,
};

export const WithoutAuth = {
  render: () => <CardDemo isAuthenticated={false} />,
};

export const HighlightsFallback = {
  render: () => (
    <CardDemo
      property={{
        ...sampleProperty,
        bedrooms: undefined,
        bathrooms: undefined,
        area: undefined,
        highlights: "Pool · Garden · Smart home · Sea view",
      }}
    />
  ),
};

export const InList = {
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <CardDemo property={{ ...sampleProperty, propertyId: 301 }} />
      <CardDemo
        property={{
          ...sampleProperty,
          propertyId: 302,
          title: "Downtown Apartment",
          price: "JOD 185,000",
          location: "Shmeisani, Amman",
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          badges: ["For Rent"],
          isExclusive: false,
        }}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
};
