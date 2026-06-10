import type { ReactNode } from "react";
import type { UiControlSize } from "../commonTypes";

export type VerticalStepperStep = {
  value: string;
  label: string;
  /** When set, shown in the step circle instead of the step counter. */
  icon?: ReactNode;
  /** Alias of `icon`. */
  iconStart?: ReactNode;
};

export interface VerticalStepperProps {
  steps: VerticalStepperStep[];
  /** Zero-based index of the current step. */
  activeStep: number;
  /**
   * Furthest step the user has reached. Steps up to this index (except
   * `activeStep`) stay marked completed when navigating backward.
   * Defaults to `activeStep`.
   */
  maxReachedStep?: number;
  onStepClick?: (index: number, step: VerticalStepperStep) => void;
  size?: UiControlSize;
  className?: string;
  "aria-label"?: string;
}
