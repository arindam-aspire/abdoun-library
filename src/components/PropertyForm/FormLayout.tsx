"use client";

import { ArrowLeft, ArrowRight, AlertCircle, Save } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  textBodySmClasses,
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
  /** Pins horizontal stepper + desktop sidebar. Default true. */
  stickyLayout?: boolean;
  /** Sticky `top` offset — defaults to `var(--property-form-sticky-top, 0px)`. */
  stickyTopOffset?: string;
  onStepClick?: (index: number, step: PropertyFormStep) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  onDraft?: () => void;
  isDraftLoading?: boolean;
  isSubmitting?: boolean;
  /** When false, disables Save as Draft and Submit. Defaults to `true`. */
  canEdit?: boolean;
  /** When set, shown as an alert above the form content. */
  rejectionReason?: string | null;
  /** When true, disables steppers, fields, and footer actions. */
  isFormLocked?: boolean;
  isSubmitDisabled?: boolean;
  children?: ReactNode;
  className?: string;
}

function toVerticalSteps(steps: PropertyFormStep[]) {
  return steps.map((step) => ({
    ...step,
    label: step.verticalLabel ?? step.label,
  }));
}

const REJECTION_REASON_ALERT_TITLE = "Rejection reason";

function RejectionReasonAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 sm:px-5 sm:py-4"
    >
      <div className="flex gap-3">
        <AlertCircle
          className="mt-0.5 size-5 shrink-0 text-danger"
          aria-hidden
        />
        <div className="min-w-0">
          <p className={cn("font-semibold text-danger", textBodySmClasses)}>
            {REJECTION_REASON_ALERT_TITLE}
          </p>
          <p className={cn("mt-1 break-words text-text", textBodySmClasses)}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FormLayout({
  steps,
  activeStep,
  maxReachedStep,
  title = "Add New Property",
  stickyLayout = true,
  stickyTopOffset = "var(--property-form-sticky-top, 0px)",
  onStepClick,
  onPrevious,
  onNext,
  onSubmit,
  onDraft,
  isDraftLoading = false,
  isSubmitting = false,
  canEdit = true,
  rejectionReason,
  isFormLocked = false,
  isSubmitDisabled = false,
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
  const stickyStyle = stickyLayout ? { top: stickyTopOffset } : undefined;
  const resolvedRejectionReason = rejectionReason?.trim();

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col bg-page md:min-h-[40rem] md:flex-row",
        isFormLocked && "pointer-events-none select-none",
        className,
      )}
      aria-busy={isFormLocked}
    >
      <aside className="hidden w-full shrink-0 border-b border-secondary/10 bg-card-background px-4 py-5 sm:px-6 md:block md:w-72 md:border-b-0 md:border-r md:py-8 lg:w-80">
        <div
          className={cn(stickyLayout && "md:sticky")}
          style={stickyStyle}
        >
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
              onStepClick={isFormLocked ? undefined : onStepClick}
              size="sm"
              aria-label="Property form steps"
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className={cn(
            "z-10 border-b border-secondary/10 bg-card-background px-4 py-4 sm:px-6 md:py-5",
            stickyLayout && "sticky",
          )}
          style={stickyStyle}
        >
          <HorizontalStepper
            steps={steps}
            activeStep={clampedActiveStep}
            maxReachedStep={maxReachedStep}
            onStepClick={isFormLocked ? undefined : onStepClick}
            aria-label="Property form progress"
            className="w-full"
          />
        </div>

        <div className="flex flex-1 flex-col px-4 py-5 sm:px-6 md:py-6">
          {resolvedRejectionReason ? (
            <RejectionReasonAlert message={resolvedRejectionReason} />
          ) : null}
          <fieldset
            disabled={isFormLocked}
            className="min-w-0 flex-1 border-0 p-0 m-0"
          >
            <Card className="min-w-0 flex-1 px-6 py-4">
              {children}
            </Card>
          </fieldset>

          <footer className="mt-5 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              color="inherit"
              variant="ghost"
              size="sm"
              iconStart={<ArrowLeft aria-hidden />}
              onClick={onPrevious}
              disabled={isFormLocked || isFirstStep || !onPrevious}
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
                disabled={isFormLocked || !canEdit || !onDraft}
                isLoading={isDraftLoading}
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
                  disabled={isFormLocked || !canEdit || isSubmitDisabled || !onSubmit}
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {resolvedRejectionReason ? "Resubmit" : "Submit"}
                </Button>
              ) : (
                <Button
                  type="button"
                  color="primary"
                  variant="solid"
                  size="sm"
                  iconEnd={<ArrowRight aria-hidden />}
                  onClick={onNext}
                  disabled={isFormLocked || !onNext}
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
