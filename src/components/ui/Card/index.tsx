import { CardProps } from "./types";
import { cn } from "../../../lib/cn";

export function Card({ className, children, role }: CardProps) {
  return (
    <div
      data-slot="card"
      role={role}
      className={cn("bg-card-background rounded-lg shadow-sm", className)}
    >
      {children}
    </div>
  );
}
