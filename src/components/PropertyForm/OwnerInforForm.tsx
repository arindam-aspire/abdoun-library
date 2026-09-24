"use client";

import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { UseOwnerInfoFormReturn } from "../../hooks/useOwnerInfoFormHook";
import { emptyOwnerInfoItem } from "../../hooks/useOwnerInfoFormHook";
import { cn } from "../../lib/cn";
import {
  textBodySmClasses,
  textMetaClasses,
  textPageTitleClasses,
} from "../../lib/typography";
import { inheritOutlineFocusVisibleClasses } from "../ui/fieldVariants";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FileSelectInput } from "../ui/FileSelectInput";
import { Input } from "../ui/Input";
import { PHONE_INPUT_COUNTRIES, PhoneInput } from "../ui/PhoneInput";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { ToggleButton } from "../ui/ToggleButton";
import { resolvePropertyFormConfig } from "./propertyFormConfig";
import { isOwnerInfoFieldReadOnly } from "./ownerInfoConfig";
import {
  getExternalFieldError,
  mergeFieldError,
  propertyFormFieldProps,
} from "./propertyFormErrors";
import {
  findDuplicateOwnerMatch,
  searchResultToOwnerItem,
} from "./propertyFormOwner";
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
  propertyFormStackClasses,
} from "./propertyFormFieldLayout";
import type {
  OwnerInfoConfig,
  OwnerInfoItem,
  PropertyFormFieldErrors,
  PropertyFormOption,
  PropertyFormOwnerMode,
  PropertyFormOwnerModeLabels,
  PropertyOwnerDuplicateIdentityField,
  PropertyOwnerSearchResult,
  SelectedDocument,
} from "./types";

const OWNER_INFO_TITLE = "Owner Information";
const OWNER_INFO_SUBTITLE =
  "Add one or more property owners. Name, phone number, and email are required for each owner.";
const OWNER_INFO_BADGE_LABEL = "Required";

function dialCodeToIso2(dialCode: string): string {
  const match = PHONE_INPUT_COUNTRIES.find(
    (country) => country.dialCode === dialCode,
  );

  return match?.iso2 ?? "JO";
}

export interface OwnerInforFormProps {
  form: UseOwnerInfoFormReturn;
  ownerInfoConfig?: OwnerInfoConfig;
  ownerModeLabels?: Required<PropertyFormOwnerModeLabels> | PropertyFormOwnerModeLabels;
  nationalityOptions?: PropertyFormOption[];
  enableOwnerSearch?: boolean;
  onSearchOwners?: (
    query: string,
  ) => Promise<PropertyOwnerSearchResult[]> | PropertyOwnerSearchResult[];
  onSelectOwner?: (owner: PropertyOwnerSearchResult) => void;
  ownerSearchResults?: PropertyOwnerSearchResult[];
  ownerSearchLoading?: boolean;
  ownerSearchError?: string | null;
  ownerDuplicateError?: string | null;
  ownerSearchDebounceMs?: number;
  duplicateIdentityFields?: PropertyOwnerDuplicateIdentityField[];
  onUploadOwnerDocument?: (
    file: File,
    context: { ownerIndex: number },
  ) => Promise<string | null>;
  onOwnerDocumentsChange?: (
    ownerIndex: number,
    documents: SelectedDocument[],
  ) => void;
  onRemoveOwnerDocument?: (
    ownerIndex: number,
    document: SelectedDocument,
  ) => void;
  onOwnerDocumentUploadingChange?: (
    ownerIndex: number,
    isUploading: boolean,
  ) => void;
  fieldErrors?: PropertyFormFieldErrors;
  className?: string;
}

export function OwnerInforForm({
  form,
  ownerInfoConfig,
  ownerModeLabels,
  nationalityOptions,
  enableOwnerSearch = false,
  onSearchOwners,
  onSelectOwner,
  ownerSearchResults,
  ownerSearchLoading,
  ownerSearchError,
  ownerDuplicateError,
  ownerSearchDebounceMs,
  duplicateIdentityFields,
  onUploadOwnerDocument,
  onOwnerDocumentsChange,
  onRemoveOwnerDocument,
  onOwnerDocumentUploadingChange,
  fieldErrors,
  className,
}: OwnerInforFormProps) {
  const resolved = resolvePropertyFormConfig({
    ownerModeLabels,
    nationalityOptions,
    ownerSearchDebounceMs,
    duplicateIdentityFields,
  });
  const nextOwnerModeLabels = resolved.ownerModeLabels;
  const ownerModeItems = useMemo(
    () => [
      {
        value: "search" as const,
        label: nextOwnerModeLabels.searchExisting,
      },
      {
        value: "create" as const,
        label: nextOwnerModeLabels.createNew,
      },
    ],
    [nextOwnerModeLabels.createNew, nextOwnerModeLabels.searchExisting],
  );
  const nextNationalityOptions = resolved.nationalityOptions;
  const nextDebounceMs = resolved.ownerSearchDebounceMs;
  const nextDuplicateFields = resolved.duplicateIdentityFields;
  const requireDocuments = ownerInfoConfig?.requireDocuments ?? false;
  const readOnlyOwnerIndices = ownerInfoConfig?.readOnlyOwnerIndices ?? [];
  const ownerMode = form.values.owner_mode ?? "create";
  const [searchQuery, setSearchQuery] = useState("");
  const [internalResults, setInternalResults] = useState<
    PropertyOwnerSearchResult[]
  >([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const searchRequestIdRef = useRef(0);

  const results = ownerSearchResults ?? internalResults;
  const isSearchLoading = ownerSearchLoading ?? internalLoading;
  const searchError = ownerSearchError ?? internalError;

  const primaryOwner = form.values.owners[0] ?? emptyOwnerInfoItem;
  const duplicateMatch = useMemo(
    () =>
      findDuplicateOwnerMatch(
        primaryOwner,
        results,
        nextDuplicateFields,
      ),
    [nextDuplicateFields, primaryOwner, results],
  );
  const backendDuplicate = Boolean(ownerDuplicateError?.trim());
  const requiresExistingSelection =
    ownerMode === "create" && (Boolean(duplicateMatch) || backendDuplicate);

  useEffect(() => {
    if (requiresExistingSelection && !form.values.owner_id) {
      form.setErrors((previous) =>
        previous.owners === " " ? previous : { ...previous, owners: " " },
      );
      return;
    }

    form.setErrors((previous) => {
      if (!previous.owners) {
        return previous;
      }
      const next = { ...previous };
      delete next.owners;
      return next;
    });
  }, [form.setErrors, form.values.owner_id, requiresExistingSelection]);

  useEffect(() => {
    if (!enableOwnerSearch || !onSearchOwners) {
      return;
    }

    const query = searchQuery.trim();
    if (query.length < 2 && ownerMode === "search") {
      setInternalResults([]);
      setInternalError(null);
      return;
    }

    const identityQuery =
      ownerMode === "create"
        ? [
            primaryOwner.email,
            `${primaryOwner.country_code}${primaryOwner.phone_number}`,
            primaryOwner.ssi || primaryOwner.social_security_id,
          ]
            .map((value) => value.trim())
            .find((value) => value.length >= 3) ?? ""
        : query;

    if (!identityQuery) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const requestId = searchRequestIdRef.current + 1;
      searchRequestIdRef.current = requestId;
      setInternalLoading(true);
      setInternalError(null);

      Promise.resolve(onSearchOwners(identityQuery))
        .then((nextResults) => {
          if (searchRequestIdRef.current !== requestId) {
            return;
          }
          setInternalResults(nextResults);
        })
        .catch((error: unknown) => {
          if (searchRequestIdRef.current !== requestId) {
            return;
          }
          setInternalError(
            error instanceof Error ? error.message : "Unable to search owners.",
          );
        })
        .finally(() => {
          if (searchRequestIdRef.current === requestId) {
            setInternalLoading(false);
          }
        });
    }, nextDebounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    enableOwnerSearch,
    onSearchOwners,
    ownerMode,
    nextDebounceMs,
    primaryOwner.country_code,
    primaryOwner.email,
    primaryOwner.phone_number,
    primaryOwner.social_security_id,
    primaryOwner.ssi,
    searchQuery,
  ]);

  const selectExistingOwner = (owner: PropertyOwnerSearchResult) => {
    const nextOwner = searchResultToOwnerItem(owner, primaryOwner);
    form.setValues({
      ...form.values,
      owner_mode: "search",
      owner_id: owner.owner_id,
      owners: [nextOwner],
    });
    onSelectOwner?.(owner);
  };

  const setOwnerMode = (mode: PropertyFormOwnerMode) => {
    if (mode === "create") {
      form.setValues({
        ...form.values,
        owner_mode: "create",
        owner_id: null,
        owners:
          form.values.owners.length > 0
            ? form.values.owners.map((owner, index) =>
                index === 0
                  ? { ...owner, owner_id: undefined }
                  : owner,
              )
            : [{ ...emptyOwnerInfoItem }],
      });
      return;
    }

    form.setValues({
      ...form.values,
      owner_mode: "search",
    });
  };

  const updateOwnerField = (
    index: number,
    patch: Partial<OwnerInfoItem>,
    nextValues?: Parameters<UseOwnerInfoFormReturn["updateOwner"]>[2],
  ) => {
    const normalizedPatch =
      "owner_name" in patch || "full_name" in patch
        ? {
            ...patch,
            owner_name: patch.owner_name ?? patch.full_name ?? undefined,
            full_name: patch.full_name ?? patch.owner_name ?? undefined,
          }
        : "social_security_id" in patch || "ssi" in patch
          ? {
              ...patch,
              social_security_id:
                patch.social_security_id ?? patch.ssi ?? undefined,
              ssi: patch.ssi ?? patch.social_security_id ?? undefined,
            }
          : patch;

    form.updateOwner(index, normalizedPatch, nextValues);
  };

  return (
    <form
      className={cn(propertyFormStackClasses, className)}
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <header className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h2
            className={cn(
              "min-w-0 font-bold text-secondary",
              textPageTitleClasses,
            )}
          >
            {OWNER_INFO_TITLE}
          </h2>
          <Badge variant="exclusive" appearance="solid" className="shrink-0">
            {OWNER_INFO_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>
          {OWNER_INFO_SUBTITLE}
        </p>
      </header>

      {enableOwnerSearch ? (
        <ToggleButton
          size="md"
          fullWidth
          value={ownerMode}
          onChange={setOwnerMode}
          aria-label="Owner mode"
          items={ownerModeItems}
        />
      ) : null}

      {enableOwnerSearch && ownerMode === "search" ? (
        <div className={propertyFormStackClasses}>
          <Input
            name="owner_search"
            label={nextOwnerModeLabels.searchExisting}
            placeholder={nextOwnerModeLabels.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            iconStart={<Search aria-hidden />}
            hint={isSearchLoading ? nextOwnerModeLabels.searchLoading : undefined}
            error={searchError ?? undefined}
            fullWidth
          />

          {results.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {results.map((result) => {
                const isSelected = form.values.owner_id === result.owner_id;
                return (
                  <li
                    key={result.owner_id}
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border border-secondary/15 bg-page-ghost/40 p-3 sm:flex-row sm:items-center sm:justify-between",
                      isSelected && "border-primary/40 bg-primary-light/30",
                    )}
                  >
                    <div className="min-w-0">
                      <p className={cn("font-medium text-text", textBodySmClasses)}>
                        {result.full_name || result.email || result.owner_id}
                      </p>
                      <p className={cn("text-muted", textMetaClasses)}>
                        {[result.email, result.phone_number, result.ssi]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      color={isSelected ? "secondary" : "primary"}
                      variant={isSelected ? "outline" : "solid"}
                      onClick={() => selectExistingOwner(result)}
                    >
                      {isSelected
                        ? nextOwnerModeLabels.selectedOwner
                        : nextOwnerModeLabels.selectOwner}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : searchQuery.trim().length >= 2 && !isSearchLoading ? (
            <p className={cn("text-muted", textBodySmClasses)}>
              {nextOwnerModeLabels.searchEmpty}
            </p>
          ) : null}
        </div>
      ) : null}

      {requiresExistingSelection ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3"
        >
          <p className={cn("font-medium text-danger", textBodySmClasses)}>
            {ownerDuplicateError || nextOwnerModeLabels.duplicateDetected}
          </p>
          <p className={cn("mt-1 text-text", textBodySmClasses)}>
            {nextOwnerModeLabels.duplicateSelectExisting}
          </p>
          {duplicateMatch ? (
            <Button
              type="button"
              size="sm"
              className="mt-3"
              onClick={() => selectExistingOwner(duplicateMatch)}
            >
              {nextOwnerModeLabels.selectOwner}
            </Button>
          ) : null}
        </div>
      ) : null}

      {ownerMode === "create" || form.values.owner_id ? (
        <div className={propertyFormStackClasses}>
          {form.values.owners.map((owner, index) => {
            const ownerNumber = index + 1;
            const hasMultipleOwners = form.values.owners.length > 1;
            const isExistingOwner = Boolean(owner.owner_id);
            const isOwnerRowReadOnly =
              isExistingOwner || readOnlyOwnerIndices.includes(index);
            const isNameReadOnly =
              isExistingOwner ||
              isOwnerInfoFieldReadOnly(index, "owner_name", ownerInfoConfig);
            const isEmailReadOnly =
              isExistingOwner ||
              isOwnerInfoFieldReadOnly(index, "email", ownerInfoConfig);
            const isPhoneReadOnly =
              isExistingOwner ||
              isOwnerInfoFieldReadOnly(index, "phone_number", ownerInfoConfig) ||
              isOwnerInfoFieldReadOnly(index, "country_code", ownerInfoConfig);

            return (
              <div
                key={`owner-${index}`}
                className={cn(
                  propertyFormStackClasses,
                  index > 0 && "border-t border-secondary/10 pt-4 sm:pt-5",
                )}
              >
                {hasMultipleOwners || isExistingOwner ? (
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={cn(
                        "font-semibold text-secondary",
                        textBodySmClasses,
                      )}
                    >
                      {isExistingOwner
                        ? nextOwnerModeLabels.selectedOwner
                        : `Owner ${ownerNumber}`}
                    </h3>

                    {hasMultipleOwners && !isExistingOwner ? (
                      <Button
                        type="button"
                        color="danger"
                        variant="ghost"
                        size="sm"
                        onClick={() => form.removeOwner(index)}
                        disabled={isOwnerRowReadOnly}
                        iconStart={<Trash2 className="size-4" aria-hidden />}
                      >
                        Remove Owner
                      </Button>
                    ) : null}
                  </div>
                ) : null}

                <div className={propertyFormGridClasses}>
                  <Input
                    name={`owner_name-${index}`}
                    label="Owner Name"
                    placeholder="Enter owner name"
                    value={owner.full_name || owner.owner_name}
                    onChange={(event) => {
                      updateOwnerField(index, {
                        owner_name: event.target.value,
                        full_name: event.target.value,
                      });
                    }}
                    onBlur={() => form.markOwnerFieldTouched(index, "owner_name")}
                    error={form.getFieldError(index, "owner_name")}
                    isRequired
                    disabled={isNameReadOnly}
                    fullWidth
                  />

                  <PhoneInput
                    label="Phone Number"
                    countryCode={dialCodeToIso2(owner.country_code)}
                    nationalNumber={owner.phone_number}
                    onChange={({ country, nationalNumber }) => {
                      updateOwnerField(index, {
                        country_code: country.dialCode,
                        phone_number: nationalNumber,
                      });
                    }}
                    onBlur={() => form.markOwnerFieldTouched(index, "phone_number")}
                    error={form.getFieldError(index, "phone_number")}
                    isRequired
                    disabled={isPhoneReadOnly}
                    showPhoneIcon={false}
                    fullWidth
                  />

                  <div
                    {...propertyFormFieldProps(
                      `owner_info.owners.${index}.email`,
                    )}
                  >
                    <Input
                      name={`email-${index}`}
                      label="Email Address"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter email address"
                      value={owner.email}
                      onChange={(event) => {
                        updateOwnerField(index, { email: event.target.value });
                      }}
                      onBlur={() => form.markOwnerFieldTouched(index, "email")}
                      error={mergeFieldError(
                        form.getFieldError(index, "email"),
                        getExternalFieldError(
                          fieldErrors,
                          `owner_info.owners.${index}.email`,
                          `owner_information.owners.${index}.email`,
                        ),
                      )}
                      isRequired
                      disabled={isEmailReadOnly}
                      fullWidth
                    />
                  </div>

                  <SelectDropdown
                    name={`nationality-${index}`}
                    label="Nationality"
                    placeholder="Select nationality"
                    options={nextNationalityOptions}
                    value={owner.nationality || SELECT_DROPDOWN_EMPTY_VALUE}
                    onChange={(value) => {
                      updateOwnerField(index, {
                        nationality:
                          value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
                      });
                    }}
                    disabled={isExistingOwner}
                    fullWidth
                  />

                  <Input
                    name={`social_security_id-${index}`}
                    label="Social Security ID"
                    placeholder="Enter social security ID"
                    value={owner.ssi || owner.social_security_id}
                    onChange={(event) => {
                      updateOwnerField(index, {
                        social_security_id: event.target.value,
                        ssi: event.target.value,
                      });
                    }}
                    disabled={isExistingOwner}
                    fullWidth
                    className={propertyFormGridSpanClasses}
                  />

                  <FileSelectInput
                    name={`owner_documents-${index}`}
                    label="Owner Document"
                    value={owner.owner_documents}
                    onChange={(documents) => {
                      const nextValues = {
                        ...form.values,
                        owners: form.values.owners.map((ownerRow, ownerIndex) =>
                          ownerIndex === index
                            ? { ...ownerRow, owner_documents: documents }
                            : ownerRow,
                        ),
                      };

                      updateOwnerField(
                        index,
                        { owner_documents: documents },
                        nextValues,
                      );
                      onOwnerDocumentsChange?.(index, documents);
                    }}
                    onRemove={(document) => {
                      onRemoveOwnerDocument?.(index, document);
                    }}
                    onUpload={
                      onUploadOwnerDocument
                        ? (file) =>
                            onUploadOwnerDocument(file, { ownerIndex: index })
                        : undefined
                    }
                    onUploadingChange={(isUploading) => {
                      onOwnerDocumentUploadingChange?.(index, isUploading);
                    }}
                    isRequired={requireDocuments}
                    error={form.getFieldError(index, "owner_documents")}
                    multiple
                    className={propertyFormGridSpanClasses}
                  />
                </div>
              </div>
            );
          })}

          {ownerMode === "create" && !requiresExistingSelection ? (
            <button
              type="button"
              onClick={() => form.addOwner()}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-secondary/25 bg-page-ghost/60 px-4 py-6 text-center transition-colors sm:py-7",
                "hover:border-primary/35 hover:bg-primary-light/25",
                inheritOutlineFocusVisibleClasses,
              )}
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full border border-primary/15 bg-surface shadow-sm sm:size-11">
                <Plus className="size-5 text-primary" aria-hidden />
              </span>
              <span className={cn("font-semibold text-secondary", textBodySmClasses)}>
                Add Another Owner
              </span>
              <span className={cn("max-w-sm text-muted", textMetaClasses)}>
                Include an additional property owner if needed.
              </span>
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
