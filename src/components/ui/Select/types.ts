import type { FocusEvent, ReactNode } from "react";

export const SELECT_VARIANTS = ["outline", "ghost", "clear"] as const;

export type SelectVariant = (typeof SELECT_VARIANTS)[number];

export const SELECT_SIZES = ["sm", "md", "lg"] as const;

export type SelectSize = (typeof SELECT_SIZES)[number];

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
