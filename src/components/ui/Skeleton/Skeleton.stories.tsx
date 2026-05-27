import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./index";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "circular", "text"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-12 w-48",
    variant: "default",
  },
};

export const Circular: Story = {
  args: {
    className: "h-12 w-12",
    variant: "circular",
  },
};

export const Text: Story = {
  args: {
    className: "h-4 w-64",
    variant: "text",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-12 w-48" variant="default" />
      <Skeleton className="h-12 w-12" variant="circular" />
      <Skeleton className="h-4 w-64" variant="text" />
    </div>
  ),
};
