import type { Meta, StoryObj } from "@storybook/react-vite";
import { useBasicInfoForm } from "../../hooks/useBasicInfoFormHook";
import { BasicInfoForm } from "./BasicInfoForm";
import { propertyFormCategoryTaxonomy } from "./propertyFormStoryData";

const meta = {
  title: "Components/PropertyForm/BasicInfoForm",
  component: BasicInfoForm,
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
} satisfies Meta<typeof BasicInfoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function BasicInfoFormDemo() {
  const form = useBasicInfoForm();

  return (
    <BasicInfoForm
      categoryTaxonomy={propertyFormCategoryTaxonomy}
      form={form}
    />
  );
}

export const Default: Story = {
  render: () => <BasicInfoFormDemo />,
};

function BasicInfoFormWithErrorsDemo() {
  const form = useBasicInfoForm();

  return (
    <div className="flex flex-col gap-4">
      <BasicInfoForm
        categoryTaxonomy={propertyFormCategoryTaxonomy}
        form={form}
      />
      <button
        type="button"
        className="self-start rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text transition-colors hover:bg-page"
        onClick={() => {
          form.setTouched({
            title: true,
            listing_purpose: true,
            category_id: true,
            type_id: true,
          });
          form.setErrors({
            title: "Please enter property title.",
            listing_purpose: "Please select listing purpose.",
            category_id: "Please select category.",
            type_id: "Please select property type.",
          });
        }}
      >
        Show validation errors
      </button>
    </div>
  );
}

export const WithErrors: Story = {
  render: () => <BasicInfoFormWithErrorsDemo />,
};
