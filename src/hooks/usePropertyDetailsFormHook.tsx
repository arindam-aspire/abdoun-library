"use client";

import type { PropertyDetailsFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { PropertyDetailsFormValues };

export function validatePropertyDetailsFormValues(
  formValues: PropertyDetailsFormValues,
) {
  const nextErrors: Partial<Record<keyof PropertyDetailsFormValues, string>> =
    {};

  if (formValues.bedrooms == null) {
    nextErrors.bedrooms = "Bedrooms is required.";
  }
  if (formValues.bathrooms == null) {
    nextErrors.bathrooms = "Bathrooms is required.";
  }
  if (!formValues.built_up_area.trim()) {
    nextErrors.built_up_area = "Built-up area is required.";
  } else if (Number(formValues.built_up_area) < 0) {
    nextErrors.built_up_area = "Built-up area cannot be negative.";
  }
  if (formValues.parking_spaces == null) {
    nextErrors.parking_spaces = "Parking spaces is required.";
  }
  if (!formValues.property_age?.trim()) {
    nextErrors.property_age = "Property age is required.";
  }
  if (!formValues.completion_status?.trim()) {
    nextErrors.completion_status = "Completion status is required.";
  }
  if (!formValues.total_floor.trim()) {
    nextErrors.total_floor = "Total floor is required.";
  } else if (Number(formValues.total_floor) < 0) {
    nextErrors.total_floor = "Total floor cannot be negative.";
  }
  if (!formValues.occupancy?.trim()) {
    nextErrors.occupancy = "Occupancy is required.";
  }
  if (!formValues.ownership_type?.trim()) {
    nextErrors.ownership_type = "Ownership type is required.";
  }
  if (!formValues.reference_number.trim()) {
    nextErrors.reference_number = "Reference number is required.";
  }
  if (!formValues.permit_dld_number.trim()) {
    nextErrors.permit_dld_number = "Permit / DLD number is required.";
  }
  if (!formValues.orientation?.trim()) {
    nextErrors.orientation = "Orientation is required.";
  }

  return nextErrors;
}

export function usePropertyDetailsForm(
  initialValues?: Partial<PropertyDetailsFormValues>,
) {
  return useForm<PropertyDetailsFormValues>({
    initialValues: {
      bedrooms: null,
      bathrooms: null,
      built_up_area: "",
      parking_spaces: null,
      property_age: null,
      completion_status: null,
      total_floor: "",
      occupancy: null,
      ownership_type: null,
      reference_number: "",
      permit_dld_number: "",
      orientation: null,
      ...initialValues,
    },
    validate: validatePropertyDetailsFormValues,
  });
}

export type UsePropertyDetailsFormReturn = ReturnType<
  typeof usePropertyDetailsForm
>;
