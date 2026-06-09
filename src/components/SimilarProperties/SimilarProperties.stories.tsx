import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SimilarProperties } from "./index";
import { similarPropertiesStoryListings } from "./similarPropertiesStoryData";

const meta = {
  title: "Components/SimilarProperties",
  component: SimilarProperties,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    data: similarPropertiesStoryListings,
    onViewMore: fn(),
    onClick: fn(),
    onClickEmail: fn(),
    onClickCall: fn(),
    onClickWhatsApp: fn(),
    onClickFavourite: fn(),
    buttonSize: "md",
  },
  argTypes: {
    buttonSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof SimilarProperties>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Larger card actions and carousel controls from `sm` up. */
export const ButtonSizeLarge: Story = {
  args: {
    buttonSize: "lg",
  },
};

/** Compact card actions and carousel controls from `sm` up. */
export const ButtonSizeSmall: Story = {
  args: {
    buttonSize: "sm",
  },
};

export const WithoutViewMore: Story = {
  args: {
    onViewMore: undefined,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: [],
    skeletonCount: 4,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    onViewMore: undefined,
  },
};

export const EmptyCustomCopy: Story = {
  args: {
    data: [],
    onViewMore: undefined,
    noSimilarProperties: {
      title: "No similar property",
      description: "Check back later or browse all listings.",
    },
  },
};

export const FewItems: Story = {
  args: {
    data: similarPropertiesStoryListings.slice(0, 2),
  },
};

export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};

/** View More is a text link in the title row below `md`. */
export const SmallTabletViewport: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};
