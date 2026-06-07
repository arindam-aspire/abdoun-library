"use client";

import { Field, Label } from "@headlessui/react";
import { forwardRef, useId, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  fieldControlSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldIconSizeClasses,
  fieldLabelSizeClasses,
} from "../responsiveSizes";
import {
  inheritOutlineFocusWithinClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import type { InputProps, InputSize, InputVariant } from "./types";

const variantClasses: Record<InputVariant, string> = {
  outline: cn(inheritOutlineVariantClasses, inheritOutlineFocusWithinClasses),
  ghost: cn(
    "border border-transparent bg-transparent shadow-none",
    "hover:border-secondary/30 hover:bg-page",
    "focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary-dark/12",
  ),
  clear: cn(
    "border-0 bg-transparent shadow-none",
    "hover:bg-page/80",
    "focus-within:ring-2 focus-within:ring-secondary-dark/12",
  ),
};

const controlWrapperClasses = cn(
  "flex w-full items-center rounded-xl text-text transition-colors outline-none",
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
);

const inputClasses = cn(
  "min-w-0 flex-1 border-0 bg-transparent p-0 font-normal text-text shadow-none outline-none",
  "placeholder:font-normal placeholder:text-muted disabled:cursor-not-allowed",
);

function InputIcon({
  icon,
  size,
  className,
}: {
  icon: ReactNode;
  size: InputSize;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 text-muted [&>svg]:size-full",
        fieldIconSizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = "outline",
    size = "md",
    label,
    labelClassName,
    error,
    hint,
    isRequired = false,
    fullWidth = true,
    wrapperClassName,
    inputClassName,
    iconStart,
    iconEnd,
    iconClassName,
    className,
    id: idProp,
    disabled,
    placeholder,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <Field
      disabled={disabled}
      className={cn(fullWidth && "w-full", wrapperClassName, className)}
    >
      {label != null && (
        <Label
          htmlFor={inputId}
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

      <div
        className={cn(
          controlWrapperClasses,
          fieldControlSizeClasses[size],
          variantClasses[variant],
          hasError &&
            "border-danger hover:border-danger focus-within:border-danger focus-within:ring-danger/20",
        )}
      >
        {iconStart != null && (
          <InputIcon icon={iconStart} size={size} className={iconClassName} />
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={label == null ? ariaLabel : undefined}
          aria-required={isRequired || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(inputClasses, inputClassName)}
          {...rest}
        />
        {iconEnd != null && (
          <InputIcon icon={iconEnd} size={size} className={iconClassName} />
        )}
      </div>

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
});

export type { InputProps, InputSize, InputVariant } from "./types";
export { INPUT_SIZES, INPUT_VARIANTS } from "./types";
