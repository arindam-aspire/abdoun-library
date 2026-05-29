import { CardProps } from "./types";
import { cn } from "../../../lib/cn";

export function Card({ className, children, role, onClick }: CardProps) {
  return (
    <div
      data-slot="card"
      role={role}
      className={cn(
        "bg-card-background rounded-lg shadow-sm",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
