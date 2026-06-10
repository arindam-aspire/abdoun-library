import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  propertyFormCategoryTaxonomy,
  propertyFormFeaturesAndAmenities,
  propertyFormFilledValues,
  propertyFormLocationTaxonomy,
} from "./propertyFormStoryData";
import { ReviewAndSubmitStep } from "./ReviewAndSubmitStep";

const meta = {
  title: "Components/PropertyForm/ReviewAndSubmitStep",
  component: ReviewAndSubmitStep,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full min-w-0 max-w-3xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    basicInfo: propertyFormFilledValues.basic_info!,
    location: propertyFormFilledValues.location_insert!,
    propertyDetails: propertyFormFilledValues.property_details!,
    ownerInfo: propertyFormFilledValues.owner_info!,
    pricing: propertyFormFilledValues.pricing_details!,
    amenities: propertyFormFilledValues.amenities!,
    media: propertyFormFilledValues.media_upload!,
    categoryTaxonomy: propertyFormCategoryTaxonomy,
    locationTaxonomy: propertyFormLocationTaxonomy.data,
    featuresAndAmenities: propertyFormFeaturesAndAmenities,
  },
} satisfies Meta<typeof ReviewAndSubmitStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    basicInfo: {
      title: "",
      description: "",
      listing_purpose: null,
      category_id: null,
      type_id: null,
    },
    location: {
      city_id: null,
      area_ids: [],
      address: "",
    },
    propertyDetails: {
      bedrooms: null,
      bathrooms: null,
      built_up_area: "",
      parking_spaces: null,
      property_age: null,
      completion_status: null,
      total_floor: "",
      occupancy: null,
      ownership_type: null,
      reference_number: "",
      permit_dld_number: "",
      orientation: null,
    },
    ownerInfo: {
      owners: [
        {
          owner_name: "",
          country_code: "+962",
          phone_number: "",
          email: "",
          social_security_id: "",
          nationality: "",
          owner_address: "",
          owner_documents: [],
        },
      ],
    },
    pricing: {
      price: "",
      service_charge: "",
      maintenance_fee: "",
    },
    amenities: {
      selected_amenities: [],
    },
    media: {
      media_files: [],
      youtube_url: "",
      virtual_tour_url: "",
      documents: [],
    },
  },
};
