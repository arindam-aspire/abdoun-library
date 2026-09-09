"use client";

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { cn } from "../../../lib/cn";
import {
  dropdownOptionSizeClasses,
  dropdownPanelSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldIconSizeClasses,
  fieldLabelSizeClasses,
  selectTriggerLeadingIconPaddingClasses,
  selectTriggerSizeClasses,
} from "../responsiveSizes";
import {
  anchoredListboxPanelWidthClasses,
  inheritOutlineFocusVisibleClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import type {
  MultiSelectDropdownOption,
  MultiSelectDropdownProps,
  MultiSelectDropdownVariant,
} from "./types";

const triggerBaseClasses = cn(
  "relative flex w-full items-center rounded-xl text-start transition-colors",
  "outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

const triggerVariantClasses: Record<MultiSelectDropdownVariant, string> = {
  outline: cn(
    inheritOutlineVariantClasses,
    inheritOutlineFocusVisibleClasses,
  ),
  ghost: cn(
    "border border-transparent bg-transparent shadow-none",
    "hover:border-secondary/30 hover:bg-page",
    "focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary-dark/12",
  ),
  clear: cn(
    "border-0 bg-transparent shadow-none",
    "hover:bg-page/80",
    "focus-visible:ring-2 focus-visible:ring-secondary-dark/12",
  ),
};

const panelClasses = cn(
  "z-50 max-h-64 overflow-auto rounded-2xl border border-secondary-light/80 bg-surface shadow-xl ring-1 ring-black/5",
  "[scrollbar-width:thin] focus:outline-none",
  anchoredListboxPanelWidthClasses,
  dropdownPanelSizeClasses,
);

const optionBaseClasses = cn(
  "flex cursor-pointer items-center gap-2 truncate rounded-xl text-text transition-colors",
  dropdownOptionSizeClasses,
  "data-focus:bg-page data-hover:bg-page",
  "data-selected:bg-page data-selected:font-medium data-selected:text-secondary-dark",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

function formatSelectionLabel(
  selectedValues: string[],
  options: MultiSelectDropdownOption[],
  placeholder: string,
) {
  if (selectedValues.length === 0) {
    return placeholder;
  }

  const labels = selectedValues
    .map(
      (value) => options.find((option) => option.value === value)?.label ?? value,
    )
    .filter(Boolean);

  return labels.join(", ");
}

export function MultiSelectDropdown({
  options,
  variant = "outline",
  size = "md",
  placeholder,
  label,
  labelClassName,
  error,
  hint,
  isRequired = false,
  value,
  defaultValue,
  onChange,
  onBlur,
  fullWidth = true,
  wrapperClassName,
  hasLeadingIcon = false,
  triggerClassName,
  panelClassName,
  optionClassName,
  className,
  name,
  id: idProp,
  disabled = false,
  autoFocus = false,
  emptyMessage = "No options available.",
  isRtl: isRtlProp,
  "aria-label": ariaLabel,
}: MultiSelectDropdownProps) {
  const generatedId = useId();
  const selectId = idProp ?? generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const hasError = Boolean(error);
  const isRtl = useMemo(() => {
    if (isRtlProp !== undefined) return isRtlProp;
    if (typeof document === "undefined") return false;
    return document.documentElement.dir === "rtl";
  }, [isRtlProp]);

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(
    () => defaultValue ?? [],
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const hasSelection = currentValue.length > 0;

  const handleChange = (next: string[]) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  const displayLabel = formatSelectionLabel(currentValue, options, placeholder);

  return (
    <Field
      disabled={disabled}
      className={cn(fullWidth && "w-full", wrapperClassName, className)}
    >
      {label != null && (
        <Label
          htmlFor={selectId}
          className={cn(fieldLabelSizeClasses, labelClassName)}
        >
          {label}
          {isRequired && (
            <span className="ms-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}

      <Listbox
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        invalid={hasError}
        name={name}
        multiple
        aria-label={label == null ? ariaLabel : undefined}
        aria-required={isRequired || undefined}
      >
        <div className="relative isolate z-[1]">
          <ListboxButton
            suppressHydrationWarning
            id={selectId}
            autoFocus={autoFocus}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            onBlur={onBlur}
            className={cn(
              triggerBaseClasses,
              selectTriggerSizeClasses[size],
              hasLeadingIcon && selectTriggerLeadingIconPaddingClasses[size],
              triggerVariantClasses[variant],
              isRtl ? "text-end" : "text-left",
              hasError &&
                "border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20",
              triggerClassName,
            )}
          >
            <span
              className={cn(
                "block min-w-0 flex-1 truncate pe-8 sm:pe-9",
                isRtl ? "text-end" : "text-start",
                hasSelection
                  ? "font-medium text-text"
                  : "font-normal text-muted",
              )}
            >
              {displayLabel}
            </span>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute top-1/2 end-2 -translate-y-1/2 text-muted sm:end-3",
                fieldIconSizeClasses[size],
              )}
              aria-hidden
            />
          </ListboxButton>

          <ListboxOptions
            anchor={isRtl ? "bottom end" : "bottom start"}
            transition
            className={cn(panelClasses, "[--anchor-gap:0.5rem]", panelClassName)}
          >
            <div className="py-1">
              {options.length > 0 ? (
                options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      optionBaseClasses,
                      isRtl ? "text-end" : "text-left",
                      optionClassName,
                    )}
                  >
                    {({ selected }) => (
                      <>
                        <Check
                          className={cn(
                            "size-4 shrink-0 text-secondary",
                            selected ? "opacity-100" : "opacity-0",
                          )}
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {option.label}
                        </span>
                      </>
                    )}
                  </ListboxOption>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-muted">{emptyMessage}</p>
              )}
            </div>
          </ListboxOptions>
        </div>
      </Listbox>

      {hasError && (
        <p id={errorId} role="alert" className={fieldErrorSizeClasses}>
          {error}
        </p>
      )}

      {!hasError && hint != null && (
        <p id={hintId} className={fieldHintSizeClasses}>
          {hint}
        </p>
      )}
    </Field>
  );
}

export type {
  MultiSelectDropdownOption,
  MultiSelectDropdownProps,
  MultiSelectDropdownSize,
  MultiSelectDropdownVariant,
} from "./types";
export {
  MULTI_SELECT_DROPDOWN_SIZES,
  MULTI_SELECT_DROPDOWN_VARIANTS,
} from "./types";
