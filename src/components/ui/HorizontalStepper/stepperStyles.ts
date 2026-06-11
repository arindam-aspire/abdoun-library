export type StepperVisualState = "completed" | "active" | "default";

export const stepperConnectorCompletedClass = "bg-primary-dark";
export const stepperConnectorDefaultClass = "bg-primary-light";

export function stepperCircleClass(
  state: StepperVisualState,
  options?: { invertActive?: boolean },
): string {
  switch (state) {
    case "completed":
      return "bg-primary-dark text-white";
    case "active":
      return options?.invertActive
        ? "bg-primary-dark text-accent"
        : "bg-accent text-primary-dark";
    default:
      return "bg-primary-light text-inherit-color";
  }
}

export function stepperLabelClass(state: StepperVisualState): string {
  switch (state) {
    case "completed":
      return "text-primary-dark";
    case "active":
      return "font-bold text-primary-dark";
    default:
      return "text-inherit-color";
  }
}

export const stepperVerticalActiveRowClass = "bg-primary-light";
