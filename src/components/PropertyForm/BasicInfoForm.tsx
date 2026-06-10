"use client";

import { useMemo } from "react";
import {
  validateBasicInfoFormValues,
  type UseBasicInfoFormReturn,
} from "../../hooks/useBasicInfoFormHook";
import { cn } from "../../lib/cn";
import {
  textBodySmClasses,
  textPageTitleClasses,
} from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { Textarea } from "../ui/Textarea";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
} from "./propertyFormFieldLayout";
import type { BasicInfoFormValues, PropertyTaxonomyCategory } from "./types";

const listingPurposeOptions = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
];

const BASIC_INFO_TITLE = "Basic Information";
const BASIC_INFO_SUBTITLE =
  "Enter the primary legal basic information details for this property record. This information will be used for official ledger entries and contract generation.";
const BASIC_INFO_BADGE_LABEL = "Required";

function parseSelectId(value: string): number | null {
  if (value === SELECT_DROPDOWN_EMPTY_VALUE || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function syncFieldErrors(
  form: UseBasicInfoFormReturn,
  nextValues: BasicInfoFormValues,
  fields: (keyof BasicInfoFormValues)[],
) {
  const validation = validateBasicInfoFormValues(nextValues);

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

export interface BasicInfoFormProps {
  categoryTaxonomy: PropertyTaxonomyCategory[];
  form: UseBasicInfoFormReturn;
  className?: string;
}

export function BasicInfoForm({
  categoryTaxonomy,
  form,
  className,
}: BasicInfoFormProps) {
  const categoryOptions = useMemo(
    () =>
      categoryTaxonomy.map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    [categoryTaxonomy],
  );

  const typeOptions = useMemo(() => {
    const selectedCategory = categoryTaxonomy.find(
      (category) => category.id === form.values.category_id,
    );

    return (
      selectedCategory?.property_types.map((type) => ({
        value: String(type.id),
        label: type.name,
      })) ?? []
    );
  }, [categoryTaxonomy, form.values.category_id]);

  const markSelectTouched = (field: keyof BasicInfoFormValues) => {
    form.setTouched((previous) => ({ ...previous, [field]: true }));
  };

  const validateSelectField = (
    field: keyof BasicInfoFormValues,
    nextValues = form.values,
  ) => {
    markSelectTouched(field);
    syncFieldErrors(form, nextValues, [field]);
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
            {BASIC_INFO_TITLE}
          </h2>
          <Badge
            variant="exclusive"
            appearance="solid"
            className="shrink-0"
          >
            {BASIC_INFO_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>
          {BASIC_INFO_SUBTITLE}
        </p>
      </header>

      <SelectDropdown
        name="listing_purpose"
        label="Listing purpose"
        placeholder="Select listing purpose"
        options={listingPurposeOptions}
        value={form.values.listing_purpose ?? "sale"}
        onChange={(value) => {
          const nextValues = { ...form.values, listing_purpose: value };
          form.setValues(nextValues);
          markSelectTouched("listing_purpose");
          syncFieldErrors(form, nextValues, ["listing_purpose"]);
        }}
        onBlur={() => validateSelectField("listing_purpose")}
        error={form.errors.listing_purpose}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="category_id"
        label="Category"
        placeholder="Select category"
        options={categoryOptions}
        value={
          form.values.category_id != null
            ? String(form.values.category_id)
            : SELECT_DROPDOWN_EMPTY_VALUE
        }
        onChange={(value) => {
          const nextValues = {
            ...form.values,
            category_id: parseSelectId(value),
            type_id: null,
          };
          form.setValues(nextValues);
          markSelectTouched("category_id");
          markSelectTouched("type_id");
          syncFieldErrors(form, nextValues, ["category_id", "type_id"]);
        }}
        onBlur={() => validateSelectField("category_id")}
        error={form.errors.category_id}
        isRequired
        fullWidth
      />
      <SelectDropdown
        name="type_id"
        label="Property type"
        placeholder="Select property type"
        options={typeOptions}
        value={
          form.values.type_id != null
            ? String(form.values.type_id)
            : SELECT_DROPDOWN_EMPTY_VALUE
        }
        onChange={(value) => {
          const nextValues = {
            ...form.values,
            type_id: parseSelectId(value),
          };
          form.setValues(nextValues);
          markSelectTouched("type_id");
          syncFieldErrors(form, nextValues, ["type_id"]);
        }}
        onBlur={() => validateSelectField("type_id")}
        error={form.errors.type_id}
        isRequired
        fullWidth
        disabled={form.values.category_id == null}
      />
      <Input
        name="title"
        label="Property title"
        placeholder="Enter property title"
        value={form.values.title}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.title}
        isRequired
        fullWidth
      />
      <Textarea
        name="description"
        label="Description"
        placeholder="Enter property description"
        value={form.values.description}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        fullWidth
        className={propertyFormGridSpanClasses}
      />
    </form>
  );
}
