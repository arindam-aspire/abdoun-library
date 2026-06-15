"use client";

import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { horizontalStepperThemeClasses } from "../stepperThemeClasses";
import type { HorizontalStepperProps, HorizontalStepperStep } from "./types";

type StepState = "completed" | "active" | "default";

const STEP_CIRCLE_CLASS =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-full sm:size-8";

const STEP_LABEL_CLASS =
  "mt-2 hidden w-full truncate text-center text-[10px] font-medium tracking-[0.08em] uppercase sm:block sm:text-[11px]";

function resolveStepState(
  index: number,
  activeStep: number,
  maxReachedStep: number,
): StepState {
  if (index === activeStep) {
    return "active";
  }

  if (index <= maxReachedStep) {
    return "completed";
  }

  return "default";
}

function connectorToneClass(isCompletedSegment: boolean) {
  return isCompletedSegment
    ? horizontalStepperThemeClasses.connector.completed
    : horizontalStepperThemeClasses.connector.default;
}

function circleToneClass(state: StepState) {
  switch (state) {
    case "completed":
      return horizontalStepperThemeClasses.circle.completed;
    case "active":
      return horizontalStepperThemeClasses.circle.active;
    default:
      return horizontalStepperThemeClasses.circle.default;
  }
}

function labelToneClass(state: StepState) {
  switch (state) {
    case "completed":
      return horizontalStepperThemeClasses.label.completed;
    case "active":
      return horizontalStepperThemeClasses.label.active;
    default:
      return horizontalStepperThemeClasses.label.default;
  }
}

function StepIndicator({
  state,
  stepIndex,
  step,
  isClickable,
  onStepClick,
}: {
  state: StepState;
  stepIndex: number;
  step: HorizontalStepperStep;
  isClickable: boolean;
  onStepClick?: (index: number, step: HorizontalStepperStep) => void;
}) {
  const stepIcon = step.icon ?? step.iconStart;

  const content =
    state === "completed" ? (
      <Check className="size-3.5 sm:size-4" strokeWidth={2.5} aria-hidden />
    ) : stepIcon != null ? (
      <span
        className="inline-flex size-3.5 items-center justify-center sm:size-4 [&_svg]:size-full"
        aria-hidden
      >
        {stepIcon}
      </span>
    ) : (
      <span className="text-xs font-semibold leading-none sm:text-sm">
        {stepIndex + 1}
      </span>
    );

  const circleClassName = cn(STEP_CIRCLE_CLASS, circleToneClass(state));

  if (isClickable && onStepClick) {
    return (
      <button
        type="button"
        onClick={() => onStepClick(stepIndex, step)}
        className={cn(
          circleClassName,
          "cursor-pointer transition-opacity hover:opacity-90",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
        )}
        aria-label={`Go to ${step.label} step`}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={cn(circleClassName, "cursor-default")} aria-hidden>
      {content}
    </span>
  );
}

export function HorizontalStepper({
  steps,
  activeStep,
  maxReachedStep,
  onStepClick,
  className,
  "aria-label": ariaLabel = "Progress",
}: HorizontalStepperProps) {
  if (steps.length === 0) {
    return null;
  }

  const clampedActiveStep = Math.min(
    Math.max(activeStep, 0),
    Math.max(steps.length - 1, 0),
  );
  const clampedMaxReachedStep = Math.min(
    Math.max(maxReachedStep ?? clampedActiveStep, clampedActiveStep),
    Math.max(steps.length - 1, 0),
  );

  return (
    <nav className={cn("w-full min-w-0", className)} aria-label={ariaLabel}>
      <ol className="m-0 flex w-full list-none flex-row p-0">
        {steps.map((step, index) => {
          const state = resolveStepState(
            index,
            clampedActiveStep,
            clampedMaxReachedStep,
          );
          const isCompleted = state === "completed";
          const isClickable = isCompleted && onStepClick != null;
          const leftSegmentCompleted =
            index > 0 && index <= clampedMaxReachedStep;
          const rightSegmentCompleted = index + 1 <= clampedMaxReachedStep;

          return (
            <li
              key={step.value}
              className="flex min-w-0 flex-1 flex-col items-center"
              aria-current={state === "active" ? "step" : undefined}
              aria-label={state === "active" ? step.label : undefined}
            >
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-0.5 min-w-2 flex-1",
                    index === 0 ? "invisible" : connectorToneClass(leftSegmentCompleted),
                  )}
                  aria-hidden
                />
                <StepIndicator
                  state={state}
                  stepIndex={index}
                  step={step}
                  isClickable={isClickable}
                  onStepClick={onStepClick}
                />
                <div
                  className={cn(
                    "h-0.5 min-w-2 flex-1",
                    index === steps.length - 1
                      ? "invisible"
                      : connectorToneClass(rightSegmentCompleted),
                  )}
                  aria-hidden
                />
              </div>
              <span className={cn(STEP_LABEL_CLASS, labelToneClass(state))}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
