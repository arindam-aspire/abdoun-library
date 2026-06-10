import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ClipboardCheck,
  FileText,
  Image,
  MapPin,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { UI_CONTROL_SIZES } from "../commonTypes";
import { VerticalStepper } from "./index";

const propertyFormSteps = [
  { value: "basic", label: "Basic Information" },
  { value: "location", label: "Location" },
  { value: "property", label: "Property Details" },
  { value: "owner", label: "Owner Information" },
  { value: "pricing", label: "Pricing" },
  { value: "features", label: "Features & Amenities" },
  { value: "media", label: "Media & Documents" },
  { value: "review", label: "Review & Submit" },
];

const meta = {
  title: "UI/VerticalStepper",
  component: VerticalStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm bg-page p-4 sm:max-w-md sm:p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    steps: propertyFormSteps,
    activeStep: 1,
    onStepClick: fn(),
    size: "md",
    "aria-label": "Property form progress",
  },
  argTypes: {
    size: {
      control: "select",
      options: UI_CONTROL_SIZES,
    },
  },
} satisfies Meta<typeof VerticalStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

const propertyFormStepsWithIcons = [
  { value: "basic", label: "Basic Information", icon: <FileText /> },
  { value: "location", label: "Location", icon: <MapPin /> },
  { value: "property", label: "Property Details", icon: <Sparkles /> },
  { value: "owner", label: "Owner Information", icon: <User /> },
  { value: "pricing", label: "Pricing", icon: <Wallet /> },
  { value: "features", label: "Features & Amenities", icon: <Sparkles /> },
  { value: "media", label: "Media & Documents", icon: <Image /> },
  { value: "review", label: "Review & Submit", icon: <ClipboardCheck /> },
];

export const Default: Story = {};

export const SizeSmall: Story = {
  args: {
    size: "sm",
  },
};

export const WithIcons: Story = {
  args: {
    steps: propertyFormStepsWithIcons,
    activeStep: 1,
  },
};

export const MixedIconsAndCounters: Story = {
  args: {
    steps: [
      { value: "basic", label: "Basic Information", icon: <FileText /> },
      { value: "location", label: "Location" },
      { value: "property", label: "Property Details", icon: <Sparkles /> },
      { value: "owner", label: "Owner Information" },
      { value: "pricing", label: "Pricing", icon: <Wallet /> },
      { value: "features", label: "Features & Amenities" },
      { value: "media", label: "Media & Documents", icon: <Image /> },
      { value: "review", label: "Review & Submit" },
    ],
    activeStep: 2,
  },
};

export const FirstStep: Story = {
  args: {
    activeStep: 0,
  },
};

export const MidProgress: Story = {
  args: {
    activeStep: 4,
  },
};

export const LastStep: Story = {
  args: {
    activeStep: propertyFormSteps.length - 1,
  },
};

function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <VerticalStepper
        steps={propertyFormSteps}
        activeStep={activeStep}
        onStepClick={(index) => setActiveStep(index)}
        aria-label="Property form progress"
      />
      <p className="text-sm text-muted">
        Completed steps are clickable. Active step:{" "}
        <span className="font-medium text-text">
          {propertyFormSteps[activeStep]?.label}
        </span>
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  args: {
    onStepClick: undefined,
  },
};

export const WithoutStepNavigation: Story = {
  args: {
    onStepClick: undefined,
    activeStep: 2,
  },
};
