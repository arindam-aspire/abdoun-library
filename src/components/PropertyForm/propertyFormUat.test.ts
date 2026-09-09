import { describe, expect, it } from "vitest";
import { validateBasicInfoFormValues } from "../../hooks/useBasicInfoFormHook";
import { validateLocationInsertFormValues } from "../../hooks/useLocationFormHook";
import { validatePropertyDetailsFormValues } from "../../hooks/usePropertyDetailsFormHook";
import { validateOwnerInfoFormValues } from "../../hooks/useOwnerInfoFormHook";
import { resolvePropertyFormConfig } from "./propertyFormConfig";
import {
  emptyPropertyDetailsFormValues,
  getPricingFieldValue,
  mergePropertyFormValues,
  normalizeListingPurposes,
  normalizeYearBuilt,
  setPricingFieldValue,
} from "./propertyFormDefaults";
import { getFirstExternalErrorPath, mergeFieldError } from "./propertyFormErrors";
import {
  normalizePropertyMediaFiles,
  setPrimaryPropertyMedia,
} from "./propertyFormMedia";
import { findDuplicateOwnerMatch } from "./propertyFormOwner";
import { getVisiblePricingFields } from "./propertyFormPricing";
import type { PropertyFormValues } from "./types";

const legacyDraft: PropertyFormValues = {
  basic_info: {
    title: "Legacy Villa",
    description: "Draft",
    listing_purpose: "rent",
    category_id: 1,
    type_id: 1,
  },
  location_insert: {
    city_id: 1,
    area_ids: [4, 9],
    address: "Old address",
  },
  property_details: {
    ...emptyPropertyDetailsFormValues,
    bedrooms: 3,
    bathrooms: 2,
    built_up_area: "200",
    parking_spaces: 1,
    property_age: "1-5",
    completion_status: "ready",
    total_floor: "4",
    occupancy: "vacant",
    ownership_type: "freehold",
    reference_number: "LEG-1",
    permit_dld_number: "DLD-LEGACY",
    orientation: "north",
  },
  amenities: {
    selected_amenities: ["Smart home system"],
  },
  media_upload: {
    media_files: [
      {
        name: "photo.jpg",
        uri: "https://example.com/photo.jpg",
        mimeType: "image/jpeg",
      },
    ],
    youtube_url: "",
    virtual_tour_url: "",
    documents: [],
  },
};

describe("PropertyForm UAT contracts", () => {
  it("hydrates a legacy draft onto the new field contract", () => {
    const merged = mergePropertyFormValues(legacyDraft);

    expect(merged.basic_info.listing_purposes).toEqual(["rent"]);
    expect(merged.basic_info.listing_purpose).toBe("rent");
    expect(merged.location_insert.area_id).toBe(4);
    expect(merged.location_insert.area_ids).toEqual([4]);
    expect(merged.property_details.year_built).toBeNull();
    expect(merged.property_details.property_age).toBe("1-5");
    expect(merged.property_details.permit_dld_number).toBe("DLD-LEGACY");
    expect(merged.media_upload.media_files[0]?.is_primary).toBe(true);
  });

  it("normalizes multi-purpose selection without a synthetic combined value", () => {
    expect(
      normalizeListingPurposes({
        listing_purposes: ["sale", "rent"],
      }),
    ).toEqual(["sale", "rent"]);

    const errors = validateBasicInfoFormValues({
      title: "Title",
      description: "",
      listing_purposes: ["sale", "rent"],
      listing_purpose: "sale",
      category_id: 1,
      type_id: 1,
    });

    expect(errors.listing_purposes).toBeUndefined();
  });

  it("requires at least one listing purpose", () => {
    const errors = validateBasicInfoFormValues({
      title: "Title",
      description: "",
      listing_purposes: [],
      listing_purpose: null,
      category_id: 1,
      type_id: 1,
    });

    expect(errors.listing_purposes).toBe("Please select listing purpose.");
  });

  it("validates a single area id and hydrates it from legacy area_ids", () => {
    const merged = mergePropertyFormValues({
      location_insert: {
        city_id: 2,
        area_ids: [8],
        address: "Street",
        area_id: null,
        latitude: null,
        longitude: null,
        apartment_number: "",
        plot_number: "",
        basin_number: "",
        parcel_number: "",
        building_number: "",
      },
    });

    expect(merged.location_insert.area_id).toBe(8);
    expect(validateLocationInsertFormValues(merged.location_insert).area_id).toBeUndefined();
    expect(
      validateLocationInsertFormValues({
        ...merged.location_insert,
        area_id: null,
      }).area_id,
    ).toBe("Please select an area.");
  });

  it("keeps coordinate updates as form values", () => {
    const merged = mergePropertyFormValues({
      location_insert: {
        city_id: 1,
        area_id: 2,
        address: "Pin",
        latitude: 31.95,
        longitude: 35.91,
        apartment_number: "1",
        plot_number: "2",
        basin_number: "3",
        parcel_number: "4",
        building_number: "5",
      },
    });

    expect(merged.location_insert.latitude).toBe(31.95);
    expect(merged.location_insert.longitude).toBe(35.91);
  });

  it("does not require DLD and does not reinterpret legacy age buckets as years", () => {
    expect(normalizeYearBuilt({ property_age: "1-5" })).toBeNull();
    expect(normalizeYearBuilt({ property_age: "new" })).toBeNull();
    expect(normalizeYearBuilt({ year_built: 2018, property_age: "1-5" })).toBe(2018);

    const errors = validatePropertyDetailsFormValues({
      ...emptyPropertyDetailsFormValues,
      bedrooms: 1,
      bathrooms: 1,
      built_up_area: "80",
      parking_spaces: 0,
      year_built: 2018,
      furnishing_status: "furnished",
      floor_level: "1",
      completion_status: "secondary",
      total_floor: "3",
      occupancy: "vacant",
      ownership_type: "freehold",
      reference_number: "REF",
      orientation: "northeast",
    });

    expect(errors.permit_dld_number).toBeUndefined();
    expect(errors.year_built).toBeUndefined();
    expect(errors.orientation).toBeUndefined();
    expect(errors.completion_status).toBeUndefined();
  });

  it("shows purpose-aware pricing fields and preserves hidden values", () => {
    const config = resolvePropertyFormConfig();
    const saleFields = getVisiblePricingFields({
      pricingFields: config.pricingFields,
      listingPurposes: ["sale"],
      furnishingStatusOptions: config.furnishingStatusOptions,
    });
    const rentFields = getVisiblePricingFields({
      pricingFields: config.pricingFields,
      listingPurposes: ["rent"],
      furnishingStatusOptions: config.furnishingStatusOptions,
    });
    const bothFields = getVisiblePricingFields({
      pricingFields: config.pricingFields,
      listingPurposes: ["sale", "rent"],
      furnishingStatusOptions: config.furnishingStatusOptions,
    });

    expect(saleFields.map((field) => field.key)).toEqual([
      "furnished_sale_price",
      "unfurnished_sale_price",
    ]);
    expect(rentFields.map((field) => field.key)).toEqual([
      "furnished_rent_price",
      "unfurnished_rent_price",
      "semi_furnished_rent_price",
    ]);
    expect(bothFields).toHaveLength(5);

    let pricing = mergePropertyFormValues({
      pricing_details: {
        furnished_sale_price: "100",
        furnished_rent_price: "12",
      },
    }).pricing_details;

    pricing = setPricingFieldValue(pricing, "furnished_sale_price", "100");
    expect(getPricingFieldValue(pricing, "furnished_rent_price")).toBe("12");
  });

  it("stores selected existing owners by owner_id and blocks duplicates", () => {
    const selected = mergePropertyFormValues({
      owner_info: {
        owner_mode: "search",
        owner_id: "own-1",
        owners: [
          {
            owner_id: "own-1",
            owner_name: "Existing Owner",
            email: "owner@example.com",
            country_code: "+962",
            phone_number: "791111111",
            nationality: "jordanian",
            social_security_id: "123",
            owner_documents: [],
          },
        ],
      },
    });

    expect(selected.owner_info.owner_id).toBe("own-1");
    expect(
      validateOwnerInfoFormValues(selected.owner_info).isValid,
    ).toBe(true);

    const duplicate = findDuplicateOwnerMatch(
      {
        email: "owner@example.com",
        country_code: "+962",
        phone_number: "791111111",
        social_security_id: "123",
      },
      [
        {
          owner_id: "own-1",
          email: "owner@example.com",
          country_code: "+962",
          phone_number: "791111111",
          ssi: "123",
        },
      ],
      ["email", "phone", "ssi", "duplicate_key"],
    );

    expect(duplicate?.owner_id).toBe("own-1");
  });

  it("keeps feature_ids as the selected value while hydrating legacy names", () => {
    const merged = mergePropertyFormValues({
      amenities: {
        selected_amenities: ["Smart home system"],
        feature_ids: [101],
      },
    });

    expect(merged.amenities.feature_ids).toEqual([101]);
    expect(merged.amenities.selected_amenities).toContain("Smart home system");
  });

  it("enforces exactly one primary image and reassigns after removal", () => {
    const initial = normalizePropertyMediaFiles([
      {
        name: "one.jpg",
        uri: "https://example.com/one.jpg",
        mimeType: "image/jpeg",
      },
      {
        name: "two.jpg",
        uri: "https://example.com/two.jpg",
        mimeType: "image/jpeg",
      },
      {
        name: "clip.mp4",
        uri: "https://example.com/clip.mp4",
        mimeType: "video/mp4",
      },
    ]);

    expect(initial.filter((item) => item.is_primary)).toHaveLength(1);
    expect(initial[0]?.is_primary).toBe(true);
    expect(initial[2]?.is_primary).toBe(false);

    const selected = setPrimaryPropertyMedia(initial, initial[1]!);
    expect(selected[0]?.is_primary).toBe(false);
    expect(selected[1]?.is_primary).toBe(true);

    const afterRemoval = normalizePropertyMediaFiles(
      selected.filter((item) => item.name !== "two.jpg"),
    );
    expect(afterRemoval.find((item) => item.name === "one.jpg")?.is_primary).toBe(
      true,
    );
  });

  it("maps external backend field errors alongside client validation", () => {
    const client = "Please select an area.";
    const external = "Area is not available.";
    expect(mergeFieldError(client, external)).toBe(
      "Please select an area. Area is not available.",
    );

    const target = getFirstExternalErrorPath({
      "location.area_id": "Area is required.",
      "pricing.furnished_rent_price": "Invalid rent price.",
    });

    expect(target).toEqual({
      step: 2,
      fieldPath: "location_insert.area_id",
    });
  });

  it("uses host-provided options instead of hardcoded Sale/Rent constants when config is supplied", () => {
    const config = resolvePropertyFormConfig({
      listingPurposeOptions: [
        { value: "sale", label: "For Sale" },
        { value: "rent", label: "For Rent" },
      ],
      completionStatusOptions: [{ value: "secondary", label: "Secondary" }],
      orientationOptions: [{ value: "northwest", label: "Northwest" }],
    });

    expect(config.listingPurposeOptions[0]?.label).toBe("For Sale");
    expect(config.completionStatusOptions).toEqual([
      { value: "secondary", label: "Secondary" },
    ]);
    expect(config.orientationOptions[0]?.value).toBe("northwest");
  });
});
