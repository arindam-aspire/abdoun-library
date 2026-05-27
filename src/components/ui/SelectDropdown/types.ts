import type { FocusEvent, ReactNode } from "react";

export const SELECT_DROPDOWN_EMPTY_VALUE = "";

export const SELECT_DROPDOWN_VARIANTS = ["outline", "ghost", "clear"] as const;

export type SelectDropdownVariant = (typeof SELECT_DROPDOWN_VARIANTS)[number];

export const SELECT_DROPDOWN_SIZES = ["sm", "md", "lg"] as const;

export type SelectDropdownSize = (typeof SELECT_DROPDOWN_SIZES)[number];

export type SelectDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectDropdownProps {
  options: SelectDropdownOption[];
  variant?: SelectDropdownVariant;
  size?: SelectDropdownSize;
  placeholder: string;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
  triggerClassName?: string;
  panelClassName?: string;
  optionClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  /** When omitted, RTL is inferred from `document.documentElement.dir`. */
  isRtl?: boolean;
  "aria-label"?: string;
}
