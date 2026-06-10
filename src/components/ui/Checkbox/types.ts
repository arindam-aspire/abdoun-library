import type { ReactNode } from "react";
import {
  UI_CONTROL_SIZES,
  type UiControlSize,
} from "../commonTypes";

export const CHECKBOX_SIZES = UI_CONTROL_SIZES;

export type CheckboxSize = UiControlSize;

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  size?: CheckboxSize;
  className?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
}
