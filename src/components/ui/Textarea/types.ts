import type { ReactNode, TextareaHTMLAttributes } from "react";

export const TEXTAREA_VARIANTS = ["outline", "ghost", "clear"] as const;

export type TextareaVariant = (typeof TEXTAREA_VARIANTS)[number];

export const TEXTAREA_SIZES = ["sm", "md", "lg"] as const;

export type TextareaSize = (typeof TEXTAREA_SIZES)[number];

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  fullWidth?: boolean;
  wrapperClassName?: string;
  textareaClassName?: string;
}
