"use client";

import type { PointerEvent } from "react";
import { cn } from "../../../lib/cn";

type TableColumnResizeHandleProps = {
  onResizeStart: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function TableColumnResizeHandle({
  onResizeStart,
}: TableColumnResizeHandleProps) {
  return (
    <button
      type="button"
      aria-label="Resize column"
      onPointerDown={onResizeStart}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "absolute end-0 top-0 z-40 h-full w-3 translate-x-1/2 touch-none",
        "cursor-col-resize border-0 bg-transparent p-0",
        "after:absolute after:inset-y-2 after:start-1/2 after:w-px after:-translate-x-1/2",
        "after:bg-secondary/0 hover:after:bg-secondary/40 active:after:bg-secondary/60",
        "focus:outline-none focus-visible:after:bg-secondary/60",
      )}
    />
  );
}
