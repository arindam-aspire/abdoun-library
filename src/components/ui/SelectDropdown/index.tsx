"use client";

import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
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
} from "../controlSizes";
import {
  inheritOutlineFocusVisibleClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import type { SelectDropdownProps, SelectDropdownVariant } from "./types";
import {
  SELECT_DROPDOWN_EMPTY_VALUE,
  type SelectDropdownOption,
} from "./types";

const triggerBaseClasses = cn(
  "relative flex w-full items-center rounded-xl transition-colors",
  "outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

const triggerVariantClasses: Record<SelectDropdownVariant, string> = {
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
  "z-50 max-h-64 min-w-64 w-(--button-width) overflow-auto rounded-2xl border border-secondary-light/80 bg-surface shadow-xl ring-1 ring-black/5",
  "[scrollbar-width:thin] focus:outline-none",
  dropdownPanelSizeClasses,
);

const optionBaseClasses = cn(
  "cursor-pointer rounded-xl text-text transition-colors",
  dropdownOptionSizeClasses,
  "data-focus:bg-page data-hover:bg-page",
  "data-selected:bg-page data-selected:font-medium data-selected:text-secondary-dark",
  "data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

function buildOptions(
  placeholder: string,
  options: SelectDropdownOption[],
): SelectDropdownOption[] {
  return [
    {
      value: SELECT_DROPDOWN_EMPTY_VALUE,
      label: placeholder,
      disabled: true,
    },
    ...options,
  ];
}

export function SelectDropdown({
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
  isRtl: isRtlProp,
  "aria-label": ariaLabel,
}: SelectDropdownProps) {
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

  const allOptions = useMemo(
    () => buildOptions(placeholder, options),
    [placeholder, options],
  );

  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue ?? SELECT_DROPDOWN_EMPTY_VALUE,
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleChange = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  const selectedOption = allOptions.find(
    (option) => option.value === currentValue,
  );
  const hasSelection =
    selectedOption != null &&
    selectedOption.value !== SELECT_DROPDOWN_EMPTY_VALUE;

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
        aria-label={label == null ? ariaLabel : undefined}
        aria-required={isRequired || undefined}
      >
        <div className="relative isolate z-[1]">
          <ListboxButton
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
                "min-w-0 flex-1 truncate",
                isRtl ? "text-end" : "text-left",
                hasSelection
                  ? "font-medium text-text"
                  : "font-normal text-muted",
              )}
            >
              {hasSelection ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn("shrink-0 text-muted", fieldIconSizeClasses[size])}
              aria-hidden
            />
          </ListboxButton>

          <ListboxOptions
            anchor={isRtl ? "bottom end" : "bottom start"}
            transition
            className={cn(panelClasses, "[--anchor-gap:0.5rem]", panelClassName)}
          >
            <div className="py-1">
              {allOptions.map((option) => (
                <ListboxOption
                  key={option.value === "" ? "__placeholder__" : option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    optionBaseClasses,
                    isRtl ? "text-end" : "text-left",
                    optionClassName,
                  )}
                >
                  {option.label}
                </ListboxOption>
              ))}
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
  SelectDropdownOption,
  SelectDropdownProps,
  SelectDropdownSize,
  SelectDropdownVariant,
} from "./types";
export {
  SELECT_DROPDOWN_EMPTY_VALUE,
  SELECT_DROPDOWN_SIZES,
  SELECT_DROPDOWN_VARIANTS,
} from "./types";
