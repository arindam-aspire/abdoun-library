import type { ReactNode } from "react";
import type { ButtonProps } from "../Button/types";

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "iconStart" | "iconEnd"> {
  icon: ReactNode;
  "aria-label": string;
}
