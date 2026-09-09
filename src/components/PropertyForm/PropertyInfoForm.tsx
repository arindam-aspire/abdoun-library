"use client";

import {
  validatePropertyDetailsFormValues,
  type UsePropertyDetailsFormReturn,
} from "../../hooks/usePropertyDetailsFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { PHONE_INPUT_COUNTRIES, PhoneInput } from "../ui/PhoneInput";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import {
  bathroomOptions,
  bedroomOptions,
  occupancyOptions,
  ownershipTypeOptions,
  parkingSpaceOptions,
} from "./propertyDetailsFormOptions";
import { resolvePropertyFormConfig } from "./propertyFormConfig";
import {
  getExternalFieldError,
  mergeFieldError,
  propertyFormFieldProps,
} from "./propertyFormErrors";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
} from "./propertyFormFieldLayout";
import type {
  BuiltUpAreaUnit,
  PropertyDetailsFormValues,
  PropertyFormFieldErrors,
  PropertyFormOption,
} from "./types";

const PROPERTY_DETAILS_TITLE = "Property Information";
const PROPERTY_DETAILS_SUBTITLE =
  "Enter the primary legal property details for this property record. This information will be used for official ledger entries and contract generation.";
const PROPERTY_DETAILS_BADGE_LABEL = "Required";

function dialCodeToIso2(dialCode: string): string {
  const match = PHONE_INPUT_COUNTRIES.find(
    (country) => country.dialCode === dialCode,
  );

  return match?.iso2 ?? "JO";
}

const builtUpAreaUnitOptions = [
  { value: "SQM", label: "sq. m." },
  { value: "SQFT", label: "sq. ft." },
];

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

function parseYearBuilt(value: string): number | null {
  const digits = sanitizeNonNegativeInteger(value);
  if (!digits) {
    return null;
  }

  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
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
  completionStatusOptions?: PropertyFormOption[];
  orientationOptions?: PropertyFormOption[];
  furnishingStatusOptions?: PropertyFormOption[];
  floorLevelOptions?: PropertyFormOption[];
  yearBuiltLabel?: string;
  yearBuiltPlaceholder?: string;
  floorLevelLabel?: string;
  furnishingStatusLabel?: string;
  enableLegacyPermitDld?: boolean;
  fieldErrors?: PropertyFormFieldErrors;
  className?: string;
}

export function PropertyInfoForm({
  form,
  completionStatusOptions,
  orientationOptions,
  furnishingStatusOptions,
  floorLevelOptions,
  yearBuiltLabel,
  yearBuiltPlaceholder,
  floorLevelLabel,
  furnishingStatusLabel,
  enableLegacyPermitDld = false,
  fieldErrors,
  className,
}: PropertyInfoFormProps) {
  const resolved = resolvePropertyFormConfig({
    completionStatusOptions,
    orientationOptions,
    furnishingStatusOptions,
    floorLevelOptions,
    yearBuiltLabel,
    yearBuiltPlaceholder,
    floorLevelLabel,
    furnishingStatusLabel,
  });
  const nextCompletionStatusOptions = resolved.completionStatusOptions;
  const nextOrientationOptions = resolved.orientationOptions;
  const nextFurnishingStatusOptions = resolved.furnishingStatusOptions;
  const nextFloorLevelOptions = resolved.floorLevelOptions;
  const nextYearBuiltLabel = resolved.yearBuiltLabel;
  const nextYearBuiltPlaceholder = resolved.yearBuiltPlaceholder;
  const nextFloorLevelLabel = resolved.floorLevelLabel;
  const nextFurnishingStatusLabel = resolved.furnishingStatusLabel;
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
      | "completion_status"
      | "occupancy"
      | "ownership_type"
      | "orientation"
      | "furnishing_status"
      | "floor_level",
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
    field: "total_floor",
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

  const updateBuiltUpArea = (value: string) => {
    const nextValues = {
      ...form.values,
      built_up_area: value,
    };

    form.setValues(nextValues);

    if (form.touched.built_up_area) {
      syncFieldErrors(form, nextValues, ["built_up_area"]);
    }
  };

  const updateBuiltUpAreaUnit = (value: string) => {
    if (value !== "SQM" && value !== "SQFT") {
      return;
    }

    form.setValues({
      ...form.values,
      built_up_area_unit: value as BuiltUpAreaUnit,
    });
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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(7.5rem,0.45fr)] sm:gap-3">
        <Input
          name="built_up_area"
          label="Built-up Area"
          placeholder="Enter built-up area"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={form.values.built_up_area}
          onChange={(event) => updateBuiltUpArea(event.target.value)}
          onBlur={() => validateField("built_up_area")}
          error={form.errors.built_up_area}
          isRequired
          fullWidth
        />
        <SelectDropdown
          name="built_up_area_unit"
          label="Unit"
          placeholder="Select unit"
          options={builtUpAreaUnitOptions}
          value={form.values.built_up_area_unit}
          onChange={updateBuiltUpAreaUnit}
          fullWidth
        />
      </div>
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
      <div {...propertyFormFieldProps("property_details.year_built")}>
        <Input
          name="year_built"
          label={nextYearBuiltLabel}
          placeholder={nextYearBuiltPlaceholder}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={form.values.year_built == null ? "" : String(form.values.year_built)}
          onChange={(event) => {
            const nextValues = {
              ...form.values,
              year_built: parseYearBuilt(event.target.value),
            };
            form.setValues(nextValues);
            if (form.touched.year_built) {
              syncFieldErrors(form, nextValues, ["year_built"]);
            }
          }}
          onBlur={() => validateField("year_built")}
          error={mergeFieldError(
            form.errors.year_built,
            getExternalFieldError(fieldErrors, "property_details.year_built"),
          )}
          isRequired
          fullWidth
        />
      </div>
      {nextFurnishingStatusOptions.length > 0 ? (
        <SelectDropdown
          name="furnishing_status"
          label={nextFurnishingStatusLabel}
          placeholder={`Select ${nextFurnishingStatusLabel.toLowerCase()}`}
          options={nextFurnishingStatusOptions}
          value={stringSelectValue(form.values.furnishing_status)}
          onChange={(value) => updateStringSelect("furnishing_status", value)}
          onBlur={() => validateSelectField("furnishing_status")}
          error={form.errors.furnishing_status}
          isRequired
          fullWidth
        />
      ) : null}
      <SelectDropdown
        name="completion_status"
        label="Completion Status"
        placeholder="Select completion status"
        options={nextCompletionStatusOptions}
        value={stringSelectValue(form.values.completion_status)}
        onChange={(value) => updateStringSelect("completion_status", value)}
        onBlur={() => validateSelectField("completion_status")}
        error={form.errors.completion_status}
        isRequired
        fullWidth
      />
      {nextFloorLevelOptions.length > 0 ? (
        <SelectDropdown
          name="floor_level"
          label={nextFloorLevelLabel}
          placeholder={`Select ${nextFloorLevelLabel.toLowerCase()}`}
          options={nextFloorLevelOptions}
          value={stringSelectValue(form.values.floor_level)}
          onChange={(value) => updateStringSelect("floor_level", value)}
          onBlur={() => validateSelectField("floor_level")}
          error={form.errors.floor_level}
          isRequired
          fullWidth
        />
      ) : null}
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
        options={nextOrientationOptions}
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
      {enableLegacyPermitDld ? (
        <Input
          name="permit_dld_number"
          label="Permit / DLD Number"
          placeholder="Enter permit / DLD number"
          value={form.values.permit_dld_number ?? ""}
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
          fullWidth
        />
      ) : null}
      <Input
        name="guard_name"
        label="Guard Name"
        placeholder="Enter guard name"
        value={form.values.guard_name}
        onChange={(event) => {
          const nextValues = {
            ...form.values,
            guard_name: event.target.value,
          };
          form.setValues(nextValues);

          if (form.touched.guard_name) {
            syncFieldErrors(form, nextValues, ["guard_name"]);
          }
        }}
        onBlur={() => validateField("guard_name")}
        error={form.errors.guard_name}
        fullWidth
      />
      <PhoneInput
        label="Guard Phone Number"
        countryCode={dialCodeToIso2(form.values.guard_country_code)}
        nationalNumber={form.values.guard_phone_number}
        onChange={({ country, nationalNumber }) => {
          const nextValues = {
            ...form.values,
            guard_country_code: country.dialCode,
            guard_phone_number: nationalNumber,
          };
          form.setValues(nextValues);

          if (form.touched.guard_phone_number) {
            syncFieldErrors(form, nextValues, ["guard_phone_number"]);
          }
        }}
        onBlur={() => validateField("guard_phone_number")}
        error={form.errors.guard_phone_number}
        showPhoneIcon={false}
        fullWidth
      />
    </form>
  );
}
