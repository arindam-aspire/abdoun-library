import { CardProps } from "./types";
import { cn } from "../../../lib/cn";

export function Card({ className, children, role, onClick }: CardProps) {
  return (
    <div
      data-slot="card"
      role={role}
      className={cn(
        "rounded-lg border-none bg-card-background shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
