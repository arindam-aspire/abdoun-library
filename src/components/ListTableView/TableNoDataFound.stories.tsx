import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../ui/Button";
import { TableNoDataFound } from "./TableNoDataFound";

const meta = {
  title: "Components/ListTableView/TableNoDataFound",
  component: TableNoDataFound,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-secondary/15 bg-surface">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableNoDataFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button type="button" color="secondary" size="md" onClick={fn()}>
          Clear filters
        </Button>
        <Button type="button" variant="outline" color="secondary" size="md" onClick={fn()}>
          Browse all
        </Button>
      </>
    ),
  },
};
