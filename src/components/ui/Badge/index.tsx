import { cva } from "class-variance-authority";
import { cn } from "../../../lib/cn";
import type { BadgeProps } from "./types";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-semibold",
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
        outline: "",
        success: "",
        warning: "",
        destructive: "",
        exclusive: "",
      },
      appearance: {
        soft: "border backdrop-blur-sm",
        solid: "border-transparent",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        appearance: "soft",
        class: "border-primary/25 bg-primary/10 text-primary",
      },
      {
        variant: "default",
        appearance: "solid",
        class: "bg-primary text-page",
      },
      {
        variant: "secondary",
        appearance: "soft",
        class: "border-secondary/25 bg-secondary/10 text-secondary",
      },
      {
        variant: "secondary",
        appearance: "solid",
        class: "bg-secondary text-page",
      },
      {
        variant: "outline",
        appearance: "soft",
        class:
          "border-secondary/40 bg-page/90 text-text shadow-sm ring-1 ring-secondary/10 backdrop-blur-sm",
      },
      {
        variant: "outline",
        appearance: "solid",
        class: "bg-page text-text shadow-sm ring-1 ring-secondary/15",
      },
      {
        variant: "success",
        appearance: "soft",
        class: "border-success/30 bg-success/15 text-success",
      },
      {
        variant: "success",
        appearance: "solid",
        class: "bg-success text-page",
      },
      {
        variant: "warning",
        appearance: "soft",
        class: "border-tertiary/30 bg-tertiary/15 text-tertiary-dark",
      },
      {
        variant: "warning",
        appearance: "solid",
        class: "bg-tertiary text-text",
      },
      {
        variant: "destructive",
        appearance: "soft",
        class: "border-danger/30 bg-danger/15 text-danger",
      },
      {
        variant: "destructive",
        appearance: "solid",
        class: "bg-danger text-page",
      },
      {
        variant: "exclusive",
        appearance: "soft",
        class: "border-accent/40 bg-accent/15 text-text",
      },
      {
        variant: "exclusive",
        appearance: "solid",
        class: "bg-accent text-text",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "solid",
    },
  },
);

export function Badge({
  className,
  variant,
  appearance,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, appearance }), className)}
      {...props}
    />
  );
}

export type {
  BadgeAppearance,
  BadgeOwnProps,
  BadgeProps,
  BadgeVariant,
} from "./types";
export { BADGE_APPEARANCES, BADGE_VARIANTS } from "./types";
