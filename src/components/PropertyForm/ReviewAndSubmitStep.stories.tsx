import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  propertyFormCategoryTaxonomy,
  propertyFormFeaturesAndAmenities,
  propertyFormFilledValues,
  propertyFormLocationTaxonomy,
} from "./propertyFormStoryData";
import { resolvePropertyFormConfig } from "./propertyFormConfig";
import { getVisiblePricingFields } from "./propertyFormPricing";
import {
  emptyTermsAcceptanceFormValues,
  mergePropertyFormValues,
} from "./propertyFormDefaults";
import { ReviewAndSubmitStep } from "./ReviewAndSubmitStep";
import type { TermsAcceptanceFormValues } from "./types";

const filledValues = mergePropertyFormValues(propertyFormFilledValues);
const resolvedConfig = resolvePropertyFormConfig();
const visiblePricingFields = getVisiblePricingFields({
  pricingFields: resolvedConfig.pricingFields,
  listingPurposes: filledValues.basic_info.listing_purposes ?? [],
  furnishingStatusOptions: resolvedConfig.furnishingStatusOptions,
});

const meta = {
  title: "Components/PropertyForm/ReviewAndSubmitStep",
  component: ReviewAndSubmitStep,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ReviewStepDemo({
  initialTerms = emptyTermsAcceptanceFormValues,
}: {
  initialTerms?: TermsAcceptanceFormValues;
}) {
  const [termsAcceptance, setTermsAcceptance] =
    useState<TermsAcceptanceFormValues>(initialTerms);

  return (
    <ReviewAndSubmitStep
      basicInfo={filledValues.basic_info}
      location={filledValues.location_insert}
      propertyDetails={filledValues.property_details}
      ownerInfo={filledValues.owner_info}
      pricing={filledValues.pricing_details}
      amenities={filledValues.amenities}
      media={filledValues.media_upload}
      categoryTaxonomy={propertyFormCategoryTaxonomy}
      locationTaxonomy={propertyFormLocationTaxonomy.data}
      featuresAndAmenities={propertyFormFeaturesAndAmenities}
      termsAcceptance={termsAcceptance}
      onTermsAcceptanceChange={setTermsAcceptance}
      resolvedConfig={resolvedConfig}
      visiblePricingFields={visiblePricingFields}
    />
  );
}

export const Default: Story = {
  render: () => <ReviewStepDemo />,
};

export const TermsAccepted: Story = {
  render: () => (
    <ReviewStepDemo
      initialTerms={{
        terms_accepted: true,
        privacy_accepted: true,
        public_display_authorized: true,
        fees_acknowledged: true,
      }}
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <ReviewAndSubmitStep
      basicInfo={filledValues.basic_info}
      location={filledValues.location_insert}
      propertyDetails={filledValues.property_details}
      ownerInfo={filledValues.owner_info}
      pricing={filledValues.pricing_details}
      amenities={filledValues.amenities}
      media={filledValues.media_upload}
      categoryTaxonomy={propertyFormCategoryTaxonomy}
      locationTaxonomy={propertyFormLocationTaxonomy.data}
      featuresAndAmenities={propertyFormFeaturesAndAmenities}
      termsAcceptance={emptyTermsAcceptanceFormValues}
      onTermsAcceptanceChange={() => undefined}
      resolvedConfig={resolvedConfig}
      visiblePricingFields={visiblePricingFields}
      canEdit={false}
    />
  ),
};
