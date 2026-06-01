import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { HeroCarouselControls } from "./HeroCarouselControls";

const meta = {
  title: "Components/PropertyView/HeroCarouselControls",
  component: HeroCarouselControls,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: {
    onSelect: fn(),
    onPrev: fn(),
    onNext: fn(),
    onPauseToggle: fn(),
  },
} satisfies Meta<typeof HeroCarouselControls>;

export default meta;

type Story = StoryObj<typeof meta>;

function CarouselControlsDemo({
  total,
  initialIndex = 0,
  withPause = true,
}: {
  total: number;
  initialIndex?: number;
  withPause?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full max-w-md p-4">
      <HeroCarouselControls
        total={total}
        activeIndex={activeIndex}
        isPaused={isPaused}
        onSelect={setActiveIndex}
        onPrev={() => setActiveIndex((index) => (index - 1 + total) % total)}
        onNext={() => setActiveIndex((index) => (index + 1) % total)}
        onPauseToggle={
          withPause ? () => setIsPaused((paused) => !paused) : undefined
        }
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <CarouselControlsDemo total={5} />,
};

export const LargeGallery: Story = {
  render: () => (
    <div className="w-full max-w-xl p-4">
      <CarouselControlsDemo total={69} initialIndex={11} />
    </div>
  ),
};

export const SingleImage: Story = {
  args: {
    total: 1,
    activeIndex: 0,
    onPauseToggle: undefined,
  },
};

export const WithoutPause: Story = {
  render: () => <CarouselControlsDemo total={5} withPause={false} />,
};
