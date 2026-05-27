import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Heart, Plus, Settings, Trash2 } from "lucide-react";
import { IconButton } from "./index";
import { BUTTON_COLORS, BUTTON_SIZES, BUTTON_VARIANTS } from "../Button/types";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    icon: <Plus />,
    "aria-label": "Add",
    onClick: fn(),
  },
  argTypes: {
    color: {
      control: "select",
      options: BUTTON_COLORS,
    },
    variant: {
      control: "select",
      options: BUTTON_VARIANTS,
    },
    size: {
      control: "select",
      options: BUTTON_SIZES,
    },
    icon: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {BUTTON_SIZES.map((size) => (
        <IconButton
          key={size}
          size={size}
          icon={<Plus />}
          aria-label={`Add (${size})`}
        />
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {BUTTON_COLORS.map((color) => (
        <IconButton
          key={color}
          color={color}
          variant="solid"
          icon={<Heart />}
          aria-label={color}
        />
      ))}
    </div>
  ),
};

export const OutlineDanger: Story = {
  args: {
    color: "danger",
    variant: "outline",
    icon: <Trash2 />,
    "aria-label": "Delete",
  },
};

export const Rounded: Story = {
  args: {
    isRounded: true,
    icon: <Settings />,
    "aria-label": "Settings",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    icon: <Plus />,
    "aria-label": "Adding",
  },
};
