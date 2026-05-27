import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ChevronRight, Plus } from "lucide-react";
import { Button } from "./index";
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from "./types";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
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
    iconStart: { control: false },
    iconEnd: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrimarySolid: Story = {
  args: {
    color: "primary",
    variant: "solid",
    children: "Primary",
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {BUTTON_COLORS.map((color) => (
        <Button key={color} color={color} variant="solid">
          {color}
        </Button>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} color="primary" variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      {BUTTON_SIZES.map((size) => (
        <Button key={size} color="primary" size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    children: "Add property",
    iconStart: <Plus />,
    iconEnd: <ChevronRight />,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    loadingLabel: "Saving…",
    children: "Save",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full width button",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const Rounded: Story = {
  args: {
    isRounded: true,
    children: "Rounded",
    iconStart: <Plus />,
  },
};
