import type { InputHTMLAttributes, ReactNode } from "react";

export const INPUT_VARIANTS = ["outline", "ghost", "clear"] as const;

export type InputVariant = (typeof INPUT_VARIANTS)[number];

export const INPUT_SIZES = ["sm", "md", "lg"] as const;

export type InputSize = (typeof INPUT_SIZES)[number];

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
