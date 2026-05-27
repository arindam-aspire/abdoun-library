import type { AriaRole, ReactNode } from "react";

export type CardProps = {
  className?: string;
  children: ReactNode;
  role?: AriaRole;
};