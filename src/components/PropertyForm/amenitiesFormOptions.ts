import type { AmenitiesFormValues, FeaturesAndAmenities } from "./types";

export const amenityOptions = [
  "Private rooftop plunge pool",
  "Dual living & dining lounges",
  "Chef's show kitchen & prep kitchen",
  "Panoramic floor-to-ceiling windows",
  "Smart home climate & lighting",
  "En-suite bedrooms with walk-in wardrobes",
] as const;

export function createStaticAmenitiesCatalog(): FeaturesAndAmenities[] {
  return amenityOptions.map((name, index) => ({
    id: index + 1,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    feature_group: "AMENITIES",
    category: null,
    category_id: null,
    property_type: null,
    property_type_id: null,
  }));
}

export function isFeatureGroup(featureGroup: string): boolean {
  return featureGroup.toUpperCase() === "FEATURE";
}

export function isAmenityGroup(featureGroup: string): boolean {
  const normalized = featureGroup.toUpperCase();
  return normalized === "AMENITIES" || normalized === "AMENITY";
}

export function splitFeaturesAndAmenities(items: FeaturesAndAmenities[]) {
  return {
    features: items.filter((item) => isFeatureGroup(item.feature_group)),
    amenities: items.filter((item) => isAmenityGroup(item.feature_group)),
  };
}

export function resolveFeaturesAndAmenitiesCatalog(
  items: FeaturesAndAmenities[],
): FeaturesAndAmenities[] {
  if (items.length > 0) {
    return items;
  }

  return createStaticAmenitiesCatalog();
}

export function matchesFeaturesAndAmenitiesTaxonomy(
  item: FeaturesAndAmenities,
  categoryId: number | null,
  propertyTypeId: number | null,
): boolean {
  if (item.category_id != null) {
    if (categoryId == null || item.category_id !== categoryId) {
      return false;
    }
  }

  if (item.property_type_id != null) {
    if (propertyTypeId == null || item.property_type_id !== propertyTypeId) {
      return false;
    }
  }

  return true;
}

export function filterFeaturesAndAmenitiesByTaxonomy(
  items: FeaturesAndAmenities[],
  categoryId: number | null,
  propertyTypeId: number | null,
): FeaturesAndAmenities[] {
  return items.filter((item) =>
    matchesFeaturesAndAmenitiesTaxonomy(item, categoryId, propertyTypeId),
  );
}

export function getFilteredFeaturesAndAmenitiesCatalog(
  featuresAndAmenities: FeaturesAndAmenities[],
  categoryId: number | null,
  propertyTypeId: number | null,
): FeaturesAndAmenities[] {
  if (categoryId == null || propertyTypeId == null) {
    return [];
  }

  return filterFeaturesAndAmenitiesByTaxonomy(
    resolveFeaturesAndAmenitiesCatalog(featuresAndAmenities),
    categoryId,
    propertyTypeId,
  );
}

export function pruneAmenitiesSelectionForTaxonomy(
  featuresAndAmenities: FeaturesAndAmenities[],
  categoryId: number | null,
  propertyTypeId: number | null,
  selected: string[],
): string[] {
  const catalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );

  if (catalog.length === 0) {
    return [];
  }

  const allowedNames = new Set(catalog.map((item) => item.name));
  const slugToName = new Map(catalog.map((item) => [item.slug, item.name]));
  const pruned: string[] = [];

  for (const value of selected) {
    const name = allowedNames.has(value) ? value : slugToName.get(value);

    if (name && allowedNames.has(name) && !pruned.includes(name)) {
      pruned.push(name);
    }
  }

  return pruned;
}

export function countResolvableAmenitiesSelection(
  catalog: FeaturesAndAmenities[],
  selected: string[],
): number {
  const allowedNames = new Set(catalog.map((item) => item.name));
  const slugToName = new Map(catalog.map((item) => [item.slug, item.name]));

  return selected.filter((value) => {
    const name = allowedNames.has(value) ? value : slugToName.get(value);
    return Boolean(name && allowedNames.has(name));
  }).length;
}

export function validateAmenitiesFormValuesForTaxonomy(
  formValues: AmenitiesFormValues,
  featuresAndAmenities: FeaturesAndAmenities[],
  categoryId: number | null,
  propertyTypeId: number | null,
): Partial<Record<keyof AmenitiesFormValues, string>> {
  if (categoryId == null || propertyTypeId == null) {
    return {
      selected_amenities:
        "Select a category and property type before choosing features and amenities.",
    };
  }

  const catalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );
  const resolvableCount = countResolvableAmenitiesSelection(
    catalog,
    formValues.selected_amenities,
  );

  if (resolvableCount !== formValues.selected_amenities.length) {
    return {
      selected_amenities:
        "Some selected features or amenities are not available for the selected category and property type.",
    };
  }

  return {};
}

export function areAmenitiesSelectionsEqual(
  left: string[],
  right: string[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export function getGroupSelection(
  selected: string[],
  options: FeaturesAndAmenities[],
): string[] {
  const optionNames = new Set(options.map((option) => option.name));
  return selected.filter((name) => optionNames.has(name));
}

export function setGroupSelection(
  selected: string[],
  options: FeaturesAndAmenities[],
  nextGroupSelected: string[],
): string[] {
  const optionNames = new Set(options.map((option) => option.name));
  const remaining = selected.filter((name) => !optionNames.has(name));
  return [...remaining, ...nextGroupSelected];
}

export function toggleCatalogSelection(
  selected: string[],
  name: string,
  checked: boolean,
): string[] {
  if (!checked) {
    return selected.filter((item) => item !== name);
  }

  if (selected.includes(name)) {
    return selected;
  }

  return [...selected, name];
}
