"use client";

import { cn } from "../../../lib/cn";
import { Button } from "../Button";
import type { ButtonSize } from "../Button/types";
import type { IconButtonProps } from "./types";

const iconButtonSizeClasses: Record<ButtonSize, string> = {
  sm: "size-9 shrink-0 !px-0",
  md: "size-11 shrink-0 !px-0",
  lg: "size-12 shrink-0 !px-0",
};

export function IconButton({
  icon,
  size = "md",
  className,
  isRounded = false,
  fullWidth = false,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      size={size}
      isRounded={isRounded}
      fullWidth={fullWidth}
      iconStart={icon}
      className={cn(iconButtonSizeClasses[size], className)}
      {...rest}
    />
  );
}

export type { IconButtonProps } from "./types";
