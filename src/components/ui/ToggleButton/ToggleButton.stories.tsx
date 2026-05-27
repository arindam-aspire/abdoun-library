import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { LayoutGrid, List, Map } from "lucide-react";
import { ToggleButton } from "./index";
import {
  TOGGLE_BUTTON_COLORS,
  TOGGLE_BUTTON_SIZES,
  TOGGLE_BUTTON_VARIANTS,
} from "./types";

const viewItems = [
  { value: "grid", label: "Grid", iconStart: <LayoutGrid /> },
  { value: "list", label: "List", iconStart: <List /> },
  { value: "map", label: "Map", iconStart: <Map /> },
] as const;

const meta = {
  title: "UI/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    items: viewItems,
    defaultValue: "grid",
    onChange: fn(),
    "aria-label": "View mode",
  },
  argTypes: {
    color: {
      control: "select",
      options: TOGGLE_BUTTON_COLORS,
    },
    variant: {
      control: "select",
      options: TOGGLE_BUTTON_VARIANTS,
    },
    size: {
      control: "select",
      options: TOGGLE_BUTTON_SIZES,
    },
    items: { control: false },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {TOGGLE_BUTTON_COLORS.map((color) => (
        <ToggleButton
          key={color}
          color={color}
          variant="solid"
          items={viewItems}
          defaultValue="grid"
          aria-label={`${color} toggle`}
        />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {TOGGLE_BUTTON_VARIANTS.map((variant) => (
        <ToggleButton
          key={variant}
          color="primary"
          variant={variant}
          items={viewItems}
          defaultValue="list"
          aria-label={`${variant} toggle`}
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {TOGGLE_BUTTON_SIZES.map((size) => (
        <ToggleButton
          key={size}
          size={size}
          color="primary"
          items={viewItems}
          defaultValue="grid"
          aria-label={`${size} toggle`}
        />
      ))}
    </div>
  ),
};

export const TwoItems: Story = {
  args: {
    items: [
      { value: "buy", label: "Buy" },
      { value: "rent", label: "Rent" },
    ],
    defaultValue: "buy",
    "aria-label": "Listing type",
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
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
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { value: "grid", label: "Grid", iconStart: <LayoutGrid /> },
      { value: "list", label: "List", iconStart: <List /> },
      { value: "map", label: "Map", iconStart: <Map />, disabled: true },
    ],
    defaultValue: "grid",
  },
};
