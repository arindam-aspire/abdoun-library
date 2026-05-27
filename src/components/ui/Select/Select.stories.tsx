import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Select } from "./index";
import { SELECT_SIZES, SELECT_VARIANTS } from "./types";
import type { SelectOption } from "./types";

const propertyTypeOptions: SelectOption[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land", disabled: true },
];

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    options: propertyTypeOptions,
    onChange: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: SELECT_VARIANTS,
    },
    size: {
      control: "select",
      options: SELECT_SIZES,
    },
    options: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Property type",
    placeholder: "Select a type",
    defaultValue: "apartment",
    isRequired: true,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Property type",
    placeholder: "Select a type",
  },
};

export const WithHint: Story = {
  args: {
    label: "Property type",
    placeholder: "Select a type",
    defaultValue: "villa",
    hint: "Choose the listing category.",
  },
};

export const WithError: Story = {
  args: {
    label: "Property type",
    placeholder: "Select a type",
    error: "Please select a property type.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {SELECT_VARIANTS.map((variant) => (
        <Select
          key={variant}
          variant={variant}
          label={variant}
          placeholder={`${variant} select`}
          options={propertyTypeOptions}
          defaultValue="apartment"
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {SELECT_SIZES.map((size) => (
        <Select
          key={size}
          size={size}
          label={size}
          placeholder={`${size} size`}
          options={propertyTypeOptions}
          defaultValue="townhouse"
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Property type",
    placeholder: "Select a type",
    defaultValue: "apartment",
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "Select a type",
    "aria-label": "Property type",
    defaultValue: "villa",
  },
};
