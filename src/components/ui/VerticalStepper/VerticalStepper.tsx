"use client";

import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { verticalStepperThemeClasses } from "../stepperThemeClasses";
import type { UiControlSize } from "../commonTypes";
import type { VerticalStepperProps, VerticalStepperStep } from "./types";
import { verticalStepperSizeClasses } from "./verticalStepperSizes";

type StepState = "completed" | "active" | "default";

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

function circleToneClass(
  state: StepState,
  usesCounter: boolean,
  usesIcon: boolean,
) {
  if (state === "completed") {
    return verticalStepperThemeClasses.circle.completed;
  }

  if (state === "active" && (usesCounter || usesIcon)) {
    return verticalStepperThemeClasses.circle.active;
  }

  return verticalStepperThemeClasses.circle.default;
}

function labelToneClass(state: StepState) {
  switch (state) {
    case "completed":
      return verticalStepperThemeClasses.label.completed;
    case "active":
      return verticalStepperThemeClasses.label.active;
    default:
      return verticalStepperThemeClasses.label.default;
  }
}

function StepIndicator({
  state,
  stepIndex,
  step,
  size,
}: {
  state: StepState;
  stepIndex: number;
  step: VerticalStepperStep;
  size: UiControlSize;
}) {
  const sizeClasses = verticalStepperSizeClasses[size];
  const stepIcon = step.icon ?? step.iconStart;
  const usesIcon = state !== "completed" && stepIcon != null;
  const usesCounter = state !== "completed" && !usesIcon;

  const content =
    state === "completed" ? (
      <Check
        className={cn(sizeClasses.check, "max-h-full max-w-full")}
        strokeWidth={2.5}
        aria-hidden
      />
    ) : stepIcon != null ? (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          sizeClasses.indicator,
          "[&_svg]:size-full",
        )}
        aria-hidden
      >
        {stepIcon}
      </span>
    ) : (
      <span className={cn(sizeClasses.counter, "tabular-nums")}>
        {stepIndex + 1}
      </span>
    );

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        sizeClasses.circle,
        circleToneClass(state, usesCounter, usesIcon),
      )}
      aria-hidden
    >
      {content}
    </span>
  );
}

function VerticalStepRow({
  state,
  stepIndex,
  step,
  size,
  isClickable,
  onStepClick,
}: {
  state: StepState;
  stepIndex: number;
  step: VerticalStepperStep;
  size: UiControlSize;
  isClickable: boolean;
  onStepClick?: (index: number, step: VerticalStepperStep) => void;
}) {
  const sizeClasses = verticalStepperSizeClasses[size];

  const rowContent = (
    <>
      <StepIndicator
        state={state}
        stepIndex={stepIndex}
        step={step}
        size={size}
      />
      <span className={cn(sizeClasses.label, labelToneClass(state))}>
        {step.label}
      </span>
    </>
  );

  if (isClickable && onStepClick) {
    return (
      <button
        type="button"
        onClick={() => onStepClick(stepIndex, step)}
        className={cn(
          sizeClasses.row,
          "cursor-pointer text-left transition-opacity hover:opacity-90",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
        )}
        aria-label={`Go to ${step.label} step`}
      >
        {rowContent}
      </button>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses.row,
        "cursor-default",
        state === "active" && verticalStepperThemeClasses.activeRow,
      )}
    >
      {rowContent}
    </div>
  );
}

export function VerticalStepper({
  steps,
  activeStep,
  maxReachedStep,
  onStepClick,
  size = "md",
  className,
  "aria-label": ariaLabel = "Progress",
}: VerticalStepperProps) {
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
  const sizeClasses = verticalStepperSizeClasses[size];

  return (
    <nav className={cn("w-full min-w-0", className)} aria-label={ariaLabel}>
      <ol className={cn("m-0 flex list-none flex-col p-0", sizeClasses.listGap)}>
        {steps.map((step, index) => {
          const state = resolveStepState(
            index,
            clampedActiveStep,
            clampedMaxReachedStep,
          );
          const isClickable = state === "completed" && onStepClick != null;

          return (
            <li
              key={step.value}
              className="w-full"
              aria-current={state === "active" ? "step" : undefined}
            >
              <VerticalStepRow
                state={state}
                stepIndex={index}
                step={step}
                size={size}
                isClickable={isClickable}
                onStepClick={onStepClick}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
