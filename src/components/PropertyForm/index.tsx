"use client";

import {
  ClipboardCheck,
  Image,
  Info,
  MapPin,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  useBasicInfoForm,
  validateBasicInfoFormValues,
} from "../../hooks/useBasicInfoFormHook";
import {
  useLocationInsertForm,
  validateLocationInsertFormValues,
} from "../../hooks/useLocationFormHook";
import { useOwnerInfoForm } from "../../hooks/useOwnerInfoFormHook";
import { useAmenitiesForm } from "../../hooks/useAmenitiesFormHook";
import { useMediaUploadForm } from "../../hooks/useMediaUploadFormHook";
import { usePricingDetailsForm } from "../../hooks/usePricingDetailsFormHook";
import {
  usePropertyDetailsForm,
  validatePropertyDetailsFormValues,
} from "../../hooks/usePropertyDetailsFormHook";
import {
  areAmenitiesSelectionsEqual,
  pruneAmenitiesSelectionForTaxonomy,
  validateAmenitiesFormValuesForTaxonomy,
} from "./amenitiesFormOptions";
import { BasicInfoForm } from "./BasicInfoForm";
import { FeatureAndAminitiesSelectionForm } from "./FeatureAndAminitiesSelectionForm";
import { FormLayout } from "./FormLayout";
import { LocationInfoForm } from "./LocationInfoForm";
import { MediaAndDocumentUploadForm } from "./MediaAndDocumentUploadForm";
import { OwnerInforForm } from "./OwnerInforForm";
import { PricingInfoForm } from "./PricingInfoForm";
import { PropertyInfoForm } from "./PropertyInfoForm";
import { ReviewAndSubmitStep } from "./ReviewAndSubmitStep";
import type {
  BasicInfoFormValues,
  LocationInsertFormValues,
  PropertyDetailsFormValues,
  PropertyFormProps,
  PropertyFormStep,
} from "./types";

export const propertyFormSteps: PropertyFormStep[] = [
  {
    value: "setup",
    label: "Setup",
    verticalLabel: "Basic Information",
    icon: <Info />,
  },
  {
    value: "location",
    label: "Location",
    verticalLabel: "Location",
    icon: <MapPin />,
  },
  {
    value: "details",
    label: "Details",
    verticalLabel: "Property Details",
    icon: <Sparkles />,
  },
  {
    value: "owners",
    label: "Owners",
    verticalLabel: "Owner Information",
    icon: <User />,
  },
  {
    value: "pricing",
    label: "Pricing",
    verticalLabel: "Pricing",
    icon: <Wallet />,
  },
  {
    value: "amenities",
    label: "Amenities",
    verticalLabel: "Features & Amenities",
    icon: <Sparkles />,
  },
  {
    value: "media",
    label: "Media",
    verticalLabel: "Media & Documents",
    icon: <Image />,
  },
  {
    value: "finalize",
    label: "Finalize",
    verticalLabel: "Review & Submit",
    icon: <ClipboardCheck />,
  },
];

const LOCATION_STEP_INDEX = propertyFormSteps.findIndex(
  (step) => step.value === "location",
);

const PROPERTY_DETAILS_STEP_INDEX = propertyFormSteps.findIndex(
  (step) => step.value === "details",
);

const OWNER_INFO_STEP_INDEX = propertyFormSteps.findIndex(
  (step) => step.value === "owners",
);

const PRICING_STEP_INDEX = propertyFormSteps.findIndex(
  (step) => step.value === "pricing",
);

const AMENITIES_STEP_INDEX = propertyFormSteps.findIndex(
  (step) => step.value === "amenities",
);

const MEDIA_STEP_INDEX = propertyFormSteps.findIndex(
  (step) => step.value === "media",
);

function markAllTouched<T extends Record<string, unknown>>(values: T) {
  return (Object.keys(values) as (keyof T)[]).reduce(
    (accumulator, key) => ({ ...accumulator, [key]: true }),
    {} as Partial<Record<keyof T, boolean>>,
  );
}

function isBasicInfoValid(values: BasicInfoFormValues) {
  return Object.keys(validateBasicInfoFormValues(values)).length === 0;
}

function isLocationInsertValid(values: LocationInsertFormValues) {
  return Object.keys(validateLocationInsertFormValues(values)).length === 0;
}

function isPropertyDetailsValid(values: PropertyDetailsFormValues) {
  return Object.keys(validatePropertyDetailsFormValues(values)).length === 0;
}

export function PropertyForm({
  activeStep,
  categoryTaxonomy,
  locationTaxonomy,
  featuresAndAmenities,
  propertyDetails,
  title,
  onPrevious,
  onNext,
  onSubmit,
  onDraft,
  onUploadOwnerDocument,
  onUploadPropertyMedia,
  onUploadPropertyDocument,
  onStepClick,
}: PropertyFormProps) {
  const basicInfoForm = useBasicInfoForm(propertyDetails.basic_info);
  const locationInsertForm = useLocationInsertForm(
    propertyDetails.location_insert,
  );
  const propertyDetailsForm = usePropertyDetailsForm(
    propertyDetails.property_details,
  );
  const ownerInfoForm = useOwnerInfoForm(propertyDetails.owner_info);
  const pricingDetailsForm = usePricingDetailsForm(
    propertyDetails.pricing_details,
  );
  const amenitiesForm = useAmenitiesForm(propertyDetails.amenities);
  const mediaUploadForm = useMediaUploadForm(propertyDetails.media_upload);
  const currentStep = propertyFormSteps[activeStep];
  const [maxReachedStep, setMaxReachedStep] = useState(activeStep);

  useEffect(() => {
    setMaxReachedStep((previous) => Math.max(previous, activeStep));
  }, [activeStep]);

  const categoryId = basicInfoForm.values.category_id;
  const propertyTypeId = basicInfoForm.values.type_id;
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

    if (amenitiesForm.values.selected_amenities.length > 0) {
      amenitiesForm.setSelectedAmenities([]);
    }

    amenitiesForm.setErrors((previous) => {
      const next = { ...previous };
      delete next.selected_amenities;
      return next;
    });

    setMaxReachedStep((previous) => Math.min(previous, AMENITIES_STEP_INDEX));
  }, [categoryId, propertyTypeId]);

  const validateBasicInfoStep = () => {
    const formErrors = validateBasicInfoFormValues(basicInfoForm.values);
    basicInfoForm.setErrors(formErrors);
    basicInfoForm.setTouched(markAllTouched(basicInfoForm.values));
    return isBasicInfoValid(basicInfoForm.values);
  };

  const validateLocationInsertStep = () => {
    const formErrors = validateLocationInsertFormValues(
      locationInsertForm.values,
    );
    locationInsertForm.setErrors(formErrors);
    locationInsertForm.setTouched(markAllTouched(locationInsertForm.values));
    return isLocationInsertValid(locationInsertForm.values);
  };

  const validatePropertyDetailsStep = () => {
    const formErrors = validatePropertyDetailsFormValues(
      propertyDetailsForm.values,
    );
    propertyDetailsForm.setErrors(formErrors);
    propertyDetailsForm.setTouched(markAllTouched(propertyDetailsForm.values));
    return isPropertyDetailsValid(propertyDetailsForm.values);
  };

  const validateOwnerInfoStep = () => {
    return ownerInfoForm.submit();
  };

  const validatePricingDetailsStep = () => {
    return pricingDetailsForm.submit();
  };

  const validateAmenitiesStep = () => {
    const nextSelected = pruneAmenitiesSelectionForTaxonomy(
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
      amenitiesForm.values.selected_amenities,
    );

    if (
      !areAmenitiesSelectionsEqual(
        amenitiesForm.values.selected_amenities,
        nextSelected,
      )
    ) {
      amenitiesForm.setSelectedAmenities(nextSelected);
    }

    const formErrors = validateAmenitiesFormValuesForTaxonomy(
      {
        ...amenitiesForm.values,
        selected_amenities: nextSelected,
      },
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
    );

    amenitiesForm.setErrors(formErrors);
    amenitiesForm.setTouched({ selected_amenities: true });

    return Object.keys(formErrors).length === 0;
  };

  const validateMediaUploadStep = () => {
    return mediaUploadForm.submit();
  };

  const validateActiveStep = () => {
    if (activeStep === 0) {
      return validateBasicInfoStep();
    }

    if (activeStep === LOCATION_STEP_INDEX) {
      return validateLocationInsertStep();
    }

    if (activeStep === PROPERTY_DETAILS_STEP_INDEX) {
      return validatePropertyDetailsStep();
    }

    if (activeStep === OWNER_INFO_STEP_INDEX) {
      return validateOwnerInfoStep();
    }

    if (activeStep === PRICING_STEP_INDEX) {
      return validatePricingDetailsStep();
    }

    if (activeStep === AMENITIES_STEP_INDEX) {
      return validateAmenitiesStep();
    }

    if (activeStep === MEDIA_STEP_INDEX) {
      return validateMediaUploadStep();
    }

    return true;
  };

  const handleNext = () => {
    if (!validateActiveStep()) {
      return;
    }

    onNext?.();
  };

  const handleStepClick = (index: number, step: PropertyFormStep) => {
    if (index > AMENITIES_STEP_INDEX && maxReachedStep <= AMENITIES_STEP_INDEX) {
      return;
    }

    if (index > activeStep && !validateActiveStep()) {
      return;
    }

    onStepClick?.(index, step);
  };

  let stepContent: ReactNode = null;

  if (currentStep?.value === "setup") {
    stepContent = (
      <BasicInfoForm
        categoryTaxonomy={categoryTaxonomy}
        form={basicInfoForm}
      />
    );
  } else if (currentStep?.value === "location") {
    stepContent = (
      <LocationInfoForm
        locationTaxonomy={locationTaxonomy.data}
        form={locationInsertForm}
      />
    );
  } else if (currentStep?.value === "details") {
    stepContent = <PropertyInfoForm form={propertyDetailsForm} />;
  } else if (currentStep?.value === "owners") {
    stepContent = (
      <OwnerInforForm
        form={ownerInfoForm}
        onUploadOwnerDocument={onUploadOwnerDocument}
      />
    );
  } else if (currentStep?.value === "pricing") {
    stepContent = <PricingInfoForm form={pricingDetailsForm} />;
  } else if (currentStep?.value === "amenities") {
    stepContent = (
      <FeatureAndAminitiesSelectionForm
        form={amenitiesForm}
        featuresAndAmenities={featuresAndAmenities}
        categoryId={categoryId}
        propertyTypeId={propertyTypeId}
      />
    );
  } else if (currentStep?.value === "media") {
    stepContent = (
      <MediaAndDocumentUploadForm
        form={mediaUploadForm}
        onUploadPropertyMedia={onUploadPropertyMedia}
        onUploadPropertyDocument={onUploadPropertyDocument}
      />
    );
  } else if (currentStep?.value === "finalize") {
    stepContent = (
      <ReviewAndSubmitStep
        basicInfo={basicInfoForm.values}
        location={locationInsertForm.values}
        propertyDetails={propertyDetailsForm.values}
        ownerInfo={ownerInfoForm.values}
        pricing={pricingDetailsForm.values}
        amenities={amenitiesForm.values}
        media={mediaUploadForm.values}
        categoryTaxonomy={categoryTaxonomy}
        locationTaxonomy={locationTaxonomy.data}
        featuresAndAmenities={featuresAndAmenities}
      />
    );
  }

  return (
    <FormLayout
      steps={propertyFormSteps}
      activeStep={activeStep}
      maxReachedStep={maxReachedStep}
      title={title}
      onStepClick={handleStepClick}
      onPrevious={onPrevious}
      onNext={handleNext}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      {stepContent}
    </FormLayout>
  );
}

export type { PropertyFormProps, PropertyFormStep } from "./types";
