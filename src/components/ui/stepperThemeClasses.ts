/**
 * Horizontal and vertical steppers use separate CSS variable namespaces so
 * consuming apps can theme each stepper independently without conflicts.
 *
 * Optional overrides in :root (see Storybook theme files):
 * - --horizontal-stepper-*
 * - --vertical-stepper-*
 */
export const horizontalStepperThemeClasses = {
  circle: {
    completed:
      "bg-[var(--horizontal-stepper-completed-bg,var(--secondary))] text-[var(--horizontal-stepper-completed-text,var(--page))]",
    active:
      "bg-[var(--horizontal-stepper-active-bg,var(--accent))] text-[var(--horizontal-stepper-active-text,var(--text))]",
    default:
      "bg-[var(--horizontal-stepper-default-bg,var(--primary-light))] text-[var(--horizontal-stepper-default-text,var(--muted))]",
  },
  label: {
    completed:
      "text-[var(--horizontal-stepper-completed-label-text,var(--text))]",
    active:
      "font-bold text-[var(--horizontal-stepper-active-label-text,var(--secondary))]",
    default:
      "text-[var(--horizontal-stepper-default-label-text,var(--muted))]",
  },
  connector: {
    completed: "bg-[var(--horizontal-stepper-completed-bg,var(--secondary))]",
    default: "bg-[var(--horizontal-stepper-default-bg,var(--primary-light))]",
  },
} as const;

export const verticalStepperThemeClasses = {
  circle: {
    completed:
      "bg-[var(--vertical-stepper-completed-bg,var(--secondary))] text-[var(--vertical-stepper-completed-text,var(--page))]",
    active:
      "bg-[var(--vertical-stepper-active-circle-bg,var(--text))] text-[var(--vertical-stepper-active-circle-text,var(--accent))]",
    default:
      "bg-[var(--vertical-stepper-default-bg,var(--primary-light))] text-[var(--vertical-stepper-default-text,var(--muted))]",
  },
  label: {
    completed:
      "text-[var(--vertical-stepper-completed-label-text,var(--text))]",
    active:
      "font-bold text-[var(--vertical-stepper-active-label-text,var(--text))]",
    default: "text-[var(--vertical-stepper-default-label-text,var(--muted))]",
  },
  activeRow:
    "bg-[var(--vertical-stepper-active-row-bg,var(--accent))]",
} as const;
