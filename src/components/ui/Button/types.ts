import type { AriaRole, MouseEventHandler, ReactNode } from "react";

export const BUTTON_COLORS = [
  "primary",
  "secondary",
  "tertiary",
  "inherit",
  "danger",
  "success",
] as const;

export type ButtonColor = (typeof BUTTON_COLORS)[number];

export const BUTTON_VARIANTS = ["solid", "ghost", "outline"] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_SIZES = ["sm", "md", "lg"] as const;

export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_TYPES = ["button", "submit", "reset"] as const;

export type ButtonType = (typeof BUTTON_TYPES)[number];

export interface ButtonProps {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  fullWidth?: boolean;
  isRounded?: boolean;
  className?: string;
  children?: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
  "aria-label"?: string;
  role?: AriaRole;
  "aria-checked"?: boolean;
  "aria-pressed"?: boolean;
}
