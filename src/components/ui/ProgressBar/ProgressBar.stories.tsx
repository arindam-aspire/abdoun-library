import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./index";
import { PROGRESS_BAR_SIZES } from "./types";

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md bg-surface p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    value: 50,
    currentStep: 4,
    totalSteps: 8,
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: PROGRESS_BAR_SIZES,
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    tone: "primary",
  },
};

export const Secondary: Story = {
  args: {
    tone: "secondary",
    value: 18,
    currentStep: 2,
    totalSteps: 8,
  },
};

export const PercentageOnly: Story = {
  args: {
    showStepCount: false,
  },
};

export const StepCountOnly: Story = {
  args: {
    showPercentage: false,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    currentStep: 8,
    totalSteps: 8,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-6">
      {PROGRESS_BAR_SIZES.map((size) => (
        <ProgressBar
          key={size}
          size={size}
          value={62}
          currentStep={5}
          totalSteps={8}
        />
      ))}
    </div>
  ),
};
