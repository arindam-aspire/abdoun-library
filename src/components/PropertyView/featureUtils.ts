import type {
  PropertyFeatureDefinition,
  PropertyFeatureListItem,
  PropertyFeatureType,
} from "./types";

export type MatchedPropertyFeature = {
  id: number;
  slug: string;
  name: string;
  feature_group: PropertyFeatureType;
};

function normalizeFeatureGroup(
  featureGroup: string,
): PropertyFeatureType {
  const normalized = featureGroup.trim().toLowerCase();

  if (normalized === "amenity" || normalized === "amenities") {
    return "AMENITIES";
  }

  return "FEATURE";
}

export function mapPropertyFeatures(
  featureList: PropertyFeatureListItem[] | undefined,
  catalog: PropertyFeatureDefinition[] | undefined,
): MatchedPropertyFeature[] {
  if (!featureList?.length || !catalog?.length) {
    return [];
  }

  const catalogById = new Map<string, PropertyFeatureDefinition>(
    catalog.flatMap((entry) => [
      [String(entry.id), entry],
    ]),
  );

  return featureList.flatMap((item) => {
    const definition = catalogById.get(String(item.id));
    if (!definition) {
      return [];
    }

    return [
      {
        id: definition.id,
        slug: definition.slug,
        name: definition.name,
        feature_group: normalizeFeatureGroup(String(item.feature_group)),
      },
    ];
  });
}
