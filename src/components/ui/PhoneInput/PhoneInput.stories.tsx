import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { PhoneInput } from "./index";
import { PHONE_INPUT_VARIANTS } from "./types";

const meta = {
  title: "UI/PhoneInput",
  component: PhoneInput,
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
  },
  argTypes: {
    variant: {
      control: "select",
      options: PHONE_INPUT_VARIANTS,
    },
  },
} satisfies Meta<typeof PhoneInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Phone number",
    placeholder: "Enter phone number",
    isRequired: true,
  },
};

export const WithValue: Story = {
  args: {
    label: "Phone number",
    defaultCountryCode: "JO",
    defaultNationalNumber: "791234567",
  },
};

export const WithHint: Story = {
  args: {
    label: "Mobile",
    hint: "Include your local number without the country code.",
    defaultCountryCode: "AE",
  },
};

export const WithError: Story = {
  args: {
    label: "Phone number",
    error: "Please enter a valid phone number.",
    defaultNationalNumber: "12",
  },
};

export const Ghost: Story = {
  args: {
    label: "Phone number",
    variant: "ghost",
    defaultCountryCode: "SA",
  },
};

export const WithoutPhoneIcon: Story = {
  args: {
    label: "Phone number",
    showPhoneIcon: false,
    defaultCountryCode: "GB",
  },
};

export const Disabled: Story = {
  args: {
    label: "Phone number",
    defaultCountryCode: "US",
    defaultNationalNumber: "5551234567",
    disabled: true,
  },
};

function InteractiveDemo() {
  const [countryCode, setCountryCode] = useState("JO");
  const [nationalNumber, setNationalNumber] = useState("");

  return (
    <PhoneInput
      label="Phone number"
      countryCode={countryCode}
      nationalNumber={nationalNumber}
      onCountryChange={(country) => setCountryCode(country.iso2)}
      onNationalNumberChange={setNationalNumber}
      hint={
        nationalNumber
          ? `Selected: +${countryCode} ${nationalNumber}`
          : "Pick a country and enter your number."
      }
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {PHONE_INPUT_VARIANTS.map((variant) => (
        <PhoneInput
          key={variant}
          variant={variant}
          label={variant}
          placeholder={`${variant} phone input`}
          defaultCountryCode="JO"
        />
      ))}
    </div>
  ),
};
