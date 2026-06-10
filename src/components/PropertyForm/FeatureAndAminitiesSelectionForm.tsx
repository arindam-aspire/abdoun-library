"use client";

import { useEffect, useMemo, useRef } from "react";
import type { UseAmenitiesFormReturn } from "../../hooks/useAmenitiesFormHook";
import { cn } from "../../lib/cn";
import {
  fieldErrorSizeClasses,
  textBodySmClasses,
  textPageTitleClasses,
  textSectionTitleClasses,
} from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Checkbox } from "../ui/Checkbox";
import {
  getFilteredFeaturesAndAmenitiesCatalog,
  splitFeaturesAndAmenities,
} from "./amenitiesFormOptions";
import {
  propertyFormGridClasses,
  propertyFormStackClasses,
} from "./propertyFormFieldLayout";
import type { FeaturesAndAmenities } from "./types";

const FEATURES_AMENITIES_TITLE = "Features & Amenities";
const FEATURES_AMENITIES_SUBTITLE =
  "Select the property features and amenities that apply to this listing.";
const FEATURES_AMENITIES_BADGE_LABEL = "Required";
const FEATURES_SECTION_TITLE = "Features";
const FEATURES_SECTION_SUBTITLE =
  "Choose the standout property features for this listing.";
const AMENITIES_SECTION_TITLE = "Amenities";
const AMENITIES_SECTION_SUBTITLE =
  "Select all amenities included with the property.";
const TAXONOMY_REQUIRED_MESSAGE =
  "Select a category and property type in Basic Information to see available features and amenities.";
const EMPTY_CATALOG_MESSAGE =
  "No features or amenities are available for the selected category and property type.";

export interface FeatureAndAminitiesSelectionFormProps {
  form: UseAmenitiesFormReturn;
  featuresAndAmenities: FeaturesAndAmenities[];
  categoryId: number | null;
  propertyTypeId: number | null;
  className?: string;
}

export function FeatureAndAminitiesSelectionForm({
  form,
  featuresAndAmenities,
  categoryId,
  propertyTypeId,
  className,
}: FeatureAndAminitiesSelectionFormProps) {
  const hasTaxonomySelection =
    categoryId != null && propertyTypeId != null;

  const catalog = useMemo(
    () =>
      getFilteredFeaturesAndAmenitiesCatalog(
        featuresAndAmenities,
        categoryId,
        propertyTypeId,
      ),
    [categoryId, featuresAndAmenities, propertyTypeId],
  );

  const { features, amenities } = useMemo(
    () => splitFeaturesAndAmenities(catalog),
    [catalog],
  );

  const previousTaxonomyRef = useRef({
    categoryId,
    propertyTypeId,
  });

  useEffect(() => {
    const previousTaxonomy = previousTaxonomyRef.current;
    const taxonomyChanged =
      previousTaxonomy.categoryId !== categoryId ||
      previousTaxonomy.propertyTypeId !== propertyTypeId;

    if (!taxonomyChanged) {
      return;
    }

    previousTaxonomyRef.current = { categoryId, propertyTypeId };

    if (form.values.selected_amenities.length > 0) {
      form.setSelectedAmenities([]);
    }

    form.setErrors((previous) => {
      const next = { ...previous };
      delete next.selected_amenities;
      return next;
    });
  }, [categoryId, form.setSelectedAmenities, form.setErrors, propertyTypeId]);

  return (
    <form
      className={cn(propertyFormStackClasses, className)}
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <header className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h2
            className={cn(
              "min-w-0 font-bold text-secondary",
              textPageTitleClasses,
            )}
          >
            {FEATURES_AMENITIES_TITLE}
          </h2>
          <Badge variant="exclusive" appearance="solid" className="shrink-0">
            {FEATURES_AMENITIES_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>
          {FEATURES_AMENITIES_SUBTITLE}
        </p>
        {form.errors.selected_amenities ? (
          <p className={fieldErrorSizeClasses} role="alert">
            {form.errors.selected_amenities}
          </p>
        ) : null}
      </header>

      {!hasTaxonomySelection ? (
        <p className={cn("text-muted", textBodySmClasses)}>
          {TAXONOMY_REQUIRED_MESSAGE}
        </p>
      ) : features.length === 0 && amenities.length === 0 ? (
        <p className={cn("text-muted", textBodySmClasses)}>
          {EMPTY_CATALOG_MESSAGE}
        </p>
      ) : null}

      {features.length > 0 ? (
        <section className={propertyFormStackClasses}>
          <div className="flex flex-col gap-1">
            <h3 className={cn("text-secondary", textSectionTitleClasses)}>
              {FEATURES_SECTION_TITLE}
            </h3>
            <p className={cn("text-muted", textBodySmClasses)}>
              {FEATURES_SECTION_SUBTITLE}
            </p>
          </div>

          <div className={propertyFormGridClasses}>
            {features.map((feature) => (
              <Checkbox
                key={feature.id}
                name={`feature-${feature.id}`}
                label={feature.name}
                checked={form.values.selected_amenities.includes(feature.name)}
                onChange={(checked) =>
                  form.toggleSelection(feature.name, checked)
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      {amenities.length > 0 ? (
        <section
          className={cn(
            propertyFormStackClasses,
            features.length > 0 && "border-t border-secondary/10 pt-4 sm:pt-5",
          )}
        >
          <div className="flex flex-col gap-1">
            <h3 className={cn("text-secondary", textSectionTitleClasses)}>
              {AMENITIES_SECTION_TITLE}
            </h3>
            <p className={cn("text-muted", textBodySmClasses)}>
              {AMENITIES_SECTION_SUBTITLE}
            </p>
          </div>

          <div className={propertyFormGridClasses}>
            {amenities.map((amenity) => (
              <Checkbox
                key={amenity.id}
                name={`amenity-${amenity.id}`}
                label={amenity.name}
                checked={form.values.selected_amenities.includes(amenity.name)}
                onChange={(checked) =>
                  form.toggleSelection(amenity.name, checked)
                }
              />
            ))}
          </div>
        </section>
      ) : null}
    </form>
  );
}
