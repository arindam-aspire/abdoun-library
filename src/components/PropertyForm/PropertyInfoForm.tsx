"use client";

import {
  validatePropertyDetailsFormValues,
  type UsePropertyDetailsFormReturn,
} from "../../hooks/usePropertyDetailsFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import {
  bathroomOptions,
  bedroomOptions,
  completionStatusOptions,
  occupancyOptions,
  orientationOptions,
  ownershipTypeOptions,
  parkingSpaceOptions,
  propertyAgeOptions,
} from "./propertyDetailsFormOptions";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
} from "./propertyFormFieldLayout";
import type { PropertyDetailsFormValues } from "./types";

const PROPERTY_DETAILS_TITLE = "Property Information";
const PROPERTY_DETAILS_SUBTITLE =
  "Enter the primary legal property details for this property record. This information will be used for official ledger entries and contract generation.";
const PROPERTY_DETAILS_BADGE_LABEL = "Required";

function parseSelectNumber(value: string): number | null {
  if (value === SELECT_DROPDOWN_EMPTY_VALUE || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseSelectString(value: string): string | null {
  if (value === SELECT_DROPDOWN_EMPTY_VALUE || value === "") {
    return null;
  }

  return value;
}

function sanitizeNonNegativeInteger(value: string): string {
  return value.replace(/\D/g, "");
}

function syncFieldErrors(
  form: UsePropertyDetailsFormReturn,
  nextValues: PropertyDetailsFormValues,
  fields: (keyof PropertyDetailsFormValues)[],
) {
  const validation = validatePropertyDetailsFormValues(nextValues);

  form.setErrors((previous) => {
    const next = { ...previous };

    for (const field of fields) {
      if (validation[field]) {
        next[field] = validation[field];
      } else {
        delete next[field];
      }
    }

    return next;
  });
}

export interface PropertyInfoFormProps {
  form: UsePropertyDetailsFormReturn;
  measurementUnit?: "SQFT" | "SQM";
  className?: string;
}

function builtUpAreaLabel(measurementUnit: "SQFT" | "SQM"): string {
  return measurementUnit === "SQM"
    ? "Built-up Area (sq. m.)"
    : "Built-up Area (sq.ft.)";
}

export function PropertyInfoForm({
  form,
  measurementUnit = "SQFT",
  className,
}: PropertyInfoFormProps) {
  const markFieldTouched = (field: keyof PropertyDetailsFormValues) => {
    form.setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const validateField = (
    field: keyof PropertyDetailsFormValues,
    nextValues = form.values,
  ) => {
    markFieldTouched(field);
    syncFieldErrors(form, nextValues, [field]);
  };

  const validateSelectField = (
    field: keyof PropertyDetailsFormValues,
    nextValues = form.values,
  ) => {
    validateField(field, nextValues);
  };

  const updateNumberSelect = (
    field: "bedrooms" | "bathrooms" | "parking_spaces",
    value: string,
  ) => {
    const nextValues = {
      ...form.values,
      [field]: parseSelectNumber(value),
    };
    form.setValues(nextValues);
    markFieldTouched(field);
    syncFieldErrors(form, nextValues, [field]);
  };

  const updateStringSelect = (
    field:
      | "property_age"
      | "completion_status"
      | "occupancy"
      | "ownership_type"
      | "orientation",
    value: string,
  ) => {
    const nextValues = {
      ...form.values,
      [field]: parseSelectString(value),
    };
    form.setValues(nextValues);
    markFieldTouched(field);
    syncFieldErrors(form, nextValues, [field]);
  };

  const numberSelectValue = (value: number | null) =>
    value != null ? String(value) : SELECT_DROPDOWN_EMPTY_VALUE;

  const stringSelectValue = (value: string | number | null | undefined) =>
    value == null ? SELECT_DROPDOWN_EMPTY_VALUE : String(value);

  const updateNonNegativeIntegerField = (
    field: "built_up_area" | "total_floor",
    value: string,
  ) => {
    const nextValues = {
      ...form.values,
      [field]: sanitizeNonNegativeInteger(value),
    };

    form.setValues(nextValues);

    if (form.touched[field]) {
      syncFieldErrors(form, nextValues, [field]);
    }
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
            {PROPERTY_DETAILS_TITLE}
          </h2>
          <Badge variant="exclusive" appearance="solid" className="shrink-0">
            {PROPERTY_DETAILS_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>
          {PROPERTY_DETAILS_SUBTITLE}
        </p>
      </header>

      <SelectDropdown
        name="bedrooms"
        label="Bedrooms"
        placeholder="Select bedrooms"
        options={bedroomOptions}
        value={numberSelectValue(form.values.bedrooms)}
        onChange={(value) => updateNumberSelect("bedrooms", value)}
        onBlur={() => validateSelectField("bedrooms")}
        error={form.errors.bedrooms}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="bathrooms"
        label="Bathrooms"
        placeholder="Select bathrooms"
        options={bathroomOptions}
        value={numberSelectValue(form.values.bathrooms)}
        onChange={(value) => updateNumberSelect("bathrooms", value)}
        onBlur={() => validateSelectField("bathrooms")}
        error={form.errors.bathrooms}
        isRequired
        fullWidth
      />
      <Input
        name="built_up_area"
        label={builtUpAreaLabel(measurementUnit)}
        placeholder="Enter built-up area"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={form.values.built_up_area}
        onChange={(event) =>
          updateNonNegativeIntegerField("built_up_area", event.target.value)
        }
        onBlur={() => validateField("built_up_area")}
        error={form.errors.built_up_area}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="parking_spaces"
        label="Parking Spaces"
        placeholder="Select parking spaces"
        options={parkingSpaceOptions}
        value={numberSelectValue(form.values.parking_spaces)}
        onChange={(value) => updateNumberSelect("parking_spaces", value)}
        onBlur={() => validateSelectField("parking_spaces")}
        error={form.errors.parking_spaces}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="property_age"
        label="Property Age"
        placeholder="Select property age"
        options={propertyAgeOptions}
        value={stringSelectValue(form.values.property_age)}
        onChange={(value) => updateStringSelect("property_age", value)}
        onBlur={() => validateSelectField("property_age")}
        error={form.errors.property_age}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="completion_status"
        label="Completion Status"
        placeholder="Select completion status"
        options={completionStatusOptions}
        value={stringSelectValue(form.values.completion_status)}
        onChange={(value) => updateStringSelect("completion_status", value)}
        onBlur={() => validateSelectField("completion_status")}
        error={form.errors.completion_status}
        isRequired
        fullWidth
      />
      <Input
        name="total_floor"
        label="Total Floor"
        placeholder="Enter total floor"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={form.values.total_floor}
        onChange={(event) =>
          updateNonNegativeIntegerField("total_floor", event.target.value)
        }
        onBlur={() => validateField("total_floor")}
        error={form.errors.total_floor}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="occupancy"
        label="Occupancy"
        placeholder="Select occupancy"
        options={occupancyOptions}
        value={stringSelectValue(form.values.occupancy)}
        onChange={(value) => updateStringSelect("occupancy", value)}
        onBlur={() => validateSelectField("occupancy")}
        error={form.errors.occupancy}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="ownership_type"
        label="Ownership Type"
        placeholder="Select ownership type"
        options={ownershipTypeOptions}
        value={stringSelectValue(form.values.ownership_type)}
        onChange={(value) => updateStringSelect("ownership_type", value)}
        onBlur={() => validateSelectField("ownership_type")}
        error={form.errors.ownership_type}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="orientation"
        label="Orientation"
        placeholder="Select orientation"
        options={orientationOptions}
        value={stringSelectValue(form.values.orientation)}
        onChange={(value) => updateStringSelect("orientation", value)}
        onBlur={() => validateSelectField("orientation")}
        error={form.errors.orientation}
        isRequired
        fullWidth
      />
      <Input
        name="reference_number"
        label="Reference Number"
        placeholder="Enter reference number"
        value={form.values.reference_number}
        onChange={(event) => {
          const nextValues = {
            ...form.values,
            reference_number: event.target.value,
          };
          form.setValues(nextValues);

          if (form.touched.reference_number) {
            syncFieldErrors(form, nextValues, ["reference_number"]);
          }
        }}
        onBlur={() => validateField("reference_number")}
        error={form.errors.reference_number}
        isRequired
        fullWidth
      />
      <Input
        name="permit_dld_number"
        label="Permit / DLD Number"
        placeholder="Enter permit / DLD number"
        value={form.values.permit_dld_number}
        onChange={(event) => {
          const nextValues = {
            ...form.values,
            permit_dld_number: event.target.value,
          };
          form.setValues(nextValues);

          if (form.touched.permit_dld_number) {
            syncFieldErrors(form, nextValues, ["permit_dld_number"]);
          }
        }}
        onBlur={() => validateField("permit_dld_number")}
        error={form.errors.permit_dld_number}
        isRequired
        fullWidth
      />
    </form>
  );
}
