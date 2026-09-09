"use client";

import { Field, Label } from "@headlessui/react";
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { cn } from "../../../lib/cn";
import {
  inheritOutlineFocusWithinClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import {
  fieldControlSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
  phoneInputCountrySegmentGhostClasses,
  phoneInputCountrySegmentSolidClasses,
  phoneInputDividerClasses,
  phoneInputFieldPaddingClasses,
  phoneInputShellSizeClasses,
  phoneInputTextSizeClasses,
  phoneInputTrackClasses,
} from "../responsiveSizes";
import type {
  PriceInputCurrencyPosition,
  PriceInputProps,
  PriceInputSize,
  PriceInputVariant,
} from "./types";
import {
  formatPriceValue,
  parsePriceDisplay,
  sanitizePriceValue,
} from "./utils";

const shellVariantClasses: Record<PriceInputVariant, string> = {
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

const currencySegmentVariantClasses: Record<
  PriceInputVariant,
  string | undefined
> = {
  outline: phoneInputCountrySegmentSolidClasses,
  ghost: phoneInputCountrySegmentGhostClasses,
  clear: undefined,
};

function CurrencyBadge({
  currency,
  size,
  variant,
}: {
  currency: string;
  size: PriceInputSize;
  variant: PriceInputVariant;
}) {
  const segmentClasses = currencySegmentVariantClasses[variant];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold tracking-wide text-secondary",
        segmentClasses,
        !segmentClasses &&
          cn(fieldControlSizeClasses[size], "px-0 font-medium text-muted"),
      )}
    >
      {currency}
    </span>
  );
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  function PriceInput(
    {
      label,
      labelClassName,
      error,
      hint,
      isRequired = false,
      fullWidth = true,
      className,
      wrapperClassName,
      inputClassName,
      value: valueProp,
      defaultValue = "",
      onChange,
      currency = "JOD",
      currencyPosition = "start",
      showCurrency = true,
      allowDecimals = true,
      maxDecimalPlaces = 2,
      variant = "outline",
      size = "md",
      disabled,
      placeholder = "0.00",
      name,
      id: idProp,
      onBlur,
      onFocus,
      dir: dirProp,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const isRtl = useMemo(() => {
      if (dirProp !== undefined) {
        return dirProp === "rtl";
      }

      if (typeof document === "undefined") {
        return false;
      }

      return document.documentElement.dir === "rtl";
    }, [dirProp]);

    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const hasError = Boolean(error);

    const [internalValue, setInternalValue] = useState(defaultValue);

    const rawValue = valueProp ?? internalValue;
    const displayValue = formatPriceValue(rawValue);

    const describedBy =
      [hasError ? errorId : null, !hasError && hint ? hintId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const emitChange = (nextValue: string) => {
      if (valueProp == null) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextRawValue = sanitizePriceValue(
        parsePriceDisplay(event.target.value),
        allowDecimals,
        maxDecimalPlaces,
      );

      emitChange(nextRawValue);
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      const trimmedValue = rawValue.endsWith(".")
        ? rawValue.slice(0, -1)
        : rawValue;

      if (trimmedValue !== rawValue) {
        emitChange(trimmedValue);
      }

      onBlur?.(event);
    };

    const currencyBadge = showCurrency ? (
      <CurrencyBadge currency={currency} size={size} variant={variant} />
    ) : null;

    const resolvedCurrencyPosition =
      isRtl && currencyPosition === "start"
        ? "end"
        : isRtl && currencyPosition === "end"
          ? "start"
          : currencyPosition;

    return (
      <Field
        disabled={disabled}
        dir={isRtl ? "rtl" : "ltr"}
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
            "relative flex w-full transition-colors",
            phoneInputShellSizeClasses,
            shellVariantClasses[variant],
            disabled && "cursor-not-allowed opacity-50",
            hasError &&
              "border-danger hover:border-danger focus-within:border-danger focus-within:bg-surface focus-within:ring-danger/20",
          )}
        >
          <div className={phoneInputTrackClasses}>
            {resolvedCurrencyPosition === "start" ? currencyBadge : null}

            {showCurrency && resolvedCurrencyPosition === "start" ? (
              <div className={phoneInputDividerClasses} aria-hidden />
            ) : null}

            <input
              suppressHydrationWarning
              ref={ref}
              id={inputId}
              name={name}
              type="text"
              inputMode={allowDecimals ? "decimal" : "numeric"}
              disabled={disabled}
              value={displayValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              aria-label={label == null ? ariaLabel : undefined}
              aria-required={isRequired || undefined}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              className={cn(
                "min-h-0 min-w-0 flex-1 self-stretch border-0 bg-transparent py-0 text-text outline-none tabular-nums",
                phoneInputTextSizeClasses,
                phoneInputFieldPaddingClasses,
                "placeholder:font-normal placeholder:text-muted",
                disabled && "cursor-not-allowed",
                inputClassName,
              )}
              {...rest}
            />

            {showCurrency && resolvedCurrencyPosition === "end" ? (
              <div className={phoneInputDividerClasses} aria-hidden />
            ) : null}

            {resolvedCurrencyPosition === "end" ? currencyBadge : null}
          </div>
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
  },
);

export type {
  PriceInputCurrencyPosition,
  PriceInputProps,
  PriceInputSize,
  PriceInputVariant,
} from "./types";
export {
  PRICE_INPUT_CURRENCY_POSITIONS,
  PRICE_INPUT_SIZES,
  PRICE_INPUT_VARIANTS,
} from "./types";
export {
  formatPriceValue,
  parsePriceDisplay,
  sanitizePriceValue,
} from "./utils";
