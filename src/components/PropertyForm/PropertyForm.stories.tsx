import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { PropertyForm, propertyFormSteps } from "./index";
import {
  propertyFormCategoryTaxonomy,
  propertyFormFeaturesAndAmenities,
  propertyFormFilledValues,
  propertyFormLocationTaxonomy,
} from "./propertyFormStoryData";
import type { PropertyFormValues } from "./types";

const lastStepIndex = propertyFormSteps.length - 1;
const onDraftAction = fn();

const emptyPropertyDetails: PropertyFormValues = {};

const meta = {
  title: "Components/PropertyForm",
  component: PropertyForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full bg-page">
        <Story />
      </div>
    ),
  ],
  args: {
    categoryTaxonomy: propertyFormCategoryTaxonomy,
    locationTaxonomy: propertyFormLocationTaxonomy,
    featuresAndAmenities: propertyFormFeaturesAndAmenities,
    propertyDetails: emptyPropertyDetails,
    activeStep: 0,
    onSubmit: fn(),
    onPrevious: fn(),
    onNext: fn(),
    onDraft: fn(),
    onStepClick: fn(),
  },
} satisfies Meta<typeof PropertyForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeStep: 1,
  },
};

function FunctionalDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = propertyFormSteps[activeStep];

  return (
    <div className="flex min-h-screen flex-col">
      <PropertyForm
        categoryTaxonomy={propertyFormCategoryTaxonomy}
        locationTaxonomy={propertyFormLocationTaxonomy}
        featuresAndAmenities={propertyFormFeaturesAndAmenities}
        propertyDetails={emptyPropertyDetails}
        activeStep={activeStep}
        onPrevious={() => setActiveStep((step) => Math.max(0, step - 1))}
        onNext={() =>
          setActiveStep((step) => Math.min(lastStepIndex, step + 1))
        }
        onDraft={onDraftAction}
        onStepClick={(index) => setActiveStep(index)}
      />
      <p className="border-t border-secondary/10 bg-card-background px-4 py-3 text-center text-sm text-muted sm:px-6">
        Active step:{" "}
        <span className="font-medium text-text">
          {currentStep?.verticalLabel ?? currentStep?.label ?? "—"}
        </span>
        {" · "}
        Use Previous / Next, click completed steps, or Save as Draft (Actions
        panel). Basic info, location, and property details steps must be valid
        before advancing. Owner step requires name and phone for each owner.
      </p>
    </div>
  );
}

/** Full wizard: steppers, Previous/Next, completed-step navigation, and draft action. */
export const Functional: Story = {
  render: () => <FunctionalDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "End-to-end property form flow with working step navigation, basic info validation, and draft action.",
      },
    },
  },
};

function InteractiveDemo() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <PropertyForm
      categoryTaxonomy={propertyFormCategoryTaxonomy}
      locationTaxonomy={propertyFormLocationTaxonomy}
      featuresAndAmenities={propertyFormFeaturesAndAmenities}
      propertyDetails={emptyPropertyDetails}
      activeStep={activeStep}
      onPrevious={() => setActiveStep((step) => Math.max(0, step - 1))}
      onNext={() =>
        setActiveStep((step) => Math.min(lastStepIndex, step + 1))
      }
      onDraft={onDraftAction}
      onStepClick={(index) => setActiveStep(index)}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

const uploadHandler = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return URL.createObjectURL(file);
};

function FilledFormDemo() {
  const [activeStep, setActiveStep] = useState(lastStepIndex);
  const currentStep = propertyFormSteps[activeStep];

  return (
    <div className="flex min-h-screen flex-col">
      <PropertyForm
        categoryTaxonomy={propertyFormCategoryTaxonomy}
        locationTaxonomy={propertyFormLocationTaxonomy}
        featuresAndAmenities={propertyFormFeaturesAndAmenities}
        propertyDetails={propertyFormFilledValues}
        activeStep={activeStep}
        onPrevious={() => setActiveStep((step) => Math.max(0, step - 1))}
        onNext={() =>
          setActiveStep((step) => Math.min(lastStepIndex, step + 1))
        }
        onDraft={onDraftAction}
        onStepClick={(index) => setActiveStep(index)}
        onUploadOwnerDocument={uploadHandler}
        onUploadPropertyMedia={uploadHandler}
        onUploadPropertyDocument={uploadHandler}
      />
      <p className="border-t border-secondary/10 bg-card-background px-4 py-3 text-center text-sm text-muted sm:px-6">
        Active step:{" "}
        <span className="font-medium text-text">
          {currentStep?.verticalLabel ?? currentStep?.label ?? "—"}
        </span>
        {" · "}
        All steps are prefilled. Use Previous / Next or click any step to review
        entered values.
      </p>
    </div>
  );
}

/** Full wizard with sample data across every step, opened on Review & Submit. */
export const Filled: Story = {
  render: () => <FilledFormDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "End-to-end property form with realistic sample data in every step. Starts on Review & Submit; navigate to any step to inspect or edit values.",
      },
    },
  },
};
