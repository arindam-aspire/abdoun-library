"use client";

import type { PropertyDetailsFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { PropertyDetailsFormValues };

function hasTrimmedValue(value: string | number | null | undefined): boolean {
  return String(value ?? "").trim().length > 0;
}

const POSITIVE_DECIMAL_PATTERN = /^(?:\d+(?:\.\d+)?|\.\d+)$/;

export type PropertyDetailsValidationOptions = {
  requireFurnishing?: boolean;
  requireFloorLevel?: boolean;
  requirePermitDld?: boolean;
};

export function validatePropertyDetailsFormValues(
  formValues: PropertyDetailsFormValues,
  options?: PropertyDetailsValidationOptions,
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
  if (formValues.year_built == null) {
    nextErrors.year_built = "Year built is required.";
  } else if (
    !Number.isInteger(formValues.year_built) ||
    formValues.year_built < 1800 ||
    formValues.year_built > new Date().getFullYear() + 5
  ) {
    nextErrors.year_built = "Enter a valid year of construction.";
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
  if (options?.requireFurnishing !== false && !hasTrimmedValue(formValues.furnishing_status)) {
    nextErrors.furnishing_status = "Furnishing status is required.";
  }
  if (options?.requireFloorLevel !== false && !hasTrimmedValue(formValues.floor_level)) {
    nextErrors.floor_level = "Floor level is required.";
  }
  if (!hasTrimmedValue(formValues.orientation)) {
    nextErrors.orientation = "Orientation is required.";
  }
  if (options?.requirePermitDld && !formValues.permit_dld_number?.trim()) {
    nextErrors.permit_dld_number = "Permit / DLD number is required.";
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
      year_built: null,
      property_age: null,
      furnishing_status: null,
      floor_level: null,
      completion_status: null,
      total_floor: "",
      occupancy: null,
      ownership_type: null,
      reference_number: "",
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
