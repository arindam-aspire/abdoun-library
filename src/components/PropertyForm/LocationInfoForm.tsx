"use client";

import { useMemo } from "react";
import {
  validateLocationInsertFormValues,
  type UseLocationInsertFormReturn,
} from "../../hooks/useLocationFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Textarea } from "../ui/Textarea";
import { MultiSelectDropdown } from "../ui/MultiSelectDropdown";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
} from "./propertyFormFieldLayout";
import type {
  LocationInsertFormValues,
  LocationTaxonomyCity,
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

function parseSelectedIds(values: string[]) {
  return values
    .map((value) => Number(value))
    .filter((id) => Number.isFinite(id));
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
  className?: string;
}

export function LocationInfoForm({
  locationTaxonomy,
  form,
  className,
}: LocationInfoFormProps) {
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
      ? "Select a city to choose areas."
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
          const nextValues = {
            ...form.values,
            city_id: parseSelectId(value),
            area_ids: [],
          };
          form.setValues(nextValues);
          markFieldTouched("city_id");
          markFieldTouched("area_ids");
          syncFieldErrors(form, nextValues, ["city_id", "area_ids"]);
        }}
        onBlur={() => validateSelectField("city_id")}
        error={form.errors.city_id}
        isRequired
        fullWidth
      />

      <MultiSelectDropdown
        name="area_ids"
        label="Area"
        placeholder="Select areas"
        options={areaOptions}
        value={form.values.area_ids.map(String)}
        onChange={(values) => {
          const nextValues = {
            ...form.values,
            area_ids: parseSelectedIds(values),
          };
          form.setValues(nextValues);
          markFieldTouched("area_ids");
          syncFieldErrors(form, nextValues, ["area_ids"]);
        }}
        onBlur={() => validateSelectField("area_ids")}
        error={form.errors.area_ids}
        isRequired
        fullWidth
        disabled={form.values.city_id == null}
        emptyMessage={areaEmptyMessage}
      />

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
    </form>
  );
}
