"use client";

import {
  Field,
  Label,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDown, Phone, Search } from "lucide-react";
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { cn } from "../../../lib/cn";
import { textBodySmClasses } from "../../../lib/typography";
import {
  inheritOutlineFocusWithinClasses,
  inheritOutlineVariantClasses,
} from "../fieldVariants";
import {
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
  phoneInputCountrySegmentGhostClasses,
  phoneInputCountrySegmentSolidClasses,
  phoneInputDividerClasses,
  phoneInputFieldPaddingClasses,
  phoneInputListItemSizeClasses,
  phoneInputSearchSizeClasses,
  phoneInputShellSizeClasses,
  phoneInputTextSizeClasses,
  phoneInputTrackClasses,
} from "../responsiveSizes";
import {
  countryFlagUrl,
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
  PHONE_INPUT_COUNTRIES,
  type PhoneInputCountry,
} from "./countries";
import type { PhoneInputProps, PhoneInputVariant } from "./types";

const shellVariantClasses: Record<PhoneInputVariant, string> = {
  outline: cn(inheritOutlineVariantClasses, inheritOutlineFocusWithinClasses),
  ghost: cn(
    "border border-transparent bg-transparent shadow-none",
    "hover:border-secondary/30 hover:bg-page",
    "focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary-dark/12",
  ),
};

const countrySegmentVariantClasses: Record<PhoneInputVariant, string> = {
  outline: phoneInputCountrySegmentSolidClasses,
  ghost: phoneInputCountrySegmentGhostClasses,
};

function sanitizeNationalNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      label,
      labelClassName,
      error,
      hint,
      isRequired = false,
      fullWidth = true,
      className,
      wrapperClassName,
      countryCode: countryCodeProp,
      defaultCountryCode = DEFAULT_PHONE_INPUT_COUNTRY_CODE,
      nationalNumber: nationalNumberProp,
      defaultNationalNumber = "",
      onCountryChange,
      onNationalNumberChange,
      onChange,
      searchPlaceholder = "Search country…",
      emptySearchLabel = "No matches",
      showPhoneIcon = true,
      variant = "outline",
      countrySegmentClassName,
      dir: dirProp,
      disabled,
      placeholder = "Enter phone number",
      name,
      id: idProp,
      onBlur,
      onFocus,
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

    const [internalCountryCode, setInternalCountryCode] = useState(
      defaultCountryCode,
    );
    const [internalNationalNumber, setInternalNationalNumber] = useState(
      defaultNationalNumber,
    );
    const [searchQuery, setSearchQuery] = useState("");

    const countryCode = countryCodeProp ?? internalCountryCode;
    const nationalNumber = nationalNumberProp ?? internalNationalNumber;

    const selectedCountry =
      getPhoneInputCountryByCode(countryCode) ??
      getPhoneInputCountryByCode(DEFAULT_PHONE_INPUT_COUNTRY_CODE)!;

    const filteredCountries = useMemo(() => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return PHONE_INPUT_COUNTRIES;
      }

      return PHONE_INPUT_COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.dialCode.includes(query) ||
          country.iso2.toLowerCase().includes(query),
      );
    }, [searchQuery]);

    const emitChange = (country: PhoneInputCountry, nextNational: string) => {
      onChange?.({ country, nationalNumber: nextNational });
    };

    const handleCountrySelect = (country: PhoneInputCountry) => {
      if (countryCodeProp == null) {
        setInternalCountryCode(country.iso2);
      }
      onCountryChange?.(country);
      emitChange(country, nationalNumber);
      setSearchQuery("");
    };

    const handleNationalChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextNational = sanitizeNationalNumber(event.target.value);

      if (nationalNumberProp == null) {
        setInternalNationalNumber(nextNational);
      }

      onNationalNumberChange?.(nextNational);
      emitChange(selectedCountry, nextNational);
    };

    const describedBy =
      [hasError ? errorId : null, !hasError && hint ? hintId : null]
        .filter(Boolean)
        .join(" ") || undefined;

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
            <div
              className={cn(
                countrySegmentVariantClasses[variant],
                countrySegmentClassName,
              )}
            >
              <Popover className="relative shrink-0">
                <PopoverButton
                  type="button"
                  disabled={disabled}
                  aria-label={`${selectedCountry.name}, ${selectedCountry.dialCode}`}
                  className={cn(
                    "inline-flex h-full min-w-12 items-center gap-1 border-0 bg-transparent p-0 shadow-none outline-none",
                    "focus:outline-none focus-visible:outline-none",
                    "data-open:[&_.phone-input-chevron]:rotate-180",
                    disabled && "cursor-not-allowed",
                  )}
                >
                  <img
                    src={countryFlagUrl(selectedCountry.iso2)}
                    alt=""
                    width={40}
                    height={28}
                    className="h-7 w-10 shrink-0 rounded-sm object-cover sm:h-8"
                  />
                  <ChevronDown
                    className="phone-input-chevron size-3.5 shrink-0 text-muted transition-transform duration-100 sm:size-4"
                    aria-hidden
                  />
                </PopoverButton>

                <PopoverPanel
                  anchor={isRtl ? "bottom end" : "bottom start"}
                  className={cn(
                    "z-[100] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-secondary/20 bg-surface p-0 shadow-lg",
                    "transition duration-100 data-closed:scale-95 data-closed:opacity-0",
                  )}
                >
                  <div className="border-b border-secondary/15 p-1.5 sm:p-2">
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted sm:start-3 sm:size-4"
                        aria-hidden
                      />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        className={cn(
                          phoneInputSearchSizeClasses,
                          "text-text placeholder:text-muted focus:border-secondary-dark focus:outline-none",
                        )}
                      />
                    </div>
                  </div>

                  <ul
                    className="max-h-64 overflow-y-auto py-1"
                    role="listbox"
                    aria-label={searchPlaceholder}
                  >
                    {filteredCountries.length === 0 ? (
                      <li
                        className={cn(
                          "px-2.5 py-4 text-center text-muted sm:px-3 sm:py-6",
                          textBodySmClasses,
                        )}
                      >
                        {emptySearchLabel}
                      </li>
                    ) : (
                      filteredCountries.map((country) => {
                        const isSelected =
                          country.iso2 === selectedCountry.iso2;

                        return (
                          <li key={country.iso2}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleCountrySelect(country)}
                              className={cn(
                                phoneInputListItemSizeClasses,
                                "hover:bg-page focus:bg-page focus:outline-none",
                                isSelected && "bg-primary-light",
                              )}
                            >
                              <img
                                src={countryFlagUrl(country.iso2)}
                                alt=""
                                width={28}
                                height={20}
                                className="h-5 w-7 shrink-0 rounded-sm object-cover"
                              />
                              <span className="min-w-0 flex-1 truncate">
                                {country.name}
                              </span>
                              <span className="shrink-0 tabular-nums text-muted">
                                {country.dialCode}
                              </span>
                            </button>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </PopoverPanel>
              </Popover>
            </div>

            <div className={phoneInputDividerClasses} aria-hidden />

            <input
              ref={ref}
              id={inputId}
              name={name}
              type="tel"
              inputMode="numeric"
              disabled={disabled}
              value={nationalNumber}
              onChange={handleNationalChange}
              onBlur={onBlur}
              onFocus={onFocus}
              placeholder={placeholder}
              aria-label={label == null ? ariaLabel : undefined}
              aria-required={isRequired || undefined}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy}
              className={cn(
                "min-h-0 min-w-0 flex-1 self-stretch border-0 bg-transparent py-0 text-text outline-none",
                phoneInputTextSizeClasses,
                phoneInputFieldPaddingClasses,
                "placeholder:font-normal placeholder:text-muted",
                showPhoneIcon && "pe-7 sm:pe-8",
                disabled && "cursor-not-allowed",
              )}
              {...rest}
            />
          </div>

          {showPhoneIcon && (
            <Phone
              className="pointer-events-none absolute end-2 top-1/2 size-4 -translate-y-1/2 text-muted sm:end-2.5 sm:size-5"
              aria-hidden
            />
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
  },
);

export type { PhoneInputProps } from "./types";
export {
  countryFlagUrl,
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
  PHONE_INPUT_COUNTRIES,
  type PhoneInputCountry,
} from "./countries";
export { PHONE_INPUT_VARIANTS } from "./types";
