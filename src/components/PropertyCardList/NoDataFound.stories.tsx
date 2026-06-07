import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../ui/Button";
import { NoDataFound } from "./NoDataFound";

const meta = {
  title: "Components/PropertyCardList/NoDataFound",
  component: NoDataFound,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-5xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NoDataFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithActions: Story = {
  args: {
    title: "No properties found",
    description:
      "We couldn't find any listings matching your criteria. Try changing your filters or expanding your search area.",
    actions: (
      <>
        <Button
          type="button"
          variant="solid"
          color="primary"
          size="md"
          onClick={fn()}
        >
          Clear filters
        </Button>
        <Button
          type="button"
          variant="outline"
          color="primary"
          size="md"
          onClick={fn()}
        >
          Browse all properties
        </Button>
      </>
    ),
  },
};

export const CustomCopy: Story = {
  args: {
    title: "No results in this area",
    description:
      "Expand your search radius or try a different neighborhood to discover more listings.",
  },
};

export const InListContext: Story = {
  render: () => (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-secondary sm:text-xl">
          Properties
        </h2>
        <span className="text-sm text-muted">0 listings</span>
      </div>
      <NoDataFound
        actions={
          <>
            <Button
              type="button"
              variant="solid"
              color="primary"
              size="md"
              onClick={fn()}
            >
              Clear filters
            </Button>
            <Button
              type="button"
              variant="outline"
              color="primary"
              size="md"
              onClick={fn()}
            >
              Browse all properties
            </Button>
          </>
        }
      />
    </div>
  ),
};

export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <div className="dark mx-auto w-full max-w-5xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    ...WithActions.args,
  },
};
