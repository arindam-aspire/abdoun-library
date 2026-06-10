import type { FocusEvent, ReactNode } from "react";
import {
  UI_CONTROL_SIZES,
  UI_FIELD_VARIANTS,
  type UiControlSize,
  type UiFieldVariant,
} from "../commonTypes";

export const MULTI_SELECT_DROPDOWN_VARIANTS = UI_FIELD_VARIANTS;

export type MultiSelectDropdownVariant = UiFieldVariant;

export const MULTI_SELECT_DROPDOWN_SIZES = UI_CONTROL_SIZES;

export type MultiSelectDropdownSize = UiControlSize;

export type MultiSelectDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface MultiSelectDropdownProps {
  options: MultiSelectDropdownOption[];
  variant?: MultiSelectDropdownVariant;
  size?: MultiSelectDropdownSize;
  placeholder: string;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
  hasLeadingIcon?: boolean;
  triggerClassName?: string;
  panelClassName?: string;
  optionClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  emptyMessage?: string;
  isRtl?: boolean;
  "aria-label"?: string;
}
