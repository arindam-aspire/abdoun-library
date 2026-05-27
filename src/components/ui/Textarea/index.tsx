"use client";

import { Field, Label } from "@headlessui/react";
import { forwardRef, useId } from "react";
import { cn } from "../../../lib/cn";
import {
  inheritOutlineFocusVisibleClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import type { TextareaProps, TextareaSize, TextareaVariant } from "./types";

const sizeClasses: Record<TextareaSize, string> = {
  sm: "min-h-[4.5rem] px-3 py-2 text-sm",
  md: "min-h-[5.5rem] px-4 py-2.5 text-sm",
  lg: "min-h-[6.5rem] px-5 py-3 text-base",
};

const variantClasses: Record<TextareaVariant, string> = {
  outline: cn(
    inheritOutlineVariantClasses,
    inheritOutlineFocusVisibleClasses,
  ),
  ghost: cn(
    "border-0 bg-page-ghost shadow-none",
    "hover:bg-primary-light/50",
    "focus-visible:ring-2 focus-visible:ring-secondary-dark/12",
  ),
  clear: cn(
    "border-0 bg-transparent shadow-none",
    "hover:bg-page-ghost",
    "focus-visible:ring-2 focus-visible:ring-secondary-dark/12",
  ),
};

const controlBaseClasses = cn(
  "w-full resize-y rounded-xl text-text transition-colors placeholder:text-muted",
  "outline-none disabled:cursor-not-allowed disabled:opacity-50",
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
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
      textareaClassName,
      className,
      id: idProp,
      disabled,
      rows = 4,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const textareaId = idProp ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;
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
            htmlFor={textareaId}
            className={cn(
              "mb-1.5 block text-sm font-medium text-text",
              labelClassName,
            )}
          >
            {label}
            {isRequired && (
              <span className="ms-0.5 text-danger" aria-hidden>
                *
              </span>
            )}
          </Label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-label={label == null ? ariaLabel : undefined}
          aria-required={isRequired || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(
            controlBaseClasses,
            sizeClasses[size],
            variantClasses[variant],
            hasError &&
              (variant === "ghost" || variant === "clear"
                ? "bg-danger/5 ring-2 ring-danger/30 focus-visible:ring-danger/40"
                : "border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20"),
            textareaClassName,
          )}
          {...rest}
        />

        {hasError && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}

        {!hasError && hint != null && (
          <p id={hintId} className="mt-1.5 text-sm text-muted">
            {hint}
          </p>
        )}
      </Field>
    );
  },
);

export type { TextareaProps, TextareaSize, TextareaVariant } from "./types";
export { TEXTAREA_SIZES, TEXTAREA_VARIANTS } from "./types";
