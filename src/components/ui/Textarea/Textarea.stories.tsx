import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./index";
import { TEXTAREA_SIZES, TEXTAREA_VARIANTS } from "./types";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
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
      options: TEXTAREA_VARIANTS,
    },
    size: {
      control: "select",
      options: TEXTAREA_SIZES,
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Describe the property…",
    isRequired: true,
    rows: 4,
  },
};

export const WithHint: Story = {
  args: {
    label: "Notes",
    placeholder: "Add any additional details…",
    hint: "Visible to agents only.",
    defaultValue: "Corner unit with park views.",
  },
};

export const WithError: Story = {
  args: {
    label: "Description",
    placeholder: "Describe the property…",
    error: "Description must be at least 20 characters.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {TEXTAREA_VARIANTS.map((variant) => (
        <Textarea
          key={variant}
          variant={variant}
          label={variant}
          placeholder={`${variant} textarea`}
          rows={3}
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {TEXTAREA_SIZES.map((size) => (
        <Textarea
          key={size}
          size={size}
          label={size}
          placeholder={`${size} size`}
          rows={3}
        />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Description",
    placeholder: "Cannot edit",
    defaultValue: "Pre-filled description.",
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "Write a message…",
    "aria-label": "Message",
    rows: 4,
  },
};
