import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListFilter } from "lucide-react";
import { fn } from "storybook/test";
import { cn } from "../../../lib/cn";
import { selectLeadingIconPositionClasses } from "../responsiveSizes";
import { SelectDropdown } from "./index";
import {
  SELECT_DROPDOWN_SIZES,
  SELECT_DROPDOWN_VARIANTS,
  type SelectDropdownOption,
} from "./types";

const cityOptions: SelectDropdownOption[] = [
  { value: "amman", label: "Amman" },
  { value: "irbid", label: "Irbid" },
  { value: "aqaba", label: "Aqaba" },
  { value: "zarqa", label: "Zarqa", disabled: true },
];

const meta = {
  title: "UI/SelectDropdown",
  component: SelectDropdown,
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
    options: cityOptions,
    placeholder: "Select a city",
    onChange: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: SELECT_DROPDOWN_VARIANTS,
    },
    size: {
      control: "select",
      options: SELECT_DROPDOWN_SIZES,
    },
    options: { control: false },
  },
} satisfies Meta<typeof SelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "City",
    isRequired: true,
  },
};

export const WithSelection: Story = {
  args: {
    label: "City",
    defaultValue: "amman",
  },
};

export const WithHint: Story = {
  args: {
    label: "City",
    defaultValue: "irbid",
    hint: "Filter listings by city.",
  },
};

export const WithError: Story = {
  args: {
    label: "City",
    error: "Please select a city.",
  },
};

export const Rtl: Story = {
  args: {
    label: "المدينة",
    placeholder: "اختر مدينة",
    defaultValue: "amman",
    isRtl: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {SELECT_DROPDOWN_VARIANTS.map((variant) => (
        <SelectDropdown
          key={variant}
          variant={variant}
          label={variant}
          placeholder={`${variant} dropdown`}
          options={cityOptions}
          defaultValue="amman"
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {SELECT_DROPDOWN_SIZES.map((size) => (
        <SelectDropdown
          key={size}
          size={size}
          label={size}
          placeholder={`${size} size`}
          options={cityOptions}
          defaultValue="aqaba"
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "City",
    defaultValue: "amman",
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "Select a city",
    "aria-label": "City",
    defaultValue: "irbid",
  },
};

/** Matches sort dropdown in `ListToolbar` — chevron pinned to the trailing edge. */
export const WithLeadingIcon: Story = {
  render: () => (
    <div className="relative w-full min-w-[11rem]">
      <ListFilter
        className={cn(
          "pointer-events-none absolute z-10 text-muted",
          selectLeadingIconPositionClasses.md,
        )}
        aria-hidden
      />
      <SelectDropdown
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
        ]}
        placeholder="Sort by"
        defaultValue="newest"
        hasLeadingIcon
        fullWidth
        triggerClassName="rounded-lg ps-10 sm:ps-11"
        aria-label="Sort"
      />
    </div>
  ),
};
