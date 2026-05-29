import type {
  PropertyFeatureDefinition,
  PropertyFeatureListItem,
  PropertyFeatureType,
} from "./types";

export type MatchedPropertyFeature = {
  id: number;
  slug: string;
  label: string;
  type: PropertyFeatureType;
};

export function mapPropertyFeatures(
  featureList: PropertyFeatureListItem[] | undefined,
  catalog: PropertyFeatureDefinition[] | undefined,
): MatchedPropertyFeature[] {
  if (!featureList?.length || !catalog?.length) {
    return [];
  }

  const catalogById = new Map(catalog.map((entry) => [entry.id, entry]));

  return featureList.flatMap((item) => {
    const definition = catalogById.get(item.id);
    if (!definition) {
      return [];
    }

    return [
      {
        id: definition.id,
        slug: definition.slug,
        label: definition.label,
        type: item.type,
      },
    ];
  });
}
