"use client";

import { Plus, Trash2 } from "lucide-react";
import type { UseOwnerInfoFormReturn } from "../../hooks/useOwnerInfoFormHook";
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
import {
  propertyFormGridClasses,
  propertyFormGridSpanClasses,
  propertyFormStackClasses,
} from "./propertyFormFieldLayout";
import { nationalityOptions } from "./ownerInfoFormOptions";
import { isOwnerInfoFieldReadOnly } from "./ownerInfoConfig";
import type {
  OwnerInfoConfig,
  OwnerInfoItem,
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
  className?: string;
}

export function OwnerInforForm({
  form,
  ownerInfoConfig,
  onUploadOwnerDocument,
  onOwnerDocumentsChange,
  onRemoveOwnerDocument,
  onOwnerDocumentUploadingChange,
  className,
}: OwnerInforFormProps) {
  const requireDocuments = ownerInfoConfig?.requireDocuments ?? false;
  const readOnlyOwnerIndices = ownerInfoConfig?.readOnlyOwnerIndices ?? [];
  const updateOwnerField = (
    index: number,
    patch: Partial<OwnerInfoItem>,
    nextValues?: Parameters<UseOwnerInfoFormReturn["updateOwner"]>[2],
  ) => {
    form.updateOwner(index, patch, nextValues);
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

      <div className={propertyFormStackClasses}>
        {form.values.owners.map((owner, index) => {
          const ownerNumber = index + 1;
          const hasMultipleOwners = form.values.owners.length > 1;
          const isOwnerRowReadOnly = readOnlyOwnerIndices.includes(index);
          const isNameReadOnly = isOwnerInfoFieldReadOnly(
            index,
            "owner_name",
            ownerInfoConfig,
          );
          const isEmailReadOnly = isOwnerInfoFieldReadOnly(
            index,
            "email",
            ownerInfoConfig,
          );
          const isPhoneReadOnly =
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
              {hasMultipleOwners ? (
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className={cn(
                      "font-semibold text-secondary",
                      textBodySmClasses,
                    )}
                  >
                    Owner {ownerNumber}
                  </h3>

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
                </div>
              ) : null}

              <div className={propertyFormGridClasses}>
                <Input
                  name={`owner_name-${index}`}
                  label="Owner Name"
                  placeholder="Enter owner name"
                  value={owner.owner_name}
                  onChange={(event) => {
                    updateOwnerField(index, { owner_name: event.target.value });
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
                  error={form.getFieldError(index, "email")}
                  isRequired
                  disabled={isEmailReadOnly}
                  fullWidth
                />

                <SelectDropdown
                  name={`nationality-${index}`}
                  label="Nationality"
                  placeholder="Select nationality"
                  options={nationalityOptions}
                  value={owner.nationality || SELECT_DROPDOWN_EMPTY_VALUE}
                  onChange={(value) => {
                    updateOwnerField(index, {
                      nationality:
                        value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
                    });
                  }}
                  fullWidth
                />

                <Input
                  name={`social_security_id-${index}`}
                  label="Social Security ID"
                  placeholder="Enter social security ID"
                  value={owner.social_security_id}
                  onChange={(event) => {
                    updateOwnerField(
                      index,
                      { social_security_id: event.target.value },
                    );
                  }}
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
      </div>
    </form>
  );
}
