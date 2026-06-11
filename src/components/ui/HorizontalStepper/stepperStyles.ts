export type StepperVisualState = "completed" | "active" | "default";

/** Connectors follow completed/default step circle fills. */
export const stepperConnectorCompletedClass =
  "bg-[var(--stepper-completed-bg,var(--primary-dark))]";
export const stepperConnectorDefaultClass =
  "bg-[var(--stepper-default-bg,var(--primary-light))]";

export function stepperCircleClass(
  state: StepperVisualState,
  options?: { invertActive?: boolean },
): string {
  switch (state) {
    case "completed":
      return "bg-[var(--stepper-completed-bg,var(--primary-dark))] text-[var(--stepper-completed-text,var(--white))]";
    case "active":
      return options?.invertActive
        ? "bg-[var(--stepper-active-text,var(--primary-dark))] text-[var(--stepper-active-bg,var(--white))]"
        : "bg-[var(--stepper-active-bg,var(--primary))] text-[var(--stepper-active-text,var(--white))]";
    default:
      return "bg-[var(--stepper-default-bg,var(--primary-light))] text-[var(--stepper-default-text,var(--inherit))]";
  }
}

export function stepperLabelClass(state: StepperVisualState): string {
  switch (state) {
    case "completed":
      return "text-[var(--stepper-completed-label-text,var(--primary-dark))]";
    case "active":
      return "font-bold text-[var(--stepper-active-label-text,var(--primary-dark))]";
    default:
      return "text-[var(--stepper-default-label-text,var(--inherit))]";
  }
}

export const stepperVerticalActiveRowClass =
  "bg-[var(--stepper-active-row-bg,var(--primary-light))]";
