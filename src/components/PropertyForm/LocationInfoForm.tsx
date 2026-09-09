"use client";

import { useMemo, type ReactNode } from "react";
import {
  validateLocationInsertFormValues,
  type UseLocationInsertFormReturn,
} from "../../hooks/useLocationFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { resolvePropertyFormConfig } from "./propertyFormConfig";
import {
  getIdentificationFieldValue,
  setIdentificationFieldValue,
} from "./propertyFormDefaults";
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
  LocationInsertFormValues,
  LocationTaxonomyCity,
  PropertyFormFieldErrors,
  PropertyIdentificationFieldDefinition,
  PropertyLocationMapRenderProps,
} from "./types";

const LOCATION_INFO_TITLE = "Location Information";
const LOCATION_INFO_SUBTITLE =
  "Specify the city, area, and street address for this property listing.";
const LOCATION_INFO_BADGE_LABEL = "Required";

function parseSelectId(value: string): number | null {
  if (value === SELECT_DROPDOWN_EMPTY_VALUE || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCoordinate(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCoordinate(value: number | null): string {
  return value == null ? "" : String(value);
}

function syncFieldErrors(
  form: UseLocationInsertFormReturn,
  nextValues: LocationInsertFormValues,
  fields: (keyof LocationInsertFormValues)[],
) {
  const validation = validateLocationInsertFormValues(nextValues);

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

export interface LocationInfoFormProps {
  locationTaxonomy: LocationTaxonomyCity[];
  form: UseLocationInsertFormReturn;
  areaLabel?: string;
  areaPlaceholder?: string;
  identificationFields?: PropertyIdentificationFieldDefinition[];
  mapLabels?: PropertyLocationMapRenderProps["labels"];
  mapSlot?: ReactNode;
  fieldErrors?: PropertyFormFieldErrors;
  className?: string;
}

export function LocationInfoForm({
  locationTaxonomy,
  form,
  areaLabel,
  areaPlaceholder,
  identificationFields,
  mapLabels,
  mapSlot,
  fieldErrors,
  className,
}: LocationInfoFormProps) {
  const resolved = resolvePropertyFormConfig({
    areaLabel,
    areaPlaceholder,
    identificationFields,
    mapLocationLabels: mapLabels,
  });
  const nextAreaLabel = resolved.areaLabel;
  const nextAreaPlaceholder = resolved.areaPlaceholder;
  const nextIdentificationFields = resolved.identificationFields;
  const nextMapLabels = resolved.mapLocationLabels;
  const cityOptions = useMemo(
    () =>
      locationTaxonomy.map((city) => ({
        value: String(city.id),
        label: city.name,
      })),
    [locationTaxonomy],
  );

  const areaOptions = useMemo(() => {
    const selectedCity = locationTaxonomy.find(
      (city) => city.id === form.values.city_id,
    );

    return (
      selectedCity?.areas.map((area) => ({
        value: String(area.id),
        label: area.name,
      })) ?? []
    );
  }, [locationTaxonomy, form.values.city_id]);

  const markFieldTouched = (field: keyof LocationInsertFormValues) => {
    form.setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const validateSelectField = (
    field: keyof LocationInsertFormValues,
    nextValues = form.values,
  ) => {
    markFieldTouched(field);
    syncFieldErrors(form, nextValues, [field]);
  };

  const areaEmptyMessage =
    form.values.city_id == null
      ? "Select a city to choose an area."
      : "No areas available for the selected city.";

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
            {LOCATION_INFO_TITLE}
          </h2>
          <Badge variant="exclusive" appearance="solid" className="shrink-0">
            {LOCATION_INFO_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>
          {LOCATION_INFO_SUBTITLE}
        </p>
      </header>

      <SelectDropdown
        name="city_id"
        label="City"
        placeholder="Select city"
        options={cityOptions}
        value={
          form.values.city_id != null
            ? String(form.values.city_id)
            : SELECT_DROPDOWN_EMPTY_VALUE
        }
        onChange={(value) => {
          const hadAreaSelected = form.values.area_id != null;
          const shouldValidateArea =
            hadAreaSelected || Boolean(form.touched.area_id);
          const nextValues = {
            ...form.values,
            city_id: parseSelectId(value),
            area_id: null,
            area_ids: [],
          };
          form.setValues(nextValues);
          markFieldTouched("city_id");

          const fieldsToSync: (keyof LocationInsertFormValues)[] = ["city_id"];
          if (shouldValidateArea) {
            markFieldTouched("area_id");
            fieldsToSync.push("area_id");
          }

          syncFieldErrors(form, nextValues, fieldsToSync);

          if (!shouldValidateArea) {
            form.setErrors((previous) => {
              if (!previous.area_id) {
                return previous;
              }

              const next = { ...previous };
              delete next.area_id;
              return next;
            });
          }
        }}
        onBlur={() => validateSelectField("city_id")}
        error={form.errors.city_id}
        isRequired
        fullWidth
      />

      <div {...propertyFormFieldProps("location_insert.area_id")}>
        <SelectDropdown
          name="area_id"
          label={nextAreaLabel}
          placeholder={nextAreaPlaceholder}
          options={areaOptions}
          value={
            form.values.area_id != null
              ? String(form.values.area_id)
              : SELECT_DROPDOWN_EMPTY_VALUE
          }
          onChange={(value) => {
            const areaId = parseSelectId(value);
            const nextValues = {
              ...form.values,
              area_id: areaId,
              area_ids: areaId != null ? [areaId] : [],
            };
            form.setValues(nextValues);
            markFieldTouched("area_id");
            syncFieldErrors(form, nextValues, ["area_id"]);
          }}
          onBlur={() => validateSelectField("area_id")}
          error={mergeFieldError(
            form.errors.area_id,
            getExternalFieldError(
              fieldErrors,
              "location_insert.area_id",
              "location.area_id",
            ),
          )}
          isRequired
          fullWidth
          disabled={form.values.city_id == null}
        />
        {form.values.city_id != null && areaOptions.length === 0 ? (
          <p className={cn("mt-1 text-muted", textBodySmClasses)}>
            {areaEmptyMessage}
          </p>
        ) : null}
      </div>

      <Textarea
        name="address"
        label="Address"
        placeholder="Enter property address"
        value={form.values.address}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        fullWidth
        rows={3}
        className={propertyFormGridSpanClasses}
      />

      <div
        className={cn(propertyFormGridSpanClasses, "flex flex-col gap-2")}
        {...propertyFormFieldProps("location_insert.latitude")}
      >
        <p className={cn("font-medium text-secondary", textBodySmClasses)}>
          {nextMapLabels.mapTitle}
        </p>
        {mapSlot ? (
          <div className="overflow-hidden rounded-xl border border-secondary/15 bg-page-ghost/40">
            {mapSlot}
          </div>
        ) : (
          <p className={cn("text-muted", textBodySmClasses)}>
            {nextMapLabels.selectPinHint}
          </p>
        )}
      </div>

      <div {...propertyFormFieldProps("location_insert.latitude")}>
        <Input
          name="latitude"
          label={nextMapLabels.latitude}
          placeholder="0.000000"
          type="number"
          inputMode="decimal"
          step="any"
          value={formatCoordinate(form.values.latitude ?? null)}
          onChange={(event) => {
            const nextValues = {
              ...form.values,
              latitude: parseCoordinate(event.target.value),
            };
            form.setValues(nextValues);
          }}
          error={getExternalFieldError(
            fieldErrors,
            "location_insert.latitude",
            "location.latitude",
          )}
          fullWidth
        />
      </div>
      <Input
        name="longitude"
        label={nextMapLabels.longitude}
        placeholder="0.000000"
        type="number"
        inputMode="decimal"
        step="any"
        value={formatCoordinate(form.values.longitude ?? null)}
        onChange={(event) => {
          const nextValues = {
            ...form.values,
            longitude: parseCoordinate(event.target.value),
          };
          form.setValues(nextValues);
        }}
        error={getExternalFieldError(
          fieldErrors,
          "location_insert.longitude",
          "location.longitude",
        )}
        fullWidth
      />

      {nextIdentificationFields.map((field) => (
        <Input
          key={field.key}
          name={field.key}
          label={field.label}
          placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
          value={getIdentificationFieldValue(form.values, field.key)}
          onChange={(event) => {
            form.setValues(
              setIdentificationFieldValue(
                form.values,
                field.key,
                event.target.value,
              ),
            );
          }}
          isRequired={field.required}
          fullWidth
        />
      ))}
    </form>
  );
}
