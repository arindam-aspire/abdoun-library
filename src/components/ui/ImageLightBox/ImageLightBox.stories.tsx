import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ImageLightBox } from "./index";

const sampleImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop",
];

function ImageLightBoxDemo({
  images = sampleImages,
  ariaLabel,
}: {
  images?: string[];
  ariaLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="grid max-w-md grid-cols-2 gap-3">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setIsOpen(true);
            }}
            className="overflow-hidden rounded-lg border border-secondary/15 bg-surface transition-opacity hover:opacity-90"
          >
            <img
              src={src}
              alt={`Property thumbnail ${index + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />
          </button>
        ))}
      </div>

      <ImageLightBox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={images}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        alt="Property photo"
        ariaLabel={ariaLabel}
      />
    </>
  );
}

const meta = {
  title: "UI/ImageLightBox",
  component: ImageLightBox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ImageLightBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ImageLightBoxDemo />,
};

export const SingleImage: Story = {
  render: () => (
    <ImageLightBoxDemo images={[sampleImages[0]!]} ariaLabel="Property image viewer" />
  ),
};

export const PropertyViewer: Story = {
  render: () => (
    <ImageLightBoxDemo ariaLabel="Property image viewer" />
  ),
};
