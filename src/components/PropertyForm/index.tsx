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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useBasicInfoForm,
  validateBasicInfoFormValues,
} from "../../hooks/useBasicInfoFormHook";
import {
  useLocationInsertForm,
  validateLocationInsertFormValues,
} from "../../hooks/useLocationFormHook";
import { useOwnerInfoForm, validateOwnerInfoFormValues } from "../../hooks/useOwnerInfoFormHook";
import { useAmenitiesForm } from "../../hooks/useAmenitiesFormHook";
import { useMediaUploadForm, validateMediaUploadFormValues } from "../../hooks/useMediaUploadFormHook";
import { usePricingDetailsForm } from "../../hooks/usePricingDetailsFormHook";
import {
  usePropertyDetailsForm,
  validatePropertyDetailsFormValues,
} from "../../hooks/usePropertyDetailsFormHook";
import {
  areAmenitiesSelectionsEqual,
  deriveFeatureIdsFromNames,
  getFilteredFeaturesAndAmenitiesCatalog,
  normalizeAmenitiesFormValues,
  pruneAmenitiesSelectionForTaxonomy,
  validateAmenitiesFormValuesForTaxonomy,
} from "./amenitiesFormOptions";
import { BasicInfoForm } from "./BasicInfoForm";
import { FeatureAndAminitiesSelectionForm } from "./FeatureAndAminitiesSelectionForm";
import { FormLayout } from "./FormLayout";
import { LocationInfoForm } from "./LocationInfoForm";
import { MediaAndDocumentUploadForm } from "./MediaAndDocumentUploadForm";
import { OwnerInforForm } from "./OwnerInforForm";
import {
  mergePropertyFormValues,
  serializePropertyFormValues,
} from "./propertyFormDefaults";
import { isPropertyFormSubmittable } from "./propertyFormValidation";
import { PricingInfoForm } from "./PricingInfoForm";
import { PropertyInfoForm } from "./PropertyInfoForm";
import { ReviewAndSubmitStep } from "./ReviewAndSubmitStep";
import type {
  BasicInfoFormValues,
  LocationInsertFormValues,
  PropertyDetailsFormValues,
  PropertyFormProps,
  PropertyFormStep,
  PropertyFormValues,
  TermsAcceptanceFormValues,
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

const PROPERTY_FORM_STEP_COUNT = propertyFormSteps.length;

/** Clamp a 1-based step number to the valid range. */
function clampStepNumber(stepNumber: number) {
  return Math.min(Math.max(stepNumber, 1), PROPERTY_FORM_STEP_COUNT);
}

/** Convert public 1-based step number to internal 0-based index. */
function stepNumberToIndex(stepNumber: number) {
  return clampStepNumber(stepNumber) - 1;
}

/** Convert internal 0-based index to public 1-based step number. */
function stepIndexToNumber(stepIndex: number) {
  return stepIndex + 1;
}

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
  maxReachedStep,
  categoryTaxonomy,
  locationTaxonomy,
  featuresAndAmenities,
  propertyDetails,
  title,
  stickyLayout,
  stickyTopOffset,
  draftId,
  onPrevious,
  onNext,
  onSubmit,
  onDraft,
  isDraftLoading = false,
  isSubmitting,
  isSubmitLoading = false,
  onUploadOwnerDocument,
  onOwnerDocumentsChange,
  onRemoveOwnerDocument,
  onUploadPropertyMedia,
  onPropertyMediaChange,
  onRemovePropertyMedia,
  onUploadPropertyDocument,
  onPropertyDocumentsChange,
  onRemovePropertyDocument,
  onStepClick,
  canEdit = true,
  rejectionReason,
  ownerInfoConfig,
  pricingCurrency = "JOD",
  measurementUnit = "SQFT",
}: PropertyFormProps) {
  const mergedPropertyDetails = mergePropertyFormValues(propertyDetails);
  const basicInfoForm = useBasicInfoForm(mergedPropertyDetails.basic_info);
  const locationInsertForm = useLocationInsertForm(
    mergedPropertyDetails.location_insert,
  );
  const propertyDetailsForm = usePropertyDetailsForm(
    mergedPropertyDetails.property_details,
  );
  const ownerInfoForm = useOwnerInfoForm(
    mergedPropertyDetails.owner_info,
    ownerInfoConfig,
  );
  const pricingDetailsForm = usePricingDetailsForm(
    mergedPropertyDetails.pricing_details,
  );
  const amenitiesForm = useAmenitiesForm(mergedPropertyDetails.amenities);
  const mediaUploadForm = useMediaUploadForm(mergedPropertyDetails.media_upload);
  const [termsAcceptance, setTermsAcceptance] = useState<TermsAcceptanceFormValues>(
    () => mergedPropertyDetails.terms_acceptance,
  );
  const resolvedIsSubmitting = isSubmitting ?? isSubmitLoading;
  const [uploadingOwnerIndices, setUploadingOwnerIndices] = useState<Set<number>>(
    () => new Set(),
  );
  const [isPropertyMediaUploading, setIsPropertyMediaUploading] = useState(false);
  const [isPropertyDocumentUploading, setIsPropertyDocumentUploading] =
    useState(false);
  const isOwnerDocumentUploading = uploadingOwnerIndices.size > 0;
  const isFormLocked =
    isDraftLoading ||
    resolvedIsSubmitting ||
    isOwnerDocumentUploading ||
    isPropertyMediaUploading ||
    isPropertyDocumentUploading;

  const handlePropertyMediaUploadingChange = useCallback(
    (isUploading: boolean) => {
      setIsPropertyMediaUploading((previous) =>
        previous === isUploading ? previous : isUploading,
      );
    },
    [],
  );

  const handlePropertyDocumentUploadingChange = useCallback(
    (isUploading: boolean) => {
      setIsPropertyDocumentUploading((previous) =>
        previous === isUploading ? previous : isUploading,
      );
    },
    [],
  );

  const handleOwnerDocumentUploadingChange = useCallback(
    (ownerIndex: number, isUploading: boolean) => {
      setUploadingOwnerIndices((previous) => {
        if (isUploading) {
          if (previous.has(ownerIndex)) {
            return previous;
          }

          const next = new Set(previous);
          next.add(ownerIndex);
          return next;
        }

        if (!previous.has(ownerIndex)) {
          return previous;
        }

        const next = new Set(previous);
        next.delete(ownerIndex);
        return next;
      });
    },
    [],
  );
  const activeStepIndex = stepNumberToIndex(activeStep);
  const resolvedMaxReachedStepIndex =
    maxReachedStep != null
      ? Math.min(
          Math.max(stepNumberToIndex(maxReachedStep), activeStepIndex),
          PROPERTY_FORM_STEP_COUNT - 1,
        )
      : activeStepIndex;
  const currentStep = propertyFormSteps[activeStepIndex];
  const syncedPropertyDetailsRef = useRef(
    serializePropertyFormValues(propertyDetails),
  );
  const loadedDraftIdRef = useRef(draftId);
  const hasHydratedRef = useRef(false);
  const localPayloadRef = useRef<PropertyFormValues>(propertyDetails);

  const applyFormsFromProps = (details: PropertyFormValues) => {
    const nextValues = mergePropertyFormValues(details);
    basicInfoForm.setValues(nextValues.basic_info);
    locationInsertForm.setValues(nextValues.location_insert);
    propertyDetailsForm.setValues(nextValues.property_details);
    ownerInfoForm.setValues(nextValues.owner_info);
    pricingDetailsForm.setValues(nextValues.pricing_details);
    amenitiesForm.setAmenitiesValues(
      normalizeAmenitiesFormValues(
        featuresAndAmenities,
        nextValues.basic_info.category_id,
        nextValues.basic_info.type_id,
        nextValues.amenities,
      ),
    );
    mediaUploadForm.setValues(nextValues.media_upload);
    setTermsAcceptance(nextValues.terms_acceptance);
  };

  useEffect(() => {
    const incomingSerialized = serializePropertyFormValues(propertyDetails);
    const draftChanged =
      draftId !== undefined && draftId !== loadedDraftIdRef.current;

    if (!hasHydratedRef.current || draftChanged) {
      hasHydratedRef.current = true;
      if (draftId !== undefined) {
        loadedDraftIdRef.current = draftId;
      }
      syncedPropertyDetailsRef.current = incomingSerialized;
      applyFormsFromProps(propertyDetails);
      return;
    }

    if (incomingSerialized === syncedPropertyDetailsRef.current) {
      return;
    }

    const localSerialized = serializePropertyFormValues(localPayloadRef.current);
    if (incomingSerialized === localSerialized) {
      syncedPropertyDetailsRef.current = incomingSerialized;
      return;
    }
  }, [propertyDetails, draftId]);

  const categoryId = basicInfoForm.values.category_id;
  const propertyTypeId = basicInfoForm.values.type_id;

  const ownerInfoValidationOptions = useMemo(
    () => ({
      requireDocuments: ownerInfoConfig?.requireDocuments,
      validationMessages: ownerInfoConfig?.validationMessages,
    }),
    [ownerInfoConfig?.requireDocuments, ownerInfoConfig?.validationMessages],
  );

  const isOwnerStepComplete = useMemo(
    () =>
      validateOwnerInfoFormValues(ownerInfoForm.values, ownerInfoValidationOptions)
        .isValid,
    [ownerInfoForm.values, ownerInfoValidationOptions],
  );

  const isMediaStepComplete = useMemo(
    () =>
      Object.keys(validateMediaUploadFormValues(mediaUploadForm.values)).length ===
      0,
    [mediaUploadForm.values],
  );

  const isNextDisabled =
    (activeStepIndex === OWNER_INFO_STEP_INDEX && !isOwnerStepComplete) ||
    (activeStepIndex === MEDIA_STEP_INDEX && !isMediaStepComplete);

  useEffect(() => {
    if (activeStepIndex !== MEDIA_STEP_INDEX) {
      return;
    }

    const formErrors = validateMediaUploadFormValues(mediaUploadForm.values);
    mediaUploadForm.setErrors(formErrors);
    mediaUploadForm.setTouched((previous) => ({
      ...previous,
      media_files: true,
    }));
  }, [
    activeStepIndex,
    mediaUploadForm.setErrors,
    mediaUploadForm.setTouched,
    mediaUploadForm.values,
  ]);

  const isSubmitReady = useMemo(
    () =>
      isPropertyFormSubmittable({
        basicInfo: basicInfoForm.values,
        location: locationInsertForm.values,
        propertyDetails: propertyDetailsForm.values,
        ownerInfo: ownerInfoForm.values,
        pricing: pricingDetailsForm.values,
        amenities: amenitiesForm.values,
        media: mediaUploadForm.values,
        termsAcceptance,
        categoryId,
        propertyTypeId,
        featuresAndAmenities,
        ownerInfoConfig,
      }),
    [
      amenitiesForm.values,
      basicInfoForm.values,
      categoryId,
      featuresAndAmenities,
      locationInsertForm.values,
      mediaUploadForm.values,
      ownerInfoConfig,
      ownerInfoForm.values,
      pricingDetailsForm.values,
      propertyDetailsForm.values,
      propertyTypeId,
      termsAcceptance,
    ],
  );

  const isSubmitDisabled = !canEdit || !isSubmitReady;

  const buildFormValues = (): PropertyFormValues => {
    const amenitiesCatalog = getFilteredFeaturesAndAmenitiesCatalog(
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
    );
    const nextSelectedAmenities = pruneAmenitiesSelectionForTaxonomy(
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
      amenitiesForm.values.selected_amenities,
      amenitiesForm.values.feature_ids,
    );

    return {
      basic_info: basicInfoForm.values,
      location_insert: locationInsertForm.values,
      property_details: propertyDetailsForm.values,
      owner_info: ownerInfoForm.values,
      pricing_details: pricingDetailsForm.values,
      amenities: {
        selected_amenities: nextSelectedAmenities,
        feature_ids: deriveFeatureIdsFromNames(
          amenitiesCatalog,
          nextSelectedAmenities,
        ),
      },
      media_upload: mediaUploadForm.values,
      terms_acceptance: termsAcceptance,
    };
  };

  const buildPropertyFormPayload = (): PropertyFormValues => {
    const resolvedMaxReachedStepNumber =
      maxReachedStep != null
        ? clampStepNumber(maxReachedStep)
        : clampStepNumber(activeStep);

    return {
      active_step: clampStepNumber(activeStep),
      max_reached_step: Math.max(
        resolvedMaxReachedStepNumber,
        clampStepNumber(activeStep),
      ),
      ...buildFormValues(),
    };
  };

  const emitPropertyFormPayload = () => {
    const payload = buildPropertyFormPayload();
    localPayloadRef.current = payload;
    syncedPropertyDetailsRef.current = serializePropertyFormValues(payload);
    return payload;
  };

  localPayloadRef.current = buildPropertyFormPayload();

  useEffect(() => {
    if (!canEdit || typeof window === "undefined") {
      return;
    }

    const hasUnsavedChanges = () =>
      serializePropertyFormValues(localPayloadRef.current) !==
      syncedPropertyDetailsRef.current;
    const message = "You have unsaved property draft changes. Leave without saving?";

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges()) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      if (!hasUnsavedChanges()) {
        return;
      }

      if (!window.confirm(message)) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [canEdit]);

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
    const amenitiesCatalog = getFilteredFeaturesAndAmenitiesCatalog(
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
    );
    const nextSelected = pruneAmenitiesSelectionForTaxonomy(
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
      amenitiesForm.values.selected_amenities,
      amenitiesForm.values.feature_ids,
    );
    const nextFeatureIds = deriveFeatureIdsFromNames(
      amenitiesCatalog,
      nextSelected,
    );

    if (
      !areAmenitiesSelectionsEqual(
        amenitiesForm.values.selected_amenities,
        nextSelected,
      ) ||
      !areAmenitiesSelectionsEqual(
        (amenitiesForm.values.feature_ids ?? []).map(String),
        nextFeatureIds.map(String),
      )
    ) {
      amenitiesForm.setAmenitiesValues({
        selected_amenities: nextSelected,
        feature_ids: nextFeatureIds,
      });
    }

    const formErrors = validateAmenitiesFormValuesForTaxonomy(
      {
        ...amenitiesForm.values,
        selected_amenities: nextSelected,
        feature_ids: nextFeatureIds,
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
    if (activeStepIndex === 0) {
      return validateBasicInfoStep();
    }

    if (activeStepIndex === LOCATION_STEP_INDEX) {
      return validateLocationInsertStep();
    }

    if (activeStepIndex === PROPERTY_DETAILS_STEP_INDEX) {
      return validatePropertyDetailsStep();
    }

    if (activeStepIndex === OWNER_INFO_STEP_INDEX) {
      return validateOwnerInfoStep();
    }

    if (activeStepIndex === PRICING_STEP_INDEX) {
      return validatePricingDetailsStep();
    }

    if (activeStepIndex === AMENITIES_STEP_INDEX) {
      return validateAmenitiesStep();
    }

    if (activeStepIndex === MEDIA_STEP_INDEX) {
      return validateMediaUploadStep();
    }

    return true;
  };

  const handleNext = () => {
    if (isFormLocked) {
      return;
    }

    if (!validateActiveStep()) {
      return;
    }

    onNext?.(emitPropertyFormPayload());
  };

  const handleDraft = () => {
    if (isFormLocked || !canEdit) {
      return;
    }

    onDraft?.(emitPropertyFormPayload());
  };

  const validateAllSteps = () => {
    return [
      validateBasicInfoStep(),
      validateLocationInsertStep(),
      validatePropertyDetailsStep(),
      validateOwnerInfoStep(),
      validatePricingDetailsStep(),
      validateAmenitiesStep(),
      validateMediaUploadStep(),
    ].every(Boolean);
  };

  const handleSubmit = () => {
    if (isFormLocked || !canEdit || !isSubmitReady) {
      return;
    }

    if (!validateAllSteps()) {
      return;
    }

    onSubmit?.();
  };

  const handleStepClick = (index: number, step: PropertyFormStep) => {
    if (isFormLocked) {
      return;
    }

    if (
      index > AMENITIES_STEP_INDEX &&
      resolvedMaxReachedStepIndex <= AMENITIES_STEP_INDEX
    ) {
      return;
    }

    if (index > activeStepIndex && !validateActiveStep()) {
      return;
    }

    const stepNumber = stepIndexToNumber(index);
    const payload = emitPropertyFormPayload();

    if (index > activeStepIndex) {
      onStepClick?.(stepNumber, step, payload);
      return;
    }

    onStepClick?.(stepNumber, step, payload);
  };

  const reviewPropertyDetails = buildFormValues();
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
    stepContent = (
      <PropertyInfoForm
        form={propertyDetailsForm}
        measurementUnit={measurementUnit}
      />
    );
  } else if (currentStep?.value === "owners") {
    stepContent = (
      <OwnerInforForm
        form={ownerInfoForm}
        ownerInfoConfig={ownerInfoConfig}
        onUploadOwnerDocument={onUploadOwnerDocument}
        onOwnerDocumentsChange={onOwnerDocumentsChange}
        onRemoveOwnerDocument={onRemoveOwnerDocument}
        onOwnerDocumentUploadingChange={handleOwnerDocumentUploadingChange}
      />
    );
  } else if (currentStep?.value === "pricing") {
    stepContent = (
      <PricingInfoForm form={pricingDetailsForm} currency={pricingCurrency} />
    );
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
        onPropertyMediaChange={onPropertyMediaChange}
        onRemovePropertyMedia={onRemovePropertyMedia}
        onPropertyMediaUploadingChange={handlePropertyMediaUploadingChange}
        onUploadPropertyDocument={onUploadPropertyDocument}
        onPropertyDocumentsChange={onPropertyDocumentsChange}
        onRemovePropertyDocument={onRemovePropertyDocument}
        onPropertyDocumentUploadingChange={handlePropertyDocumentUploadingChange}
      />
    );
  } else if (currentStep?.value === "finalize") {
    stepContent = (
      <ReviewAndSubmitStep
        basicInfo={reviewPropertyDetails.basic_info!}
        location={reviewPropertyDetails.location_insert!}
        propertyDetails={reviewPropertyDetails.property_details!}
        ownerInfo={reviewPropertyDetails.owner_info!}
        pricing={reviewPropertyDetails.pricing_details!}
        amenities={reviewPropertyDetails.amenities!}
        media={reviewPropertyDetails.media_upload!}
        categoryTaxonomy={categoryTaxonomy}
        locationTaxonomy={locationTaxonomy.data}
        featuresAndAmenities={featuresAndAmenities}
        termsAcceptance={termsAcceptance}
        onTermsAcceptanceChange={setTermsAcceptance}
        canEdit={canEdit}
        pricingCurrency={pricingCurrency}
        measurementUnit={measurementUnit}
      />
    );
  }

  return (
    <FormLayout
      steps={propertyFormSteps}
      activeStep={activeStepIndex}
      maxReachedStep={resolvedMaxReachedStepIndex}
      title={title}
      stickyLayout={stickyLayout}
      stickyTopOffset={stickyTopOffset}
      onStepClick={handleStepClick}
      onPrevious={onPrevious}
      onNext={handleNext}
      onSubmit={onSubmit ? handleSubmit : undefined}
      onDraft={handleDraft}
      isDraftLoading={isDraftLoading}
      isSubmitting={resolvedIsSubmitting}
      canEdit={canEdit}
      rejectionReason={rejectionReason}
      isFormLocked={isFormLocked}
      isNextDisabled={isNextDisabled}
      isSubmitDisabled={isSubmitDisabled}
    >
      {stepContent}
    </FormLayout>
  );
}

export type {
  OwnerInfoConfig,
  OwnerInfoValidationMessages,
  PropertyFormProps,
  PropertyFormStep,
  PropertyFormValues,
  TermsAcceptanceFormValues,
} from "./types";
