"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../../lib/cn";
import type {
  ToggleButtonColor,
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "./types";

const containerVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-primary-light",
  },
  secondary: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  tertiary: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  inherit: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  danger: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  success: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
};

const slideVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "bg-primary",
    outline: "bg-primary",
    ghost: "bg-page",
  },
  secondary: {
    solid: "bg-secondary",
    outline: "bg-secondary",
    ghost: "bg-secondary-light",
  },
  tertiary: {
    solid: "bg-tertiary-dark",
    outline: "bg-tertiary-dark",
    ghost: "bg-tertiary-light",
  },
  inherit: {
    solid: "bg-inherit-color",
    outline: "bg-inherit-color",
    ghost: "bg-inherit-color/15",
  },
  danger: {
    solid: "bg-danger",
    outline: "bg-danger",
    ghost: "bg-danger/10",
  },
  success: {
    solid: "bg-success",
    outline: "bg-success",
    ghost: "bg-success/10",
  },
};

const activeLabelVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-text",
  },
  secondary: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-secondary",
  },
  tertiary: {
    solid: "text-text",
    outline: "text-text",
    ghost: "text-tertiary-dark",
  },
  inherit: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-inherit-color",
  },
  danger: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-danger",
  },
  success: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-success",
  },
};

const inactiveLabelVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-primary-dark",
  },
  secondary: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-secondary",
  },
  tertiary: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-tertiary-dark",
  },
  inherit: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-inherit-color",
  },
  danger: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-danger",
  },
  success: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-success",
  },
};

const containerSizeClasses: Record<ToggleButtonSize, string> = {
  sm: "p-0.5",
  md: "p-1",
  lg: "p-1",
};

const segmentSizeClasses: Record<ToggleButtonSize, string> = {
  sm: "gap-1 px-3 py-1.5 text-sm",
  md: "gap-1.5 px-4 py-2 text-[14px]",
  lg: "gap-2 px-5 py-2.5 text-base",
};

const iconSizeClasses: Record<ToggleButtonSize, string> = {
  sm: "size-3.5 shrink-0",
  md: "size-4 shrink-0",
  lg: "size-[1.125rem] shrink-0",
};

function ToggleButtonIcon({
  icon,
  size,
}: {
  icon: ReactNode;
  size: ToggleButtonSize;
}) {
  return (
    <span
      className={cn("inline-flex [&>svg]:size-full", iconSizeClasses[size])}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export function ToggleButton<T extends string = string>({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  color = "primary",
  variant = "solid",
  size = "md",
  isRounded = false,
  fullWidth = false,
  className,
  disabled = false,
  "aria-label": ariaLabel,
  id,
}: ToggleButtonProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLElement | null)[]>([]);
  const [indicator, setIndicator] = useState({
    width: 0,
    left: 0,
    top: 0,
    height: 0,
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<T>(
    () => defaultValue ?? items[0]?.value ?? ("" as T),
  );
  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : uncontrolledValue;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === selectedValue),
  );

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const segment = segmentRefs.current[activeIndex];
    if (!container || !segment) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const segmentRect = segment.getBoundingClientRect();
    setIndicator({
      left: segmentRect.left - containerRect.left,
      width: segmentRect.width,
      top: segmentRect.top - containerRect.top,
      height: segmentRect.height,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateIndicator();
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(container);
    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator, items, selectedValue, size, fullWidth, variant]);

  const handleItemClick = (
    item: (typeof items)[number],
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (disabled || item.disabled) {
      return;
    }
    if (!isControlled) {
      setUncontrolledValue(item.value);
    }
    onChange?.(item.value);
    item.onClick?.(event);
  };

  const roundedContainer = isRounded ? "rounded-full" : "rounded-lg";
  const roundedSlide = isRounded ? "rounded-full" : "rounded-md";

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      ref={containerRef}
      className={cn(
        "relative inline-flex",
        roundedContainer,
        containerSizeClasses[size],
        containerVariantClasses[color][variant],
        fullWidth && "flex w-full",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-0 transition-[left,width,top,height] duration-300 ease-out",
          roundedSlide,
          slideVariantClasses[color][variant],
        )}
        style={{
          left: indicator.left,
          width: indicator.width,
          top: indicator.top,
          height: indicator.height,
          opacity: indicator.width > 0 ? 1 : 0,
        }}
      />
      {items.map((item, index) => {
        const isSelected = selectedValue === item.value;
        const isItemDisabled = disabled || item.disabled;

        return (
          <HeadlessButton
            key={String(item.value)}
            ref={(node) => {
              segmentRefs.current[index] = node;
            }}
            type="button"
            disabled={isItemDisabled}
            aria-pressed={isSelected}
            aria-disabled={isItemDisabled || undefined}
            onClick={(event) => handleItemClick(item, event)}
            className={cn(
              "relative z-10 inline-flex min-w-0 flex-1 items-center justify-center font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
              "data-disabled:cursor-not-allowed data-disabled:opacity-50",
              segmentSizeClasses[size],
              isSelected
                ? activeLabelVariantClasses[color][variant]
                : inactiveLabelVariantClasses[color][variant],
              roundedSlide,
            )}
          >
            {item.iconStart != null && (
              <ToggleButtonIcon icon={item.iconStart} size={size} />
            )}
            <span className="truncate">{item.label}</span>
            {item.iconEnd != null && (
              <ToggleButtonIcon icon={item.iconEnd} size={size} />
            )}
          </HeadlessButton>
        );
      })}
    </div>
  );
}

export {
  TOGGLE_BUTTON_COLORS,
  TOGGLE_BUTTON_SIZES,
  TOGGLE_BUTTON_VARIANTS,
} from "./types";
export type {
  ToggleButtonColor,
  ToggleButtonItem,
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "./types";
