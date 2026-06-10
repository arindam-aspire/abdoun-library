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
import { HorizontalStepper } from "./index";

const propertyFormSteps = [
  { value: "setup", label: "Setup" },
  { value: "location", label: "Location" },
  { value: "details", label: "Details" },
  { value: "owners", label: "Owners" },
  { value: "pricing", label: "Pricing" },
  { value: "amenities", label: "Amenities" },
  { value: "media", label: "Media" },
  { value: "finalize", label: "Finalize" },
];

const meta = {
  title: "UI/HorizontalStepper",
  component: HorizontalStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-5xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    steps: propertyFormSteps,
    activeStep: 1,
    onStepClick: fn(),
    "aria-label": "Property form progress",
  },
} satisfies Meta<typeof HorizontalStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

const propertyFormStepsWithIcons = [
  { value: "setup", label: "Setup", icon: <FileText /> },
  { value: "location", label: "Location", icon: <MapPin /> },
  { value: "details", label: "Details", icon: <Sparkles /> },
  { value: "owners", label: "Owners", icon: <User /> },
  { value: "pricing", label: "Pricing", icon: <Wallet /> },
  { value: "amenities", label: "Amenities", icon: <Sparkles /> },
  { value: "media", label: "Media", icon: <Image /> },
  { value: "finalize", label: "Finalize", icon: <ClipboardCheck /> },
];

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    steps: propertyFormStepsWithIcons,
    activeStep: 1,
  },
};

export const MixedIconsAndCounters: Story = {
  args: {
    steps: [
      { value: "setup", label: "Setup", icon: <FileText /> },
      { value: "location", label: "Location" },
      { value: "details", label: "Details", icon: <Sparkles /> },
      { value: "owners", label: "Owners" },
      { value: "pricing", label: "Pricing", icon: <Wallet /> },
      { value: "amenities", label: "Amenities" },
      { value: "media", label: "Media", icon: <Image /> },
      { value: "finalize", label: "Finalize" },
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

/** User reached the end, then navigated back — later steps stay completed. */
export const NavigatedBack: Story = {
  args: {
    activeStep: 2,
    maxReachedStep: propertyFormSteps.length - 1,
  },
};

export const FewSteps: Story = {
  args: {
    steps: [
      { value: "setup", label: "Setup" },
      { value: "location", label: "Location" },
      { value: "finalize", label: "Finalize" },
    ],
    activeStep: 1,
  },
};

function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <HorizontalStepper
        steps={propertyFormSteps}
        activeStep={activeStep}
        maxReachedStep={maxReachedStep}
        onStepClick={(index) => {
          setActiveStep(index);
          setMaxReachedStep((previous) => Math.max(previous, index));
        }}
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

export const MobileIconsOnly: Story = {
  name: "Mobile (labels hidden)",
  args: {
    steps: propertyFormStepsWithIcons,
    activeStep: 2,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm bg-page p-4">
        <Story />
      </div>
    ),
  ],
};
