import type { PropertyFormOption, PropertyPricingFieldDefinition } from "./types";

export function getVisiblePricingFields({
  pricingFields,
  listingPurposes,
  furnishingStatusOptions,
}: {
  pricingFields: PropertyPricingFieldDefinition[];
  listingPurposes: string[];
  furnishingStatusOptions: PropertyFormOption[];
}): PropertyPricingFieldDefinition[] {
  if (listingPurposes.length === 0) {
    return [];
  }

  const purposeSet = new Set(listingPurposes.map((value) => value.toLowerCase()));
  const furnishingValues = new Set(
    furnishingStatusOptions.map((option) => option.value.toLowerCase()),
  );

  return pricingFields.filter((field) => {
    if (!purposeSet.has(String(field.purpose).toLowerCase())) {
      return false;
    }

    if (field.furnishingStatus == null || field.furnishingStatus === "") {
      return true;
    }

    if (furnishingValues.size === 0) {
      return true;
    }

    return furnishingValues.has(field.furnishingStatus.toLowerCase());
  });
}
