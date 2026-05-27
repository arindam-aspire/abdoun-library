import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import type { ComponentProps } from "react";
import { PropertyGridCard } from "./PropertyGridCard";
import type { PropertyCardDetails } from "./types";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
];

const sampleProperty: PropertyCardDetails = {
  propertyId: 201,
  title: "Modern Villa with Garden",
  price: "JOD 450,000",
  location: "Abdoun, Amman",
  area: 3200,
  propertyType: "Villa",
  images: sampleImages,
  brokerName: "Abdoun Real Estate",
  isFavourite: false,
  isExclusive: true,
  badges: ["For Sale", "Verified"],
  owners: [
    { owner_id: 1, full_name: "Ahmad Al-Khatib", phone: "+962 79 000 0000" },
  ],
};

function CardDemo({
  property = sampleProperty,
  ...rest
}: Partial<ComponentProps<typeof PropertyGridCard>> & {
  property?: PropertyCardDetails;
}) {
  const [isFavourite, setIsFavourite] = useState(property.isFavourite ?? false);

  return (
    <PropertyGridCard
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
  title: "Components/PropertyCard/PropertyGridCard",
  component: PropertyGridCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm">
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
} satisfies Meta<typeof PropertyGridCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CardDemo />,
};

export const WithOwners: Story = {
  render: () => <CardDemo showOwners />,
};

export const WithoutAuth: Story = {
  render: () => <CardDemo isAuthenticated={false} />,
};

export const WithHighlights: Story = {
  render: () => (
    <CardDemo
      property={{
        ...sampleProperty,
        highlights: "Pool · Garden · 4 bed · 3 bath",
        area: undefined,
        propertyType: undefined,
      }}
    />
  ),
};

export const InGrid: Story = {
  render: () => (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CardDemo property={{ ...sampleProperty, propertyId: 201 }} />
      <CardDemo
        property={{
          ...sampleProperty,
          propertyId: 202,
          price: "JOD 280,000",
          location: "Dabouq, Amman",
          propertyType: "Apartment",
          area: 1800,
          badges: ["For Rent"],
          isExclusive: false,
        }}
      />
      <CardDemo
        property={{
          ...sampleProperty,
          propertyId: 203,
          price: "JOD 1,200,000",
          location: "Khalda, Amman",
          propertyType: "Villa",
          area: 5200,
          highlights: "Luxury finish · Smart home",
        }}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl">
        <Story />
      </div>
    ),
  ],
};
