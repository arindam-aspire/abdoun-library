"use client";

import { Checkbox as HeadlessCheckbox, Field, Label } from "@headlessui/react";
import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "../../../lib/cn";
import { textBodySmClasses } from "../../../lib/typography";
import type { CheckboxProps, CheckboxSize } from "./types";

const boxSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-4 rounded-[0.3rem]",
  md: "size-5 rounded-md",
  lg: "size-5 rounded-md sm:size-6",
};

const iconSizeClasses: Record<CheckboxSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

export const Checkbox = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
  labelClassName,
  id: idProp,
  name,
}: CheckboxProps) => {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;

  return (
    <Field
      disabled={disabled}
      className={cn("flex items-start gap-3", className)}
    >
      <HeadlessCheckbox
        id={inputId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "group mt-0.5 inline-flex shrink-0 items-center justify-center border border-secondary/20 bg-surface text-white transition-colors",
          "data-checked:border-primary data-checked:bg-primary",
          "data-hover:border-secondary/35 data-hover:bg-page",
          "data-checked:data-hover:border-primary-dark data-checked:data-hover:bg-primary-dark",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
          boxSizeClasses[size],
        )}
      >
        <Check
          className={cn(
            "opacity-0 transition-opacity group-data-checked:opacity-100",
            iconSizeClasses[size],
          )}
          aria-hidden
        />
      </HeadlessCheckbox>

      {(label != null || description != null) && (
        <div className="min-w-0 flex-1">
          {label != null ? (
            <Label
              htmlFor={inputId}
              className={cn(
                "block cursor-pointer font-medium text-text",
                textBodySmClasses,
                labelClassName,
              )}
            >
              {label}
            </Label>
          ) : null}
          {description != null ? (
            <p className={cn("mt-0.5 text-muted", textBodySmClasses)}>
              {description}
            </p>
          ) : null}
        </div>
      )}
    </Field>
  );
};

export type { CheckboxProps, CheckboxSize } from "./types";
export { CHECKBOX_SIZES } from "./types";
