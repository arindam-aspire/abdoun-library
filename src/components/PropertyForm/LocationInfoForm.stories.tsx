import type { Meta, StoryObj } from "@storybook/react-vite";
import { useLocationInsertForm } from "../../hooks/useLocationFormHook";
import { LocationInfoForm } from "./LocationInfoForm";
import { propertyFormLocationTaxonomy } from "./propertyFormStoryData";

const meta = {
  title: "Components/PropertyForm/LocationInfoForm",
  component: LocationInfoForm,
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
} satisfies Meta<typeof LocationInfoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function LocationInfoFormDemo() {
  const form = useLocationInsertForm();

  return (
    <LocationInfoForm
      locationTaxonomy={propertyFormLocationTaxonomy.data}
      form={form}
    />
  );
}

export const Default: Story = {
  render: () => <LocationInfoFormDemo />,
};

function LocationInfoFormWithErrorsDemo() {
  const form = useLocationInsertForm();

  return (
    <div className="flex flex-col gap-4">
      <LocationInfoForm
        locationTaxonomy={propertyFormLocationTaxonomy.data}
        form={form}
      />
      <button
        type="button"
        className="self-start rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text transition-colors hover:bg-page"
        onClick={() => {
          form.setTouched({
            city_id: true,
            area_ids: true,
          });
          form.setErrors({
            city_id: "Please select city.",
            area_ids: "Please select at least one area.",
          });
        }}
      >
        Show validation errors
      </button>
    </div>
  );
}

export const WithErrors: Story = {
  render: () => <LocationInfoFormWithErrorsDemo />,
};
