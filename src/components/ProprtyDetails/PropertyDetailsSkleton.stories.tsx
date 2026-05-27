import type { Meta, StoryObj } from "@storybook/react-vite";
import { PropertyDetailsSkleton } from "./PropertyDetailsSkleton";

const meta = {
  title: "Components/PropertyDetails/PropertyDetailsSkleton",
  component: PropertyDetailsSkleton,
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
} satisfies Meta<typeof PropertyDetailsSkleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
