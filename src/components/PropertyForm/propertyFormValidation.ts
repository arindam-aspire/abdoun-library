import { validateOwnerInfoFormValues } from "../../hooks/useOwnerInfoFormHook";
import { validateMediaUploadFormValues } from "../../hooks/useMediaUploadFormHook";
import { validatePricingDetailsFormValues } from "../../hooks/usePricingDetailsFormHook";
import { validateBasicInfoFormValues } from "../../hooks/useBasicInfoFormHook";
import { validateLocationInsertFormValues } from "../../hooks/useLocationFormHook";
import { validatePropertyDetailsFormValues } from "../../hooks/usePropertyDetailsFormHook";
import {
  deriveFeatureIdsFromNames,
  getFilteredFeaturesAndAmenitiesCatalog,
  pruneAmenitiesSelectionForTaxonomy,
  validateAmenitiesFormValuesForTaxonomy,
} from "./amenitiesFormOptions";
import { areAllTermsAccepted } from "./propertyFormDefaults";
import type {
  AmenitiesFormValues,
  BasicInfoFormValues,
  FeaturesAndAmenities,
  LocationInsertFormValues,
  MediaUploadFormValues,
  OwnerInfoFormValues,
  PricingDetailsFormValues,
  PropertyDetailsFormValues,
  TermsAcceptanceFormValues,
} from "./types";

export type PropertyFormSubmissionState = {
  basicInfo: BasicInfoFormValues;
  location: LocationInsertFormValues;
  propertyDetails: PropertyDetailsFormValues;
  ownerInfo: OwnerInfoFormValues;
  pricing: PricingDetailsFormValues;
  amenities: AmenitiesFormValues;
  media: MediaUploadFormValues;
  termsAcceptance: TermsAcceptanceFormValues;
  categoryId: number | null;
  propertyTypeId: number | null;
  featuresAndAmenities: FeaturesAndAmenities[];
};

export function isPropertyFormSubmittable({
  basicInfo,
  location,
  propertyDetails,
  ownerInfo,
  pricing,
  amenities,
  media,
  termsAcceptance,
  categoryId,
  propertyTypeId,
  featuresAndAmenities,
}: PropertyFormSubmissionState): boolean {
  if (!areAllTermsAccepted(termsAcceptance)) {
    return false;
  }

  if (Object.keys(validateBasicInfoFormValues(basicInfo)).length > 0) {
    return false;
  }

  if (Object.keys(validateLocationInsertFormValues(location)).length > 0) {
    return false;
  }

  if (Object.keys(validatePropertyDetailsFormValues(propertyDetails)).length > 0) {
    return false;
  }

  if (!validateOwnerInfoFormValues(ownerInfo).isValid) {
    return false;
  }

  if (Object.keys(validatePricingDetailsFormValues(pricing)).length > 0) {
    return false;
  }

  const amenitiesCatalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );
  const selectedAmenities = pruneAmenitiesSelectionForTaxonomy(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
    amenities.selected_amenities,
    amenities.feature_ids,
  );
  const featureIds = deriveFeatureIdsFromNames(
    amenitiesCatalog,
    selectedAmenities,
  );

  if (
    Object.keys(
      validateAmenitiesFormValuesForTaxonomy(
        {
          selected_amenities: selectedAmenities,
          feature_ids: featureIds,
        },
        featuresAndAmenities,
        categoryId,
        propertyTypeId,
      ),
    ).length > 0
  ) {
    return false;
  }

  if (Object.keys(validateMediaUploadFormValues(media)).length > 0) {
    return false;
  }

  return true;
}
