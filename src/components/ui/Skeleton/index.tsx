import { cva } from "class-variance-authority";
import { cn } from "../../../lib/cn";
import { SkeletonProps } from "./types";

export const skeletonVariants = cva("animate-pulse bg-secondary/15", {
    variants: {
      variant: {
        default: "rounded-md",
        circular: "rounded-full",
        text: "rounded",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

export function Skeleton({ variant = "default", className, ...props }: SkeletonProps) {
    return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}
