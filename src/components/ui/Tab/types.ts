import type { ReactNode } from "react";

export type TabItem<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  /** Alias of `icon`. */
  iconStart?: ReactNode;
  disabled?: boolean;
};

type TabSharedProps<T extends string> = {
  items: TabItem<T>[];
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
};

export type TabProps<T extends string = string> = TabSharedProps<T> &
  (
    | {
        value: T;
        onChange: (value: T) => void;
        defaultValue?: never;
      }
    | {
        value?: never;
        defaultValue?: T;
        onChange?: (value: T) => void;
      }
  );

export type { TabItem as TabOption };
