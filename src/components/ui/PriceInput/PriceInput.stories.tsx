import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { PriceInput } from "./index";
import {
  PRICE_INPUT_CURRENCY_POSITIONS,
  PRICE_INPUT_SIZES,
  PRICE_INPUT_VARIANTS,
} from "./types";

const meta = {
  title: "UI/PriceInput",
  component: PriceInput,
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
    onChange: fn(),
    size: "md",
  },
  argTypes: {
    variant: {
      control: "select",
      options: PRICE_INPUT_VARIANTS,
    },
    size: {
      control: "select",
      options: PRICE_INPUT_SIZES,
    },
    currencyPosition: {
      control: "select",
      options: PRICE_INPUT_CURRENCY_POSITIONS,
    },
  },
} satisfies Meta<typeof PriceInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Price",
    placeholder: "0.00",
    isRequired: true,
  },
};

export const WithValue: Story = {
  args: {
    label: "Listing price",
    defaultValue: "250000",
    currency: "JOD",
  },
};

export const WithDecimals: Story = {
  args: {
    label: "Service charge",
    defaultValue: "1250.75",
    hint: "Enter amount with up to 2 decimal places.",
  },
};

export const CurrencyEnd: Story = {
  args: {
    label: "Price",
    defaultValue: "185000",
    currency: "USD",
    currencyPosition: "end",
  },
};

export const Ghost: Story = {
  args: {
    label: "Maintenance fee",
    variant: "ghost",
    defaultValue: "500",
  },
};

export const WithError: Story = {
  args: {
    label: "Price",
    error: "Price is required.",
    defaultValue: "",
  },
};

export const Disabled: Story = {
  args: {
    label: "Price",
    defaultValue: "320000",
    disabled: true,
  },
};

export const WithoutCurrency: Story = {
  args: {
    label: "Amount",
    showCurrency: false,
    defaultValue: "15000",
  },
};

function InteractiveDemo() {
  const [value, setValue] = useState("");

  return (
    <PriceInput
      label="Property price"
      value={value}
      onChange={setValue}
      hint={value ? `Stored value: ${value}` : "Enter a listing price."}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {PRICE_INPUT_VARIANTS.map((variant) => (
        <PriceInput
          key={variant}
          variant={variant}
          label={variant}
          defaultValue="125000"
          onChange={fn()}
        />
      ))}
    </div>
  ),
};
