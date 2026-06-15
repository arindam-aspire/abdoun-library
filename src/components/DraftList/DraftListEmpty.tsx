"use client";

import { FilePlus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  textBodySmClasses,
  textEmptyTitleClasses,
} from "../../lib/typography";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { draftListCardClassName } from "./draftListLayout";

export type DraftListEmptyContent = {
  title?: string;
  description?: string;
};

export interface DraftListEmptyProps extends DraftListEmptyContent {
  onCreateNew?: () => void;
  createLabel?: string;
  actions?: ReactNode;
  className?: string;
}

export function DraftListEmpty({
  title = "No drafts found",
  description = "You haven't started any property submissions yet. Start your first draft to see it listed here.",
  onCreateNew,
  createLabel = "Create New Submission",
  actions,
  className,
}: DraftListEmptyProps) {
  const resolvedActions =
    actions ??
    (onCreateNew ? (
      <Button
        type="button"
        color="primary"
        variant="solid"
        size="sm"
        iconStart={<Plus aria-hidden />}
        onClick={onCreateNew}
      >
        {createLabel}
      </Button>
    ) : null);

  return (
    <Card role="status" className={cn(draftListCardClassName, className)}>
      <div
        aria-live="polite"
        className="flex flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-16"
      >
      <div
        className="mb-5 inline-flex size-14 items-center justify-center rounded-full bg-inherit-light text-muted sm:mb-6 sm:size-16"
        aria-hidden
      >
        <FilePlus className="size-6 sm:size-7" />
      </div>

      <h3 className={cn("text-text", textEmptyTitleClasses)}>{title}</h3>

      <p
        className={cn(
          "mt-2 max-w-md text-balance text-muted",
          textBodySmClasses,
        )}
      >
        {description}
      </p>

      {resolvedActions ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:mt-8 sm:flex-row sm:flex-wrap">
          {resolvedActions}
        </div>
      ) : null}
      </div>
    </Card>
  );
}
