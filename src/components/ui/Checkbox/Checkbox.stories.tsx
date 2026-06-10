import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { Checkbox } from "./index";
import { CHECKBOX_SIZES } from "./types";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onChange: fn(),
    checked: false,
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: CHECKBOX_SIZES,
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Private rooftop plunge pool",
  },
};

export const Checked: Story = {
  args: {
    label: "Smart home climate & lighting",
    checked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Panoramic floor-to-ceiling windows",
    description: "Floor-to-ceiling glazing with city views.",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    disabled: true,
  },
};

function InteractiveDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      label="Toggle me"
      checked={checked}
      onChange={setChecked}
      description={checked ? "Selected" : "Not selected"}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
