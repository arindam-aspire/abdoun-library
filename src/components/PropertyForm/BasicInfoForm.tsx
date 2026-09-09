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
import { MultiSelectDropdown } from "../ui/MultiSelectDropdown";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { Textarea } from "../ui/Textarea";
import { resolvePropertyFormConfig } from "./propertyFormConfig";
import { deriveLegacyListingPurpose } from "./propertyFormDefaults";
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
  BasicInfoFormValues,
  PropertyFormFieldErrors,
  PropertyFormOption,
  PropertyTaxonomyCategory,
} from "./types";

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
  listingPurposeOptions?: PropertyFormOption[];
  listingPurposeLabel?: string;
  listingPurposePlaceholder?: string;
  fieldErrors?: PropertyFormFieldErrors;
  className?: string;
}

export function BasicInfoForm({
  categoryTaxonomy,
  form,
  listingPurposeOptions,
  listingPurposeLabel,
  listingPurposePlaceholder,
  fieldErrors,
  className,
}: BasicInfoFormProps) {
  const resolved = resolvePropertyFormConfig({
    listingPurposeOptions,
    listingPurposeLabel,
    listingPurposePlaceholder,
  });
  const nextListingPurposeOptions = resolved.listingPurposeOptions;
  const nextListingPurposeLabel = resolved.listingPurposeLabel;
  const nextListingPurposePlaceholder = resolved.listingPurposePlaceholder;
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

      <div {...propertyFormFieldProps("basic_info.listing_purposes")}>
        <MultiSelectDropdown
          name="listing_purposes"
          label={nextListingPurposeLabel}
          placeholder={nextListingPurposePlaceholder}
          options={nextListingPurposeOptions}
          value={form.values.listing_purposes ?? []}
          onChange={(values) => {
            const nextValues = {
              ...form.values,
              listing_purposes: values,
              listing_purpose: deriveLegacyListingPurpose(values),
            };
            form.setValues(nextValues);
            markSelectTouched("listing_purposes");
            syncFieldErrors(form, nextValues, ["listing_purposes"]);
          }}
          onBlur={() => validateSelectField("listing_purposes")}
          error={mergeFieldError(
            form.errors.listing_purposes,
            getExternalFieldError(
              fieldErrors,
              "basic_info.listing_purposes",
              "basic_information.listing_purposes",
            ),
          )}
          isRequired
          fullWidth
        />
      </div>
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
          const hadTypeSelected = form.values.type_id != null;
          const shouldValidateType =
            hadTypeSelected || Boolean(form.touched.type_id);
          const nextValues = {
            ...form.values,
            category_id: parseSelectId(value),
            type_id: null,
          };
          form.setValues(nextValues);
          markSelectTouched("category_id");

          const fieldsToSync: (keyof BasicInfoFormValues)[] = ["category_id"];
          if (shouldValidateType) {
            markSelectTouched("type_id");
            fieldsToSync.push("type_id");
          }

          syncFieldErrors(form, nextValues, fieldsToSync);

          if (!shouldValidateType) {
            form.setErrors((previous) => {
              if (!previous.type_id) {
                return previous;
              }

              const next = { ...previous };
              delete next.type_id;
              return next;
            });
          }
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
