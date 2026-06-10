"use client";

import type { LocationInsertFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { LocationInsertFormValues };

export function validateLocationInsertFormValues(
  formValues: LocationInsertFormValues,
) {
  const nextErrors: Partial<Record<keyof LocationInsertFormValues, string>> =
    {};

  if (!formValues.city_id) {
    nextErrors.city_id = "Please select city.";
  }
  if (!formValues.area_ids.length) {
    nextErrors.area_ids = "Please select at least one area.";
  }

  return nextErrors;
}

export function useLocationInsertForm(
  initialValues?: Partial<LocationInsertFormValues>,
) {
  return useForm<LocationInsertFormValues>({
    initialValues: {
      city_id: null,
      area_ids: [],
      address: "",
      ...initialValues,
    },
    validate: validateLocationInsertFormValues,
  });
}

export type UseLocationInsertFormReturn = ReturnType<
  typeof useLocationInsertForm
>;
