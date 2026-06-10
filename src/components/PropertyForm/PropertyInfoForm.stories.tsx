import type { Meta, StoryObj } from "@storybook/react-vite";
import { usePropertyDetailsForm } from "../../hooks/usePropertyDetailsFormHook";
import { PropertyInfoForm } from "./PropertyInfoForm";

const meta = {
  title: "Components/PropertyForm/PropertyInfoForm",
  component: PropertyInfoForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PropertyInfoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function PropertyInfoFormDemo() {
  const form = usePropertyDetailsForm();

  return <PropertyInfoForm form={form} />;
}

export const Default: Story = {
  render: () => <PropertyInfoFormDemo />,
};

function PropertyInfoFormWithErrorsDemo() {
  const form = usePropertyDetailsForm();

  return (
    <div className="flex flex-col gap-4">
      <PropertyInfoForm form={form} />
      <button
        type="button"
        className="self-start rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text transition-colors hover:bg-page"
        onClick={() => {
          form.setTouched({
            bedrooms: true,
            bathrooms: true,
            built_up_area: true,
            parking_spaces: true,
            property_age: true,
            completion_status: true,
            total_floor: true,
            occupancy: true,
            ownership_type: true,
            reference_number: true,
            permit_dld_number: true,
            orientation: true,
          });
          form.setErrors({
            bedrooms: "Bedrooms is required.",
            bathrooms: "Bathrooms is required.",
            built_up_area: "Built-up area is required.",
            parking_spaces: "Parking spaces is required.",
            property_age: "Property age is required.",
            completion_status: "Completion status is required.",
            total_floor: "Total floor is required.",
            occupancy: "Occupancy is required.",
            ownership_type: "Ownership type is required.",
            reference_number: "Reference number is required.",
            permit_dld_number: "Permit / DLD number is required.",
            orientation: "Orientation is required.",
          });
        }}
      >
        Show validation errors
      </button>
    </div>
  );
}

export const WithErrors: Story = {
  render: () => <PropertyInfoFormWithErrorsDemo />,
};

function PropertyInfoFormPrefilledDemo() {
  const form = usePropertyDetailsForm({
    bedrooms: 3,
    bathrooms: 2,
    built_up_area: "2500",
    parking_spaces: 0,
    property_age: "1-5",
    completion_status: "ready",
    total_floor: "12",
    occupancy: "vacant",
    ownership_type: "freehold",
    reference_number: "REF-10245",
    permit_dld_number: "192837465",
    orientation: "north",
  });

  return <PropertyInfoForm form={form} />;
}

export const Prefilled: Story = {
  render: () => <PropertyInfoFormPrefilledDemo />,
};
