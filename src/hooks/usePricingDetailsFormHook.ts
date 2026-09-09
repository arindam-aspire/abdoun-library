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
      price_currency: "JOD",
      service_charge: "",
      service_charge_currency: "JOD",
      maintenance_fee: "",
      maintenance_fee_currency: "JOD",
      furnished_sale_price: "",
      unfurnished_sale_price: "",
      furnished_rent_price: "",
      unfurnished_rent_price: "",
      semi_furnished_rent_price: "",
      additional_prices: {},
      ...initialValues,
    },
    validate: validatePricingDetailsFormValues,
  });

  const submit = (onValid?: (values: PricingDetailsFormValues) => void) => {
    const allTouched = {
      price: true,
      price_currency: true,
      service_charge: true,
      service_charge_currency: true,
      maintenance_fee: true,
      maintenance_fee_currency: true,
      furnished_sale_price: true,
      unfurnished_sale_price: true,
      furnished_rent_price: true,
      unfurnished_rent_price: true,
      semi_furnished_rent_price: true,
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
