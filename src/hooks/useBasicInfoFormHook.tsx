"use client";

import type { BasicInfoFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { BasicInfoFormValues };

export function validateBasicInfoFormValues(formValues: BasicInfoFormValues) {
  const nextErrors: Partial<Record<keyof BasicInfoFormValues, string>> = {};

  if (!formValues.title.trim()) {
    nextErrors.title = "Please enter property title.";
  }
  if (!formValues.listing_purpose) {
    nextErrors.listing_purpose = "Please select listing purpose.";
  }
  if (formValues.category_id == null) {
    nextErrors.category_id = "Please select category.";
  }
  if (formValues.type_id == null) {
    nextErrors.type_id = "Please select property type.";
  }

  return nextErrors;
}

export function useBasicInfoForm(initialValues?: Partial<BasicInfoFormValues>) {
  return useForm<BasicInfoFormValues>({
    initialValues: {
      title: "",
      description: "",
      listing_purpose: "sale",
      category_id: null,
      type_id: null,
      ...initialValues,
    },
    validate: validateBasicInfoFormValues,
  });
}

export type UseBasicInfoFormReturn = ReturnType<typeof useBasicInfoForm>;
