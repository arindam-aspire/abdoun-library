"use client";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  textPageTitleClasses,
  textPageTitleMetaClasses,
} from "../../lib/typography";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { HorizontalStepper } from "../ui/HorizontalStepper";
import { VerticalStepper } from "../ui/VerticalStepper";
import type { PropertyFormStep } from "./types";

export interface FormLayoutProps {
  steps: PropertyFormStep[];
  activeStep: number;
  /** Furthest step reached; keeps later steps marked completed when going back. */
  maxReachedStep?: number;
  title?: string;
  onStepClick?: (index: number, step: PropertyFormStep) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  onDraft?: () => void;
  children?: ReactNode;
  className?: string;
}

function toVerticalSteps(steps: PropertyFormStep[]) {
  return steps.map((step) => ({
    ...step,
    label: step.verticalLabel ?? step.label,
  }));
}

export function FormLayout({
  steps,
  activeStep,
  maxReachedStep,
  title = "Add New Property",
  onStepClick,
  onPrevious,
  onNext,
  onSubmit,
  onDraft,
  children,
  className,
}: FormLayoutProps) {
  const clampedActiveStep = Math.min(
    Math.max(activeStep, 0),
    Math.max(steps.length - 1, 0),
  );
  const verticalSteps = toVerticalSteps(steps);
  const isFirstStep = clampedActiveStep === 0;
  const isLastStep = clampedActiveStep === steps.length - 1;

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col bg-page md:min-h-[40rem] md:flex-row",
        className,
      )}
    >
      <aside className="hidden w-full shrink-0 border-b border-secondary/10 bg-card-background px-4 py-5 sm:px-6 md:block md:w-72 md:border-b-0 md:border-r md:py-8 lg:w-80">
        <div className="md:sticky md:top-6">
          <h1 className={cn("font-bold text-secondary", textPageTitleClasses)}>
            {title}
          </h1>
          <p className={cn("mt-1 text-muted", textPageTitleMetaClasses)}>
            Step {clampedActiveStep + 1} of {steps.length}
          </p>
          <div className="mt-5 hidden md:block">
            <VerticalStepper
              steps={verticalSteps}
              activeStep={clampedActiveStep}
              maxReachedStep={maxReachedStep}
              onStepClick={onStepClick}
              size="sm"
              aria-label="Property form steps"
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 border-b border-secondary/10 bg-card-background px-4 py-4 sm:px-6 md:py-5">
          <HorizontalStepper
            steps={steps}
            activeStep={clampedActiveStep}
            maxReachedStep={maxReachedStep}
            onStepClick={onStepClick}
            aria-label="Property form progress"
            className="w-full"
          />
        </div>

        <div className="flex flex-1 flex-col px-4 py-5 sm:px-6 md:py-6">
          <Card className="min-w-0 flex-1 px-6 py-4">
            {children}
          </Card>

          <footer className="mt-5 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              color="inherit"
              variant="ghost"
              size="sm"
              iconStart={<ArrowLeft aria-hidden />}
              onClick={onPrevious}
              disabled={isFirstStep || !onPrevious}
              className="w-full sm:w-auto !bg-surface shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]"
            >
              Previous
            </Button>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                type="button"
                color="secondary"
                variant="ghost"
                size="sm"
                iconStart={<Save aria-hidden />}
                onClick={onDraft}
                disabled={!onDraft}
                className="w-full sm:w-auto !bg-surface shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]"
              >
                Save as Draft
              </Button>
              {isLastStep ? (
                <Button
                  type="button"
                  color="primary"
                  variant="solid"
                  size="sm"
                  onClick={onSubmit}
                  disabled={!onSubmit}
                  className="w-full sm:w-auto"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  type="button"
                  color="primary"
                  variant="solid"
                  size="sm"
                  iconEnd={<ArrowRight aria-hidden />}
                  onClick={onNext}
                  disabled={!onNext}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
