import type { UiControlSize } from "../commonTypes";
import {
  verticalStepperCircleSizeClasses,
  verticalStepperCounterSizeClasses,
  verticalStepperIconSizeClasses,
  verticalStepperListGapClasses,
  verticalStepperRowSizeClasses,
} from "../responsiveSizes";

type VerticalStepperSizeClasses = {
  row: string;
  circle: string;
  indicator: string;
  label: string;
  check: string;
  counter: string;
  listGap: string;
};

export const verticalStepperSizeClasses: Record<
  UiControlSize,
  VerticalStepperSizeClasses
> = {
  sm: {
    row: verticalStepperRowSizeClasses.sm,
    circle: verticalStepperCircleSizeClasses.sm,
    indicator: verticalStepperIconSizeClasses.sm,
    label: "min-w-0 flex-1 truncate text-left",
    check: verticalStepperIconSizeClasses.sm,
    counter: verticalStepperCounterSizeClasses.sm,
    listGap: verticalStepperListGapClasses.sm,
  },
  md: {
    row: verticalStepperRowSizeClasses.md,
    circle: verticalStepperCircleSizeClasses.md,
    indicator: verticalStepperIconSizeClasses.md,
    label: "min-w-0 flex-1 truncate text-left",
    check: verticalStepperIconSizeClasses.md,
    counter: verticalStepperCounterSizeClasses.md,
    listGap: verticalStepperListGapClasses.md,
  },
  lg: {
    row: verticalStepperRowSizeClasses.lg,
    circle: verticalStepperCircleSizeClasses.lg,
    indicator: verticalStepperIconSizeClasses.lg,
    label: "min-w-0 flex-1 truncate text-left",
    check: verticalStepperIconSizeClasses.lg,
    counter: verticalStepperCounterSizeClasses.lg,
    listGap: verticalStepperListGapClasses.lg,
  },
};
