import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { MultiSelectDropdown } from "./index";
import {
  MULTI_SELECT_DROPDOWN_SIZES,
  MULTI_SELECT_DROPDOWN_VARIANTS,
  type MultiSelectDropdownOption,
} from "./types";

const areaOptions: MultiSelectDropdownOption[] = [
  { value: "1", label: "Abdoun" },
  { value: "2", label: "Sweifieh" },
  { value: "3", label: "Khalda" },
  { value: "4", label: "Jabal Amman" },
];

const meta = {
  title: "UI/MultiSelectDropdown",
  component: MultiSelectDropdown,
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
    options: areaOptions,
    placeholder: "Select areas",
    onChange: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: MULTI_SELECT_DROPDOWN_VARIANTS,
    },
    size: {
      control: "select",
      options: MULTI_SELECT_DROPDOWN_SIZES,
    },
    options: { control: false },
  },
} satisfies Meta<typeof MultiSelectDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Area",
    isRequired: true,
  },
};

export const WithSelection: Story = {
  args: {
    label: "Area",
    defaultValue: ["1", "2"],
  },
};

export const WithHint: Story = {
  args: {
    label: "Area",
    defaultValue: ["3"],
    hint: "Choose one or more areas.",
  },
};

export const WithError: Story = {
  args: {
    label: "Area",
    error: "Please select at least one area.",
  },
};

export const Empty: Story = {
  args: {
    label: "Area",
    options: [],
    emptyMessage: "No areas available for this city.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Area",
    defaultValue: ["1"],
    disabled: true,
  },
};

function InteractiveDemo() {
  const [value, setValue] = useState<string[]>(["2"]);

  return (
    <MultiSelectDropdown
      label="Area"
      placeholder="Select areas"
      options={areaOptions}
      value={value}
      onChange={setValue}
      isRequired
      hint={`${value.length} area${value.length === 1 ? "" : "s"} selected`}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {MULTI_SELECT_DROPDOWN_VARIANTS.map((variant) => (
        <MultiSelectDropdown
          key={variant}
          variant={variant}
          label={variant}
          placeholder={`${variant} multi-select`}
          options={areaOptions}
          defaultValue={["1"]}
        />
      ))}
    </div>
  ),
};
