"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  buttonIconSizeClasses,
  buttonSizeClasses,
} from "../responsiveSizes";
import type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./types";

const baseClasses =
  "inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 data-disabled:cursor-not-allowed data-disabled:opacity-50";

const colorVariantClasses: Record<
  ButtonColor,
  Record<ButtonVariant, string>
> = {
  primary: {
    solid:
      "bg-primary text-white data-hover:bg-primary-dark data-active:bg-primary-dark",
    ghost:
      "bg-transparent text-primary-dark data-hover:bg-primary-light data-active:bg-primary-light",
    outline:
      "border border-primary bg-transparent text-primary-dark data-hover:bg-primary-light data-active:bg-primary-light",
  },
  secondary: {
    solid:
      "bg-secondary text-white data-hover:bg-secondary-dark data-active:bg-secondary-dark",
    ghost:
      "bg-transparent text-secondary data-hover:bg-secondary-light data-active:bg-secondary-light",
    outline:
      "border border-secondary bg-transparent text-secondary data-hover:bg-secondary-light data-active:bg-secondary-light",
  },
  tertiary: {
    solid:
      "bg-tertiary text-text data-hover:bg-tertiary-dark data-active:bg-tertiary-dark",
    ghost:
      "bg-transparent text-tertiary-dark data-hover:bg-tertiary-light data-active:bg-tertiary-light",
    outline:
      "border border-tertiary-dark bg-transparent text-tertiary-dark data-hover:bg-tertiary-light data-active:bg-tertiary-light",
  },
  inherit: {
    solid:
      "bg-inherit-color text-white data-hover:opacity-90 data-active:opacity-80",
    ghost:
      "bg-transparent text-text data-hover:bg-page data-active:bg-page",
    outline:
      "border border-secondary/15 bg-surface text-text data-hover:bg-page data-active:bg-page",
  },
  danger: {
    solid:
      "bg-danger text-white data-hover:opacity-90 data-active:opacity-80",
    ghost:
      "bg-transparent text-danger data-hover:bg-danger/10 data-active:bg-danger/15",
    outline:
      "border border-danger bg-transparent text-danger data-hover:bg-danger/10 data-active:bg-danger/15",
  },
  success: {
    solid:
      "bg-success text-white data-hover:opacity-90 data-active:opacity-80",
    ghost:
      "bg-transparent text-success data-hover:bg-success/10 data-active:bg-success/15",
    outline:
      "border border-success bg-transparent text-success data-hover:bg-success/10 data-active:bg-success/15",
  },
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ButtonIcon({
  icon,
  size,
}: {
  icon: ReactNode;
  size: ButtonSize;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 [&>svg]:size-full",
        buttonIconSizeClasses[size],
      )}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export function Button({
  color = "primary",
  variant = "solid",
  size = "md",
  fullWidth = false,
  isRounded = false,
  className,
  children,
  iconStart,
  iconEnd,
  isLoading = false,
  loadingLabel,
  type = "button",
  disabled,
  onClick,
  autoFocus,
  id,
  "aria-label": ariaLabel,
  role,
  "aria-checked": ariaChecked,
}: ButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);
  const label = isLoading ? (loadingLabel ?? children) : children;

  return (
    <HeadlessButton
      suppressHydrationWarning
      id={id}
      type={type}
      disabled={isDisabled}
      autoFocus={autoFocus}
      role={role}
      aria-label={ariaLabel}
      aria-checked={ariaChecked}
      aria-busy={isLoading || undefined}
      aria-disabled={isDisabled || undefined}
      onClick={onClick}
      className={cn(
        baseClasses,
        isRounded ? "rounded-full" : "rounded-lg",
        colorVariantClasses[color][variant],
        buttonSizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {isLoading ? (
        <>
          <Loader2
            className={cn("shrink-0 animate-spin", buttonIconSizeClasses[size])}
            aria-hidden
          />
          {label != null && label !== false && (
            <span className="truncate">{label}</span>
          )}
        </>
      ) : (
        <>
          {iconStart != null && <ButtonIcon icon={iconStart} size={size} />}
          {children != null && children !== false && (
            <span className="truncate">{children}</span>
          )}
          {iconEnd != null && <ButtonIcon icon={iconEnd} size={size} />}
        </>
      )}
    </HeadlessButton>
  );
}

export type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  ButtonType,
} from "./types";
export {
  BUTTON_COLORS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from "./types";
