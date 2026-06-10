import type { ReactNode } from "react";

export type HorizontalStepperStep = {
  value: string;
  label: string;
  /** When set, shown in the step circle instead of the step counter. */
  icon?: ReactNode;
  /** Alias of `icon`. */
  iconStart?: ReactNode;
};

export interface HorizontalStepperProps {
  steps: HorizontalStepperStep[];
  /** Zero-based index of the current step. */
  activeStep: number;
  /**
   * Furthest step the user has reached. Steps up to this index (except
   * `activeStep`) stay marked completed when navigating backward.
   * Defaults to `activeStep`.
   */
  maxReachedStep?: number;
  onStepClick?: (index: number, step: HorizontalStepperStep) => void;
  className?: string;
  "aria-label"?: string;
}
