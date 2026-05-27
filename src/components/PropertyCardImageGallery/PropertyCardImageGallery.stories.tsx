import { fn } from "storybook/test";
import { useState } from "react";
import { PropertyCardImageGallery } from "./index";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop",
];

const sampleProperty = {
  propertyId: 101,
  title: "Modern Villa with Garden",
  images: sampleImages,
  brokerName: "Abdoun Real Estate",
  isFavourite: false,
  isExclusive: true,
  badges: ["For Sale", "Verified"],
};

function GalleryDemo({
  property = sampleProperty,
  isAuthenticated = true,
  ...rest
}) {
  const [isFavourite, setIsFavourite] = useState(property.isFavourite ?? false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PropertyCardImageGallery
      className="h-full w-full"
      propertyDetails={{ ...property, isFavourite }}
      isAuthenticated={isAuthenticated}
      onFavourite={() => {
        setIsLoading(true);
        window.setTimeout(() => {
          setIsFavourite((prev) => !prev);
          setIsLoading(false);
        }, 600);
      }}
      isFavouriteLoading={isLoading}
      onDetailsClick={fn()}
      {...rest}
    />
  );
}

const meta = {
  title: "Components/PropertyCardImageGallery",
  component: PropertyCardImageGallery,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-secondary/15 bg-surface shadow-sm">
        <div className="relative aspect-[4/3] w-full">
          <Story />
        </div>
      </div>
    ),
  ],
  render: (args) => (
    <PropertyCardImageGallery {...args} className="h-full w-full" />
  ),
  args: {
    propertyDetails: sampleProperty,
    isAuthenticated: true,
    onFavourite: fn(),
    onDetailsClick: fn(),
  },
};

export default meta;
export const Default = {
  render: () => <GalleryDemo />,
};

export const WithoutAuth = {
  render: () => <GalleryDemo isAuthenticated={false} />,
};

export const SingleImage = {
  render: () => (
    <GalleryDemo
      property={{
        ...sampleProperty,
        images: [sampleImages[0]!],
        badges: ["For Rent"],
      }}
    />
  ),
};

export const NoBadges = {
  render: () => (
    <GalleryDemo
      property={{
        ...sampleProperty,
        badges: undefined,
        isExclusive: false,
      }}
      showBadges={false}
    />
  ),
};

export const WithoutLightbox = {
  render: () => <GalleryDemo enableImageLightbox={false} />,
};

export const WithoutAgent = {
  render: () => <GalleryDemo showAgents={false} />,
};

export const FallbackImage = {
  render: () => (
    <GalleryDemo
      property={{
        propertyId: 102,
        title: "Property without photos",
        images: [],
        brokerName: "Listing Agent",
        badges: ["New"],
      }}
    />
  ),
};
