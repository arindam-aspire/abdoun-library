"use client";

import type { PropertyDetailsFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { PropertyDetailsFormValues };

function hasTrimmedValue(value: string | number | null | undefined): boolean {
  return String(value ?? "").trim().length > 0;
}

const POSITIVE_DECIMAL_PATTERN = /^(?:\d+(?:\.\d+)?|\.\d+)$/;

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
  const builtUpArea = formValues.built_up_area.trim();
  if (!builtUpArea) {
    nextErrors.built_up_area = "Built-up area is required.";
  } else if (
    !POSITIVE_DECIMAL_PATTERN.test(builtUpArea) ||
    !Number.isFinite(Number(builtUpArea)) ||
    Number(builtUpArea) <= 0
  ) {
    nextErrors.built_up_area = "Enter a valid positive built-up area.";
  }
  if (formValues.parking_spaces == null) {
    nextErrors.parking_spaces = "Parking spaces is required.";
  }
  if (!hasTrimmedValue(formValues.property_age)) {
    nextErrors.property_age = "Property age is required.";
  }
  if (!hasTrimmedValue(formValues.completion_status)) {
    nextErrors.completion_status = "Completion status is required.";
  }
  if (!formValues.total_floor.trim()) {
    nextErrors.total_floor = "Total floor is required.";
  } else if (Number(formValues.total_floor) < 0) {
    nextErrors.total_floor = "Total floor cannot be negative.";
  }
  if (!hasTrimmedValue(formValues.occupancy)) {
    nextErrors.occupancy = "Occupancy is required.";
  }
  if (!hasTrimmedValue(formValues.ownership_type)) {
    nextErrors.ownership_type = "Ownership type is required.";
  }
  if (!formValues.reference_number.trim()) {
    nextErrors.reference_number = "Reference number is required.";
  }
  if (!formValues.permit_dld_number.trim()) {
    nextErrors.permit_dld_number = "Permit / DLD number is required.";
  }
  if (!hasTrimmedValue(formValues.orientation)) {
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
      built_up_area_unit: "SQM",
      parking_spaces: null,
      property_age: null,
      completion_status: null,
      total_floor: "",
      occupancy: null,
      ownership_type: null,
      reference_number: "",
      permit_dld_number: "",
      orientation: null,
      guard_name: "",
      guard_country_code: "+962",
      guard_phone_number: "",
      ...initialValues,
    },
    validate: validatePropertyDetailsFormValues,
  });
}

export type UsePropertyDetailsFormReturn = ReturnType<
  typeof usePropertyDetailsForm
>;
