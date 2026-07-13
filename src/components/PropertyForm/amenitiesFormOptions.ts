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
  if (categoryId == null || propertyTypeId == null) {
    return false;
  }

  if (isAmenityGroup(item.feature_group)) {
    if (item.category_id != null && item.category_id !== categoryId) {
      return false;
    }

    if (item.property_type_id != null && item.property_type_id !== propertyTypeId) {
      return false;
    }

    return true;
  }

  return (
    item.category_id === categoryId &&
    item.property_type_id === propertyTypeId
  );
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

function resolveCatalogItemName(
  catalog: FeaturesAndAmenities[],
  value: string | number,
): string | null {
  const idToName = new Map(catalog.map((item) => [item.id, item.name]));
  const allowedNames = new Set(catalog.map((item) => item.name));
  const slugToName = new Map(catalog.map((item) => [item.slug, item.name]));

  if (typeof value === "number") {
    return idToName.get(value) ?? null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (allowedNames.has(trimmed)) {
    return trimmed;
  }

  const slugMatch = slugToName.get(trimmed);
  if (slugMatch) {
    return slugMatch;
  }

  const numericId = Number(trimmed);
  if (!Number.isNaN(numericId)) {
    return idToName.get(numericId) ?? null;
  }

  return null;
}

/** Resolve selected catalog item names from ids and/or name/slug values. */
export function resolveSelectedAmenityNames(
  catalog: FeaturesAndAmenities[],
  selected: string[],
  /** FEATURE and AMENITIES ids from the API (`feature_ids`). */
  featureIds?: number[],
): string[] {
  if (catalog.length === 0) {
    return [];
  }

  const resolved: string[] = [];

  for (const id of featureIds ?? []) {
    const name = resolveCatalogItemName(catalog, id);
    if (name && !resolved.includes(name)) {
      resolved.push(name);
    }
  }

  for (const value of selected) {
    const name = resolveCatalogItemName(catalog, value);
    if (name && !resolved.includes(name)) {
      resolved.push(name);
    }
  }

  return resolved;
}

export function resolveSelectedCatalogItems(
  catalog: FeaturesAndAmenities[],
  selected: string[],
  featureIds?: number[],
): FeaturesAndAmenities[] {
  const names = resolveSelectedAmenityNames(catalog, selected, featureIds);
  const nameSet = new Set(names);

  return catalog.filter((item) => nameSet.has(item.name));
}

/** Derive `feature_ids` (features + amenities) from resolved catalog names. */
export function deriveFeatureIdsFromNames(
  catalog: FeaturesAndAmenities[],
  selectedNames: string[],
): number[] {
  const nameToId = new Map(catalog.map((item) => [item.name, item.id]));

  return selectedNames
    .map((name) => nameToId.get(name))
    .filter((id): id is number => id != null);
}

export function normalizeAmenitiesFormValues(
  featuresAndAmenities: FeaturesAndAmenities[],
  categoryId: number | null,
  propertyTypeId: number | null,
  values: AmenitiesFormValues,
): AmenitiesFormValues {
  const catalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );
  const selected_amenities = resolveSelectedAmenityNames(
    catalog,
    values.selected_amenities,
    values.feature_ids,
  );

  return {
    selected_amenities,
    feature_ids: deriveFeatureIdsFromNames(catalog, selected_amenities),
  };
}

export function isCatalogItemSelected(
  item: FeaturesAndAmenities,
  selected: string[],
  featureIds?: number[],
): boolean {
  if (featureIds?.includes(item.id)) {
    return true;
  }

  if (selected.includes(item.name) || selected.includes(item.slug)) {
    return true;
  }

  return selected.some((value) => {
    const numericId = Number(value);
    return !Number.isNaN(numericId) && numericId === item.id;
  });
}

export function pruneAmenitiesSelectionForTaxonomy(
  featuresAndAmenities: FeaturesAndAmenities[],
  categoryId: number | null,
  propertyTypeId: number | null,
  selected: string[],
  featureIds?: number[],
): string[] {
  const catalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );

  return resolveSelectedAmenityNames(catalog, selected, featureIds);
}

export function countResolvableAmenitiesSelection(
  catalog: FeaturesAndAmenities[],
  selected: string[],
  featureIds?: number[],
): number {
  return resolveSelectedAmenityNames(catalog, selected, featureIds).length;
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
  const resolvedSelection = resolveSelectedAmenityNames(
    catalog,
    formValues.selected_amenities,
    formValues.feature_ids,
  );
  const incomingCount = Math.max(
    formValues.selected_amenities.length,
    formValues.feature_ids?.length ?? 0,
  );

  if (resolvedSelection.length !== incomingCount) {
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
