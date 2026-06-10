"use client";

import type { PricingDetailsFormValues } from "../components/PropertyForm/types";
import { useForm } from "./useFormHook";

export type { PricingDetailsFormValues };

export function validatePricingDetailsFormValues(
  formValues: PricingDetailsFormValues,
) {
  void formValues;
  return {};
}

export function usePricingDetailsForm(
  initialValues?: Partial<PricingDetailsFormValues>,
) {
  const form = useForm<PricingDetailsFormValues>({
    initialValues: {
      price: "",
      service_charge: "",
      maintenance_fee: "",
      ...initialValues,
    },
    validate: validatePricingDetailsFormValues,
  });

  const submit = (onValid?: (values: PricingDetailsFormValues) => void) => {
    const allTouched = {
      price: true,
      service_charge: true,
      maintenance_fee: true,
    };

    form.setTouched(allTouched);

    const formErrors = validatePricingDetailsFormValues(form.values);
    form.setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      onValid?.(form.values);
      return true;
    }

    return false;
  };

  return {
    ...form,
    submit,
  };
}

export type UsePricingDetailsFormReturn = ReturnType<
  typeof usePricingDetailsForm
>;
