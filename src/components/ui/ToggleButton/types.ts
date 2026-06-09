import type { MouseEventHandler, ReactNode } from "react";
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from "../Button/types";

export type ToggleButtonColor = ButtonColor;
export type ToggleButtonVariant = ButtonVariant;
export type ToggleButtonSize = ButtonSize;

export {
  BUTTON_COLORS as TOGGLE_BUTTON_COLORS,
  BUTTON_SIZES as TOGGLE_BUTTON_SIZES,
  BUTTON_VARIANTS as TOGGLE_BUTTON_VARIANTS,
} from "../Button/types";

export type ToggleButtonItem<T extends string = string> = {
  value: T;
  label: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ToggleButtonSharedProps<T extends string> = {
  items: ToggleButtonItem<T>[];
  color?: ToggleButtonColor;
  variant?: ToggleButtonVariant;
  size?: ToggleButtonSize;
  isRounded?: boolean;
  fullWidth?: boolean;
  className?: string;
  /** Merged onto each segment button (e.g. responsive size overrides). */
  segmentClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
};

export type ToggleButtonProps<T extends string = string> =
  ToggleButtonSharedProps<T> &
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
