import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LocationLightBox } from "./index";

const sampleMapEmbedUrl = "https://maps.google.com/maps?q=31.9522,35.8847&z=15&output=embed";
const sampleMapsOpenUrl = "https://www.google.com/maps/search/?api=1&query=31.9522,35.8847";

function LocationLightBoxDemo({
  mapEmbedUrl = sampleMapEmbedUrl,
  mapsOpenUrl = sampleMapsOpenUrl,
  locationLabel = "Abdoun, Amman",
}: {
  mapEmbedUrl?: string | null;
  mapsOpenUrl?: string | null;
  locationLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex rounded-md bg-secondary px-4 py-2 text-sm font-medium text-page"
      >
        Open Location Map
      </button>

      <LocationLightBox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mapEmbedUrl={mapEmbedUrl}
        mapsOpenUrl={mapsOpenUrl}
        locationLabel={locationLabel}
      />
    </>
  );
}

const meta = {
  title: "UI/LocationLightBox",
  component: LocationLightBox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LocationLightBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <LocationLightBoxDemo />,
};

export const WithoutMap: Story = {
  render: () => <LocationLightBoxDemo mapEmbedUrl={null} mapsOpenUrl={null} />,
};
