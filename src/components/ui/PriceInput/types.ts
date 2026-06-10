import type { InputHTMLAttributes, ReactNode } from "react";
import {
  UI_CONTROL_SIZES,
  UI_FIELD_VARIANTS,
  type UiControlSize,
  type UiFieldVariant,
} from "../commonTypes";

export const PRICE_INPUT_VARIANTS = ["outline", "ghost", "clear"] as const;

export type PriceInputVariant = Extract<
  UiFieldVariant,
  (typeof PRICE_INPUT_VARIANTS)[number]
>;

export const PRICE_INPUT_SIZES = UI_CONTROL_SIZES;

export type PriceInputSize = UiControlSize;

export const PRICE_INPUT_CURRENCY_POSITIONS = ["start", "end"] as const;

export type PriceInputCurrencyPosition =
  (typeof PRICE_INPUT_CURRENCY_POSITIONS)[number];

export interface PriceInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange" | "type" | "inputMode"
  > {
  variant?: PriceInputVariant;
  size?: PriceInputSize;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  fullWidth?: boolean;
  className?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  currency?: string;
  currencyPosition?: PriceInputCurrencyPosition;
  showCurrency?: boolean;
  allowDecimals?: boolean;
  maxDecimalPlaces?: number;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}
