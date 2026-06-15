import type { UiControlSize } from "../commonTypes";

export const PROGRESS_BAR_SIZES = ["sm", "md", "lg"] as const;

export type ProgressBarSize = (typeof PROGRESS_BAR_SIZES)[number];

export const PROGRESS_BAR_TONES = ["default", "primary", "secondary"] as const;

export type ProgressBarTone = (typeof PROGRESS_BAR_TONES)[number];

export interface ProgressBarProps {
  /** Completion percentage from 0 to 100. */
  value: number;
  /** When set with `totalSteps`, shows e.g. `4 OF 8 STEPS` above the track. */
  currentStep?: number;
  totalSteps?: number;
  /** Show the percentage label. Default `true`. */
  showPercentage?: boolean;
  /** Show the step count label when `currentStep` and `totalSteps` are set. Default `true`. */
  showStepCount?: boolean;
  /** Fill + percentage label color. Default `default`. */
  tone?: ProgressBarTone;
  size?: ProgressBarSize;
  className?: string;
  "aria-label"?: string;
}
