"use client";

import {
  validatePricingDetailsFormValues,
  type UsePricingDetailsFormReturn,
} from "../../hooks/usePricingDetailsFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { PriceInput } from "../ui/PriceInput";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
} from "./propertyFormFieldLayout";
import type { PricingDetailsFormValues } from "./types";

const PRICING_TITLE = "Pricing Details";
const PRICING_SUBTITLE =
  "Set the listing price and any recurring fees for this property.";
const PRICING_BADGE_LABEL = "Required";

export interface PricingInfoFormProps {
  form: UsePricingDetailsFormReturn;
  currency?: string;
  className?: string;
}

export function PricingInfoForm({
  form,
  currency = "JOD",
  className,
}: PricingInfoFormProps) {
  const updateField = (
    field: keyof PricingDetailsFormValues,
    value: string,
  ) => {
    form.setValues({
      ...form.values,
      [field]: value,
    });
  };

  const markFieldTouched = (field: keyof PricingDetailsFormValues) => {
    form.setTouched((previous) => ({ ...previous, [field]: true }));
    form.setErrors(validatePricingDetailsFormValues(form.values));
  };

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

      <PriceInput
        name="price"
        label="Price"
        placeholder="0"
        value={form.values.price}
        onChange={(value) => updateField("price", value)}
        onBlur={() => markFieldTouched("price")}
        error={form.errors.price}
        currency={currency}
        currencyPosition="end"
        allowDecimals={false}
        fullWidth
        className={propertyFormGridSpanClasses}
      />

      <PriceInput
        name="service_charge"
        label="Service Charge"
        placeholder="0"
        value={form.values.service_charge}
        onChange={(value) => updateField("service_charge", value)}
        onBlur={() => markFieldTouched("service_charge")}
        error={form.errors.service_charge}
        currency={currency}
        currencyPosition="end"
        allowDecimals={false}
        fullWidth
      />

      <PriceInput
        name="maintenance_fee"
        label="Maintenance Fee"
        placeholder="0"
        value={form.values.maintenance_fee}
        onChange={(value) => updateField("maintenance_fee", value)}
        onBlur={() => markFieldTouched("maintenance_fee")}
        error={form.errors.maintenance_fee}
        currency={currency}
        currencyPosition="end"
        allowDecimals={false}
        fullWidth
      />
    </form>
  );
}
