"use client";

import { cn } from "../../../lib/cn";
import { Button } from "../Button";
import {
  buttonIconSizeClasses,
  iconButtonSizeClasses,
} from "../controlSizes";
import type { IconButtonProps } from "./types";

export function IconButton({
  icon,
  size = "md",
  className,
  isRounded = false,
  fullWidth = false,
  isLoading = false,
  loadingLabel: _loadingLabel,
  ...rest
}: IconButtonProps) {
  const iconNode = (
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

  return (
    <Button
      size={size}
      isRounded={isRounded}
      fullWidth={fullWidth}
      isLoading={isLoading}
      iconStart={iconNode}
      className={cn(
        iconButtonSizeClasses[size],
        "pointer-events-auto shrink-0",
        className,
      )}
      {...rest}
    />
  );
}

export type { IconButtonProps } from "./types";
