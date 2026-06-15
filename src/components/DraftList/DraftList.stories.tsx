import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { propertyFormSteps } from "../PropertyForm";
import { DraftList } from "./index";
import type { DraftListItem as DraftListItemData } from "./types";

const totalSteps = propertyFormSteps.length;

const sampleDrafts: DraftListItemData[] = [
  {
    id: 1,
    title: "My Property",
    updatedAtLabel: "Updated Just now",
    propertyType: "Apartment",
    listingPurposeLabel: "For Sale",
    currentStep: 4,
    totalSteps,
  },
  {
    id: 2,
    title: "Villa in Abdoun",
    updatedAtLabel: "Updated 2 hours ago",
    propertyType: "Villa",
    listingPurposeLabel: "For Rent",
    currentStep: 2,
    totalSteps,
  },
  {
    id: 3,
    title: "",
    updatedAtLabel: "Updated yesterday",
    propertyType: "Office Space",
    listingPurposeLabel: "For Sale",
    currentStep: 8,
    totalSteps,
  },
  {
    id: 4,
    title: "Untitled draft",
    updatedAtLabel: "Updated 3 days ago",
    propertyType: "",
    listingPurposeLabel: "For Sale",
    currentStep: 1,
    totalSteps,
  },
];

const meta = {
  title: "Components/DraftList",
  component: DraftList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    items: sampleDrafts,
    onResume: fn(),
    onDelete: fn(),
    onCreateNew: fn(),
    resumeLabel: "Resume",
    size: "md",
  },
} satisfies Meta<typeof DraftList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPagination: Story = {
  args: {
    pagination: {
      total: 47,
      page: 1,
      pageSize: 10,
      totalPages: 5,
      hasNext: true,
      hasPrevious: false,
      pageOptions: [10, 15, 20],
      maxPageButtons: 2,
      onPageChange: fn(),
      onPageSizeChange: fn(),
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    items: [],
    pagination: {
      total: 47,
      page: 1,
      pageSize: 4,
      onPageChange: fn(),
      onPageSizeChange: fn(),
    },
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
