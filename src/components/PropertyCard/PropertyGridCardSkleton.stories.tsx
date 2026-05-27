import type { Meta, StoryObj } from "@storybook/react-vite";
import { PropertyGridCardSkleton } from "./PropertyGridCardSkleton";

const meta = {
  title: "Components/PropertyCard/PropertyGridCardSkleton",
  component: PropertyGridCardSkleton,
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
} satisfies Meta<typeof PropertyGridCardSkleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InGrid: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <PropertyGridCardSkleton />
      <PropertyGridCardSkleton />
      <PropertyGridCardSkleton />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
