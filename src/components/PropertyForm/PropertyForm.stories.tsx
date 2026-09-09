import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";
import { PropertyForm, propertyFormSteps } from "./index";
import {
  propertyFormCategoryTaxonomy,
  propertyFormFeaturesAndAmenities,
  propertyFormFilledValues,
  propertyFormLocationTaxonomy,
} from "./propertyFormStoryData";
import type { PropertyFormValues } from "./types";

const lastStepNumber = propertyFormSteps.length;
const onDraftAction = fn();

const emptyPropertyDetails: PropertyFormValues = {};

function usePropertyFormNavigation(initialStep = 1) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [maxReachedStep, setMaxReachedStep] = useState(initialStep);
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyFormValues>(emptyPropertyDetails);

  const advanceToStep = (stepNumber: number, details: PropertyFormValues) => {
    setPropertyDetails(details);
    setActiveStep(stepNumber);
    setMaxReachedStep((previous) => Math.max(previous, stepNumber));
  };

  return {
    activeStep,
    maxReachedStep,
    propertyDetails,
    onPrevious: () => setActiveStep((step) => Math.max(1, step - 1)),
    onNext: (details: PropertyFormValues) => {
      advanceToStep(Math.min(lastStepNumber, activeStep + 1), details);
    },
    onDraft: (details: PropertyFormValues) => {
      setPropertyDetails(details);
      onDraftAction(details);
    },
    onStepClick: (
      stepNumber: number,
      _step: (typeof propertyFormSteps)[number],
      details: PropertyFormValues,
    ) => {
      setPropertyDetails(details);
      setActiveStep(stepNumber);
      setMaxReachedStep((previous) => Math.max(previous, stepNumber));
    },
  };
}

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
    activeStep: 1,
    maxReachedStep: 1,
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
    activeStep: 2,
    maxReachedStep: 2,
  },
};

function FunctionalDemo() {
  const navigation = usePropertyFormNavigation(1);
  const currentStep = propertyFormSteps[navigation.activeStep - 1];

  return (
    <div className="flex min-h-screen flex-col">
      <PropertyForm
        categoryTaxonomy={propertyFormCategoryTaxonomy}
        locationTaxonomy={propertyFormLocationTaxonomy}
        featuresAndAmenities={propertyFormFeaturesAndAmenities}
        propertyDetails={navigation.propertyDetails}
        activeStep={navigation.activeStep}
        maxReachedStep={navigation.maxReachedStep}
        onPrevious={navigation.onPrevious}
        onNext={navigation.onNext}
        onDraft={navigation.onDraft}
        onStepClick={navigation.onStepClick}
      />
      <p className="border-t border-secondary/10 bg-card-background px-4 py-3 text-center text-sm text-muted sm:px-6">
        Active step:{" "}
        <span className="font-medium text-text">
          {currentStep?.verticalLabel ?? currentStep?.label ?? "—"}
        </span>
        {" · "}
        Step numbers are 1-based (`activeStep` 1 = first step). `onNext` validates;
        `onDraft` saves the current form state without validation.
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
          "End-to-end property form flow with working step navigation, validation, and parent-owned `propertyDetails` state.",
      },
    },
  },
};

function InteractiveDemo() {
  const navigation = usePropertyFormNavigation(2);

  return (
    <PropertyForm
      categoryTaxonomy={propertyFormCategoryTaxonomy}
      locationTaxonomy={propertyFormLocationTaxonomy}
      featuresAndAmenities={propertyFormFeaturesAndAmenities}
      propertyDetails={navigation.propertyDetails}
      activeStep={navigation.activeStep}
      maxReachedStep={navigation.maxReachedStep}
      onPrevious={navigation.onPrevious}
      onNext={navigation.onNext}
      onDraft={navigation.onDraft}
      onStepClick={navigation.onStepClick}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

/** Decimal built-up area with its independently stored SQFT unit. */
export const BuiltUpAreaWithUnit: Story = {
  args: {
    activeStep: 3,
    maxReachedStep: 3,
    propertyDetails: propertyFormFilledValues,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const builtUpAreaInput = canvas.getByLabelText("Built-up Area");
    const unitSelect = canvas.getByLabelText("Unit");

    expect(builtUpAreaInput).toHaveValue(125.5);
    expect(unitSelect).toHaveTextContent("sq. ft.");

    await userEvent.clear(builtUpAreaInput);
    await userEvent.type(builtUpAreaInput, "200.75");
    await userEvent.click(unitSelect);
    await userEvent.click(
      within(document.body).getByRole("option", { name: "sq. m." }),
    );

    expect(builtUpAreaInput).toHaveValue(200.75);
    expect(unitSelect).toHaveTextContent("sq. m.");
  },
};

const uploadHandler = async (file: File, context?: { ownerIndex: number }) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  void context;
  return URL.createObjectURL(file);
};

function FilledFormDemo() {
  const [activeStep, setActiveStep] = useState(lastStepNumber);
  const [maxReachedStep] = useState(lastStepNumber);
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyFormValues>(propertyFormFilledValues);
  const currentStep = propertyFormSteps[activeStep - 1];

  return (
    <div className="flex min-h-screen flex-col">
      <PropertyForm
        categoryTaxonomy={propertyFormCategoryTaxonomy}
        locationTaxonomy={propertyFormLocationTaxonomy}
        featuresAndAmenities={propertyFormFeaturesAndAmenities}
        propertyDetails={propertyDetails}
        activeStep={activeStep}
        maxReachedStep={maxReachedStep}
        onPrevious={() => setActiveStep((step) => Math.max(1, step - 1))}
        onNext={(details) => {
          fn()(details);
          setPropertyDetails(details);
          setActiveStep((step) => Math.min(lastStepNumber, step + 1));
        }}
        onDraft={(details) => {
          setPropertyDetails(details);
          onDraftAction(details);
        }}
        onStepClick={(stepNumber, _step, details) => {
          setPropertyDetails(details);
          setActiveStep(stepNumber);
        }}
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

/** While saving a draft, all steppers, fields, and actions are disabled. */
export const SavingDraft: Story = {
  args: {
    activeStep: 2,
    maxReachedStep: 2,
    isDraftLoading: true,
  },
};

/** While submitting, all steppers, fields, and actions are disabled. */
export const Submitting: Story = {
  args: {
    activeStep: lastStepNumber,
    maxReachedStep: lastStepNumber,
    propertyDetails: propertyFormFilledValues,
    isSubmitting: true,
  },
};

/** View-only: terms checkbox, Save as Draft, and Submit are disabled. */
export const ReadOnly: Story = {
  args: {
    activeStep: lastStepNumber,
    maxReachedStep: lastStepNumber,
    propertyDetails: propertyFormFilledValues,
    canEdit: false,
    onSubmit: fn(),
    onDraft: onDraftAction,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `canEdit` is `false`, the terms checkbox, Save as Draft, and Submit are disabled. Other steps remain navigable for review.",
      },
    },
  },
};

/** Rejected submission with reason shown above the form. */
export const WithRejectionReason: Story = {
  args: {
    activeStep: 1,
    maxReachedStep: lastStepNumber,
    propertyDetails: propertyFormFilledValues,
    canEdit: false,
    rejectionReason:
      "Property documentation is incomplete. Please upload a valid title deed and resubmit.",
    onSubmit: fn(),
    onDraft: onDraftAction,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `rejectionReason` is provided, an alert appears above the form on every step and the final action button reads **Resubmit**.",
      },
    },
  },
};

export const HostConfiguredAddProperty: Story = {
  args: {
    activeStep: 1,
    maxReachedStep: 5,
    propertyDetails: {
      ...propertyFormFilledValues,
      basic_info: {
        ...propertyFormFilledValues.basic_info!,
        listing_purposes: ["sale", "rent"],
      },
    },
    config: {
      listingPurposeOptions: [
        { value: "sale", label: "Sale" },
        { value: "rent", label: "Rent" },
      ],
      furnishingStatusOptions: [
        { value: "furnished", label: "Furnished" },
        { value: "unfurnished", label: "Unfurnished" },
        { value: "semi_furnished", label: "Semi-Furnished" },
      ],
      completionStatusOptions: [
        { value: "ready", label: "Ready" },
        { value: "secondary", label: "Secondary" },
      ],
      orientationOptions: [
        { value: "northeast", label: "Northeast" },
        { value: "northwest", label: "Northwest" },
      ],
      yearBuiltLabel: "Year of Construction",
      setAsPrimaryImageLabel: "Set as Primary Image",
    },
    onSearchOwners: async () => [
      {
        owner_id: "own-1",
        full_name: "Sara Al-Khatib",
        email: "sara.khatib@example.com",
        phone_number: "791234567",
        country_code: "+962",
      },
    ],
    renderLocationMap: ({ latitude, longitude, onCoordinatesChange }) => (
      <button
        type="button"
        className="flex h-40 w-full items-center justify-center bg-page-ghost text-sm text-muted"
        onClick={() =>
          onCoordinatesChange({
            latitude: 31.95,
            longitude: 35.91,
          })
        }
      >
        Map slot {latitude ?? "—"}, {longitude ?? "—"}
      </button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const purpose = canvas.getByLabelText("Listing purpose");
    expect(purpose).toHaveTextContent("Sale, Rent");
  },
};

export const ExternalFieldErrors: Story = {
  args: {
    activeStep: 5,
    maxReachedStep: 5,
    propertyDetails: propertyFormFilledValues,
    fieldErrors: {
      "pricing.furnished_sale_price": "Furnished sale price is too low.",
    },
    submitError: "The backend rejected this listing. Review the highlighted fields.",
  },
};

export const MobileAddProperty: Story = {
  args: {
    activeStep: 1,
    maxReachedStep: 1,
    propertyDetails: {},
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const DesktopAddProperty: Story = {
  args: {
    activeStep: 1,
    maxReachedStep: 1,
    propertyDetails: {},
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const DetailsWithoutDld: Story = {
  args: {
    activeStep: 3,
    maxReachedStep: 3,
    propertyDetails: propertyFormFilledValues,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByLabelText("Permit / DLD Number")).toBeNull();
    expect(canvas.getByLabelText("Year Built")).toBeInTheDocument();
    expect(canvas.getByLabelText("Floor Level")).toBeInTheDocument();
    expect(canvas.getByLabelText("Total Floor")).toBeInTheDocument();
  },
};
