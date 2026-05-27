"use client";

import { useState } from "react";
import { cn } from "../../../lib/cn";
import type { TabItem, TabProps } from "./types";

export function Tab<T extends string = string>({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  className,
  disabled = false,
  "aria-label": ariaLabel,
  id,
}: TabProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(
    () => defaultValue ?? items[0]?.value ?? ("" as T),
  );
  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : uncontrolledValue;

  const handleSelect = (nextValue: T, itemDisabled?: boolean) => {
    if (disabled || itemDisabled) {
      return;
    }
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div
      id={id}
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex border-b border-secondary/15", className)}
    >
      {items.map((item) => {
        const isSelected = selectedValue === item.value;
        const isItemDisabled = disabled || item.disabled;

        return (
          <TabTrigger
            key={String(item.value)}
            item={item}
            isSelected={isSelected}
            disabled={isItemDisabled}
            onSelect={() => handleSelect(item.value, item.disabled)}
          />
        );
      })}
    </div>
  );
}

function TabTrigger<T extends string>({
  item,
  isSelected,
  disabled,
  onSelect,
}: {
  item: TabItem<T>;
  isSelected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isSelected
          ? "border-secondary text-secondary"
          : "border-transparent text-muted hover:text-text",
      )}
    >
      {item.icon != null ? (
        <span
          className="inline-flex size-4 shrink-0 [&>svg]:size-full"
          aria-hidden
        >
          {item.icon}
        </span>
      ) : null}
      <span>{item.label}</span>
    </button>
  );
}

export type { TabItem, TabProps } from "./types";
