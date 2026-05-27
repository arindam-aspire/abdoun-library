import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search } from "lucide-react";
import { Input } from "./index";
import { INPUT_SIZES, INPUT_VARIANTS } from "./types";

const meta = {
  title: "UI/Input",
  component: Input,
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
  argTypes: {
    variant: {
      control: "select",
      options: INPUT_VARIANTS,
    },
    size: {
      control: "select",
      options: INPUT_SIZES,
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    isRequired: true,
  },
};

export const WithHint: Story = {
  args: {
    label: "Username",
    placeholder: "johndoe",
    hint: "Choose a unique username.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    defaultValue: "invalid-email",
    error: "Enter a valid email address.",
  },
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    placeholder: "Search properties…",
    iconStart: <Search />,
    iconEnd: <Mail />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {INPUT_VARIANTS.map((variant) => (
        <Input
          key={variant}
          variant={variant}
          label={variant}
          placeholder={`${variant} input`}
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {INPUT_SIZES.map((size) => (
        <Input key={size} size={size} label={size} placeholder={`${size} size`} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    placeholder: "Cannot edit",
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "Search…",
    "aria-label": "Search",
    iconStart: <Search />,
  },
};
