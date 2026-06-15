"use client";

import { useCallback, useRef } from "react";
import {
  amenityOptions,
  toggleCatalogSelection,
} from "../components/PropertyForm/amenitiesFormOptions";
import type { AmenitiesFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { AmenitiesFormValues };
export { amenityOptions };

export function validateAmenitiesFormValues(formValues: AmenitiesFormValues) {
  void formValues;
  return {};
}

export function useAmenitiesForm(initialValues?: Partial<AmenitiesFormValues>) {
  const form = useForm<AmenitiesFormValues>({
    initialValues: {
      selected_amenities: [],
      feature_ids: [],
      ...initialValues,
    },
    validate: validateAmenitiesFormValues,
  });

  const valuesRef = useRef(form.values);
  valuesRef.current = form.values;

  const setAmenitiesValues = useCallback(
    (values: Partial<AmenitiesFormValues>) => {
      form.setValues({
        ...valuesRef.current,
        ...values,
      });
    },
    [form],
  );

  const setSelectedAmenities = useCallback((selectedAmenities: string[]) => {
    setAmenitiesValues({ selected_amenities: selectedAmenities });
  }, [setAmenitiesValues]);

  const toggleSelection = useCallback(
    (name: string, checked: boolean, featureId?: number) => {
      const nextSelected = toggleCatalogSelection(
        valuesRef.current.selected_amenities,
        name,
        checked,
      );
      const currentFeatureIds = valuesRef.current.feature_ids ?? [];
      const nextFeatureIds =
        featureId == null
          ? currentFeatureIds
          : checked
            ? currentFeatureIds.includes(featureId)
              ? currentFeatureIds
              : [...currentFeatureIds, featureId]
            : currentFeatureIds.filter((id) => id !== featureId);

      setAmenitiesValues({
        selected_amenities: nextSelected,
        feature_ids: nextFeatureIds,
      });
    },
    [setAmenitiesValues],
  );

  const submit = (onValid?: (values: AmenitiesFormValues) => void) => {
    form.setTouched({ selected_amenities: true });

    const formErrors = validateAmenitiesFormValues(valuesRef.current);
    form.setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      onValid?.(valuesRef.current);
      return true;
    }

    return false;
  };

  return {
    ...form,
    setAmenitiesValues,
    setSelectedAmenities,
    toggleSelection,
    submit,
  };
}

export type UseAmenitiesFormReturn = ReturnType<typeof useAmenitiesForm>;
