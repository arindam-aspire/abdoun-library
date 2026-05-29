import type { InputHTMLAttributes, ReactNode } from "react";
import {
  UI_CONTROL_SIZES,
  UI_FIELD_VARIANTS,
  type UiControlSize,
  type UiFieldVariant,
} from "../commonTypes";

export const INPUT_VARIANTS = UI_FIELD_VARIANTS;

export type InputVariant = UiFieldVariant;

export const INPUT_SIZES = UI_CONTROL_SIZES;

export type InputSize = UiControlSize;

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  iconClassName?: string;
}
