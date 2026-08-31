"use client";

import {
  validatePricingDetailsFormValues,
  type UsePricingDetailsFormReturn,
} from "../../hooks/usePricingDetailsFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { PriceInput } from "../ui/PriceInput";
import { SelectDropdown } from "../ui/SelectDropdown";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
} from "./propertyFormFieldLayout";
import type { PricingCurrency, PricingDetailsFormValues } from "./types";

const PRICING_TITLE = "Pricing Details";
const PRICING_SUBTITLE =
  "Set the listing price and any recurring fees for this property.";
const PRICING_BADGE_LABEL = "Required";

const pricingCurrencyOptions = [
  { value: "JOD", label: "JOD" },
  { value: "USD", label: "USD" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
] as const;

function isPricingCurrency(value: string): value is PricingCurrency {
  return pricingCurrencyOptions.some((option) => option.value === value);
}

export interface PricingInfoFormProps {
  form: UsePricingDetailsFormReturn;
  className?: string;
}

export function PricingInfoForm({ form, className }: PricingInfoFormProps) {
  const updateField = (
    field: keyof PricingDetailsFormValues,
    value: string,
  ) => {
    form.setValues({
      ...form.values,
      [field]: value,
    });
  };

  const updatePriceCurrency = (value: string) => {
    if (!isPricingCurrency(value)) {
      return;
    }

    form.setValues({
      ...form.values,
      price_currency: value,
      service_charge_currency: value,
      maintenance_fee_currency: value,
    });
  };

  const updateFeeCurrency = (
    field: "service_charge_currency" | "maintenance_fee_currency",
    value: string,
  ) => {
    if (!isPricingCurrency(value)) {
      return;
    }

    form.setValues({
      ...form.values,
      [field]: value,
    });
  };

  const markFieldTouched = (field: keyof PricingDetailsFormValues) => {
    form.setTouched((previous) => ({ ...previous, [field]: true }));
    form.setErrors(validatePricingDetailsFormValues(form.values));
  };

  const pricingFieldRowClasses =
    "grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(7.5rem,0.45fr)] sm:gap-3";

  return (
    <form
      className={cn(propertyFormGridClasses, className)}
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <header
        className={cn(propertyFormGridSpanClasses, "flex flex-col gap-1.5")}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            className={cn(
              "min-w-0 font-bold text-secondary",
              textPageTitleClasses,
            )}
          >
            {PRICING_TITLE}
          </h2>
          <Badge variant="exclusive" appearance="solid" className="shrink-0">
            {PRICING_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>{PRICING_SUBTITLE}</p>
      </header>

      <div className={cn(propertyFormGridSpanClasses, pricingFieldRowClasses)}>
        <PriceInput
          name="price"
          label="Price"
          placeholder="0"
          value={form.values.price}
          onChange={(value) => updateField("price", value)}
          onBlur={() => markFieldTouched("price")}
          error={form.errors.price}
          showCurrency={false}
          allowDecimals={false}
          fullWidth
        />
        <SelectDropdown
          name="price_currency"
          label="Currency"
          placeholder="Select currency"
          options={[...pricingCurrencyOptions]}
          value={form.values.price_currency}
          onChange={updatePriceCurrency}
          fullWidth
        />
      </div>

      <div className={cn(propertyFormGridSpanClasses, pricingFieldRowClasses)}>
        <PriceInput
          name="service_charge"
          label="Service Charge"
          placeholder="0"
          value={form.values.service_charge}
          onChange={(value) => updateField("service_charge", value)}
          onBlur={() => markFieldTouched("service_charge")}
          error={form.errors.service_charge}
          showCurrency={false}
          allowDecimals={false}
          fullWidth
        />
        <SelectDropdown
          name="service_charge_currency"
          label="Currency"
          placeholder="Select currency"
          options={[...pricingCurrencyOptions]}
          value={form.values.service_charge_currency}
          onChange={(value) =>
            updateFeeCurrency("service_charge_currency", value)
          }
          fullWidth
        />
      </div>

      <div className={cn(propertyFormGridSpanClasses, pricingFieldRowClasses)}>
        <PriceInput
          name="maintenance_fee"
          label="Maintenance Fee"
          placeholder="0"
          value={form.values.maintenance_fee}
          onChange={(value) => updateField("maintenance_fee", value)}
          onBlur={() => markFieldTouched("maintenance_fee")}
          error={form.errors.maintenance_fee}
          showCurrency={false}
          allowDecimals={false}
          fullWidth
        />
        <SelectDropdown
          name="maintenance_fee_currency"
          label="Currency"
          placeholder="Select currency"
          options={[...pricingCurrencyOptions]}
          value={form.values.maintenance_fee_currency}
          onChange={(value) =>
            updateFeeCurrency("maintenance_fee_currency", value)
          }
          fullWidth
        />
      </div>
    </form>
  );
}
