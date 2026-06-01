import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { ListToolbar } from "./ListToolbar";
import type { CardLayoutVariant } from "./types";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const meta = {
  title: "Components/PropertyCardList/ListToolbar",
  component: ListToolbar,
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Properties",
    totalCount: 24,
    listingsLabel: "listings",
    sortOptions,
    sortValue: "newest",
    onSortChange: fn(),
    onViewChange: fn(),
  },
} satisfies Meta<typeof ListToolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

function ListToolbarDemo() {
  const [layoutVariant, setLayoutVariant] =
    useState<CardLayoutVariant>("grid");
  const [sortValue, setSortValue] = useState("newest");

  return (
    <ListToolbar
      title="Properties"
      totalCount={24}
      listingsLabel="listings"
      layoutVariant={layoutVariant}
      sortOptions={sortOptions}
      sortValue={sortValue}
      onSortChange={setSortValue}
      onViewChange={setLayoutVariant}
    />
  );
}

export const Default: Story = {
  render: () => <ListToolbarDemo />,
};

export const Loading: Story = {
  args: {
    isLoading: true,
    layoutVariant: "grid",
  },
};

export const WithoutSort: Story = {
  render: () => (
    <ListToolbar
      title="Properties"
      totalCount={12}
      layoutVariant="list"
      sortOptions={undefined}
      onViewChange={fn()}
    />
  ),
};

/** Sort + icon-only toggle share one row from the `sm` breakpoint. */
export const TabletSm: Story = {
  render: () => <ListToolbarDemo />,
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};
