"use client";

import { cn } from "../../../lib/cn";
import { textCaptionClasses } from "../../../lib/typography";
import type { ProgressBarProps, ProgressBarSize, ProgressBarTone } from "./types";

const trackSizeClasses: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-2.5",
};

const labelSizeClasses: Record<ProgressBarSize, string> = {
  sm: "text-[11px] sm:text-xs",
  md: "text-xs sm:text-sm",
  lg: "text-sm sm:text-base",
};

function clampProgress(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

const labelToneClasses: Record<ProgressBarTone, string> = {
  default: "text-text",
  primary: "text-primary",
  secondary: "text-secondary-dark",
};

/** Works with `--inherit-light` in :root even when `@theme` omits `--color-inherit-light`. */
export const progressBarInheritTrackClassName =
  "bg-[var(--inherit-light,color-mix(in_srgb,var(--page)_20%,var(--surface)))]";

const trackToneClasses: Record<ProgressBarTone, string> = {
  default: progressBarInheritTrackClassName,
  primary: "bg-primary-light",
  secondary: progressBarInheritTrackClassName,
};

const indicatorToneClasses: Record<ProgressBarTone, string> = {
  default: "bg-text",
  primary: "bg-primary",
  secondary: "bg-secondary",
};

export function ProgressBar({
  value,
  currentStep,
  totalSteps,
  showPercentage = true,
  showStepCount = true,
  tone = "default",
  size = "md",
  className,
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const clampedValue = clampProgress(value);
  const hasStepCount =
    showStepCount &&
    currentStep != null &&
    totalSteps != null &&
    totalSteps > 0;
  const resolvedAriaLabel =
    ariaLabel ??
    (hasStepCount
      ? `Progress: ${clampedValue} percent, step ${currentStep} of ${totalSteps}`
      : `Progress: ${clampedValue} percent`);

  return (
    <div className={cn("min-w-0", className)}>
      {(showPercentage || hasStepCount) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {showPercentage ? (
            <span
              className={cn(
                "shrink-0 font-semibold tabular-nums",
                labelToneClasses[tone],
                labelSizeClasses[size],
              )}
            >
              {clampedValue}%
            </span>
          ) : (
            <span aria-hidden />
          )}
          {hasStepCount ? (
            <span className={cn("truncate text-end text-muted", textCaptionClasses)}>
              {currentStep} OF {totalSteps} STEPS
            </span>
          ) : null}
        </div>
      )}

      <div
        role="progressbar"
        aria-label={resolvedAriaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
        className={cn(
          "w-full overflow-hidden rounded-full",
          trackToneClasses[tone],
          trackSizeClasses[size],
        )}
      >
        {clampedValue > 0 ? (
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-300 ease-out",
              indicatorToneClasses[tone],
              clampedValue < 100 && "min-w-2",
            )}
            style={{ width: `${clampedValue}%` }}
          />
        ) : null}
      </div>
    </div>
  );
}
