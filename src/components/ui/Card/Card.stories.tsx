import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./index";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-80 p-6",
    children: (
      <>
        <h3 className="text-lg font-semibold">Card title</h3>
        <p className="text-muted mt-2 text-sm">
          Card content with themed background and soft shadow (no border).
        </p>
      </>
    ),
  },
};

export const WithCustomWidth: Story = {
  args: {
    className: "w-96 p-4",
    children: <p className="text-sm">A wider card container.</p>,
  },
};
