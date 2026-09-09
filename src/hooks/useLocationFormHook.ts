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
  if (formValues.area_id == null) {
    nextErrors.area_id = "Please select an area.";
  }

  return nextErrors;
}

export function useLocationInsertForm(
  initialValues?: Partial<LocationInsertFormValues>,
) {
  return useForm<LocationInsertFormValues>({
    initialValues: {
      city_id: null,
      area_id: null,
      area_ids: [],
      address: "",
      latitude: null,
      longitude: null,
      apartment_number: "",
      plot_number: "",
      basin_number: "",
      parcel_number: "",
      building_number: "",
      identification_fields: {},
      ...initialValues,
    },
    validate: validateLocationInsertFormValues,
  });
}

export type UseLocationInsertFormReturn = ReturnType<
  typeof useLocationInsertForm
>;
