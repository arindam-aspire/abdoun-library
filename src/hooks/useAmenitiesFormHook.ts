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
      ...initialValues,
    },
    validate: validateAmenitiesFormValues,
  });

  const valuesRef = useRef(form.values);
  valuesRef.current = form.values;

  const setSelectedAmenities = useCallback((selectedAmenities: string[]) => {
    form.setValues({
      ...valuesRef.current,
      selected_amenities: selectedAmenities,
    });
  }, [form]);

  const toggleSelection = useCallback((name: string, checked: boolean) => {
    const nextSelected = toggleCatalogSelection(
      valuesRef.current.selected_amenities,
      name,
      checked,
    );

    form.setValues({
      ...valuesRef.current,
      selected_amenities: nextSelected,
    });
  }, [form]);

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
    setSelectedAmenities,
    toggleSelection,
    submit,
  };
}

export type UseAmenitiesFormReturn = ReturnType<typeof useAmenitiesForm>;
