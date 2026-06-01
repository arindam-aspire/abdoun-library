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
import { useId } from "react";
import { cn } from "../../../lib/cn";
import {
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldIconSizeClasses,
  fieldLabelSizeClasses,
  dropdownPanelSizeClasses,
  selectOptionSizeClasses,
  selectTriggerSizeClasses,
} from "../controlSizes";
import {
  inheritOutlineDataHoverClasses,
  inheritOutlineFocusVisibleClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import type { SelectProps, SelectVariant } from "./types";

const variantClasses: Record<SelectVariant, string> = {
  outline: cn(
    inheritOutlineVariantClasses,
    inheritOutlineDataHoverClasses,
    inheritOutlineFocusVisibleClasses,
  ),
  ghost:
    "border-0 bg-transparent data-hover:bg-primary-light/50 data-hover:text-text",
  clear:
    "border-0 bg-transparent shadow-none data-hover:bg-page/80 data-hover:text-text",
};

const triggerBaseClasses =
  "relative inline-flex w-full items-center rounded-lg bg-surface text-start text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 data-disabled:cursor-not-allowed data-disabled:opacity-50";

const optionClasses = cn(
  "cursor-pointer text-text transition-colors data-focus:bg-primary data-focus:text-white data-selected:bg-primary data-selected:text-white data-disabled:cursor-not-allowed data-disabled:opacity-50",
  selectOptionSizeClasses,
);

export function Select({
  options,
  variant = "outline",
  size = "md",
  label,
  labelClassName,
  error,
  hint,
  isRequired = false,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  fullWidth = true,
  wrapperClassName,
  selectClassName,
  iconClassName,
  optionClassName,
  className,
  name,
  id: idProp,
  disabled = false,
  autoFocus = false,
  "aria-label": ariaLabel,
}: SelectProps) {
  const generatedId = useId();
  const selectId = idProp ?? generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder ?? "";

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
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
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
              variantClasses[variant],
              selectTriggerSizeClasses[size],
              hasError &&
                "border-danger focus-visible:ring-danger/30 data-hover:border-danger",
              selectClassName,
            )}
          >
            <span
              className={cn(
                "block truncate",
                !selectedOption && placeholder && "text-muted",
              )}
            >
              {displayLabel}
            </span>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute top-1/2 end-2 -translate-y-1/2 text-muted sm:end-3",
                fieldIconSizeClasses[size],
                iconClassName,
              )}
              aria-hidden
            />
          </ListboxButton>

          <ListboxOptions
            anchor="bottom start"
            transition
            className={cn(
              "z-50 mt-1 max-h-60 w-(--button-width) overflow-auto rounded-xl border border-secondary/20 bg-surface shadow-lg [--anchor-gap:0.25rem] focus:outline-none",
              dropdownPanelSizeClasses,
            )}
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(optionClasses, optionClassName)}
              >
                {option.label}
              </ListboxOption>
            ))}
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
  SelectOption,
  SelectProps,
  SelectSize,
  SelectVariant,
} from "./types";
export { SELECT_SIZES, SELECT_VARIANTS } from "./types";
