import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { useAmenitiesForm } from "../../hooks/useAmenitiesFormHook";
import { FeatureAndAminitiesSelectionForm } from "./FeatureAndAminitiesSelectionForm";
import { propertyFormFeaturesAndAmenities } from "./propertyFormStoryData";

const meta = {
  title: "Components/PropertyForm/FeatureAndAminitiesSelectionForm",
  component: FeatureAndAminitiesSelectionForm,
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
} satisfies Meta<typeof FeatureAndAminitiesSelectionForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function FeatureAndAmenitiesFormDemo({
  categoryId = 1,
  propertyTypeId = 1,
}: {
  categoryId?: number | null;
  propertyTypeId?: number | null;
}) {
  const form = useAmenitiesForm();

  return (
    <FeatureAndAminitiesSelectionForm
      form={form}
      featuresAndAmenities={propertyFormFeaturesAndAmenities}
      categoryId={categoryId}
      propertyTypeId={propertyTypeId}
    />
  );
}

export const Default: Story = {
  render: () => <FeatureAndAmenitiesFormDemo />,
};

export const MissingTaxonomy: Story = {
  render: () => (
    <FeatureAndAminitiesFormDemo categoryId={null} propertyTypeId={null} />
  ),
};

function FeatureAndAmenitiesTaxonomySwitcherDemo() {
  const [categoryId, setCategoryId] = useState<number | null>(1);
  const [propertyTypeId, setPropertyTypeId] = useState<number | null>(1);
  const form = useAmenitiesForm();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text"
          onClick={() => {
            setCategoryId(1);
            setPropertyTypeId(1);
          }}
        >
          Residential · Apartment
        </button>
        <button
          type="button"
          className="rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text"
          onClick={() => {
            setCategoryId(1);
            setPropertyTypeId(2);
          }}
        >
          Residential · Villa
        </button>
        <button
          type="button"
          className="rounded-lg border border-secondary/20 px-3 py-1.5 text-sm text-text"
          onClick={() => {
            setCategoryId(null);
            setPropertyTypeId(null);
          }}
        >
          Clear selection
        </button>
      </div>

      <FeatureAndAminitiesSelectionForm
        form={form}
        featuresAndAmenities={propertyFormFeaturesAndAmenities}
        categoryId={categoryId}
        propertyTypeId={propertyTypeId}
      />
    </div>
  );
}

export const FilteredByTaxonomy: Story = {
  render: () => <FeatureAndAmenitiesTaxonomySwitcherDemo />,
};

function FeatureAndAmenitiesFormPrefilledDemo() {
  const form = useAmenitiesForm({
    selected_amenities: [
      "Smart home system",
      "Private rooftop plunge pool",
      "Panoramic floor-to-ceiling windows",
    ],
  });

  return (
    <FeatureAndAminitiesSelectionForm
      form={form}
      featuresAndAmenities={propertyFormFeaturesAndAmenities}
      categoryId={1}
      propertyTypeId={1}
    />
  );
}

export const Prefilled: Story = {
  render: () => <FeatureAndAmenitiesFormPrefilledDemo />,
};

function FeatureAndAmenitiesStaticCatalogDemo() {
  const form = useAmenitiesForm();

  return (
    <FeatureAndAminitiesSelectionForm
      form={form}
      featuresAndAmenities={[]}
      categoryId={1}
      propertyTypeId={1}
    />
  );
}

export const StaticCatalog: Story = {
  render: () => <FeatureAndAmenitiesStaticCatalogDemo />,
};
