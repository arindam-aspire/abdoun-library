import type { FocusEvent, ReactNode } from "react";
import {
  UI_CONTROL_SIZES,
  UI_FIELD_VARIANTS,
  type UiControlSize,
  type UiFieldVariant,
} from "../commonTypes";

export const SELECT_VARIANTS = UI_FIELD_VARIANTS;

export type SelectVariant = UiFieldVariant;

export const SELECT_SIZES = UI_CONTROL_SIZES;

export type SelectSize = UiControlSize;

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps {
  options: SelectOption[];
  variant?: SelectVariant;
  size?: SelectSize;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
  selectClassName?: string;
  iconClassName?: string;
  optionClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
}
