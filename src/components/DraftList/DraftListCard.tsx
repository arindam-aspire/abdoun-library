"use client";

import { ArrowRight, History, Trash2 } from "lucide-react";
import { cn } from "../../lib/cn";
import {
  textBodyLgClasses,
  textBodySmClasses,
  textBodyTightClasses,
} from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { ProgressBar } from "../ui/ProgressBar";
import { draftListCardClassName } from "./draftListLayout";
import type { DraftListItemProps } from "./types";
import { resolveDraftProgressPercent, resolveDraftTitle } from "./types";

const TYPE_NOT_SPECIFIED_LABEL = "Type not specified";

function DraftCardTaxonomy({ propertyType }: { propertyType: string }) {
  const hasPropertyType = propertyType.trim().length > 0;

  return (
    <p
      className={cn(
        "max-w-full truncate",
        hasPropertyType
          ? cn("font-bold text-text", textBodyLgClasses)
          : cn("font-normal italic text-muted", textBodySmClasses),
      )}
    >
      {hasPropertyType ? propertyType : TYPE_NOT_SPECIFIED_LABEL}
    </p>
  );
}

export function DraftListCard({
  item,
  onResume,
  onDelete,
  isDeleteLoading = false,
  resumeLabel = "Resume",
  size = "md",
  className,
}: DraftListItemProps) {
  const progressPercent = resolveDraftProgressPercent(item);
  const displayTitle = resolveDraftTitle(item.title);
  const hasPropertyType = item.propertyType.trim().length > 0;
  const canResume = Boolean(onResume);
  const canDelete = Boolean(onDelete);

  return (
    <Card role="article" className={cn(draftListCardClassName, className)}>
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5 md:p-5">
        <div className="min-w-0 flex-1 md:max-w-[16rem] lg:max-w-[18rem]">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "min-w-0 flex-1 truncate font-bold text-text",
                textBodyTightClasses,
              )}
            >
              {displayTitle}
            </h3>
            <Badge
              variant="secondary"
              appearance="soft"
              className="max-w-[45%] shrink-0 truncate md:hidden"
            >
              {item.listingPurposeLabel}
            </Badge>
          </div>
          <p
            className={cn(
              "mt-1 flex items-center gap-1.5 text-muted",
              textBodySmClasses,
            )}
          >
            <History className="size-3.5 shrink-0 sm:size-4" aria-hidden />
            <span className="truncate">{item.updatedAtLabel}</span>
          </p>
          <p
            className={cn(
              "mt-1 truncate md:hidden",
              hasPropertyType
                ? cn("text-muted", textBodySmClasses)
                : cn("italic text-muted", textBodySmClasses),
            )}
          >
            {hasPropertyType ? item.propertyType : TYPE_NOT_SPECIFIED_LABEL}
          </p>
        </div>

        <div className="hidden shrink-0 md:block lg:min-w-[6.5rem]">
          <DraftCardTaxonomy propertyType={item.propertyType} />
          <p className={cn("mt-0.5 truncate font-normal text-muted", textBodySmClasses)}>
            {item.listingPurposeLabel}
          </p>
        </div>

        <div className="min-w-0 md:min-w-[10rem] md:flex-1 md:max-w-xs lg:max-w-sm">
          <div className="md:hidden">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  "shrink-0 font-semibold tabular-nums text-secondary-dark",
                  textBodySmClasses,
                )}
              >
                {progressPercent}% Complete
              </span>
              <span className={cn("truncate text-end text-muted", textBodySmClasses)}>
                {item.currentStep}/{item.totalSteps} steps
              </span>
            </div>
            <ProgressBar
              value={progressPercent}
              currentStep={item.currentStep}
              totalSteps={item.totalSteps}
              showPercentage={false}
              showStepCount={false}
              tone="secondary"
              size="sm"
            />
          </div>
          <div className="hidden md:block">
            <ProgressBar
              value={progressPercent}
              currentStep={item.currentStep}
              totalSteps={item.totalSteps}
              tone="secondary"
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-secondary/15 pt-4 md:shrink-0 md:border-t-0 md:pt-0">
          {canDelete ? (
            <IconButton
              type="button"
              color="inherit"
              variant="ghost"
              size="sm"
              icon={<Trash2 aria-hidden />}
              aria-label={`Delete draft ${displayTitle}`}
              isLoading={isDeleteLoading}
              disabled={isDeleteLoading}
              onClick={() => onDelete?.(item)}
              className="shrink-0 text-muted data-hover:text-danger"
            />
          ) : null}

          {canResume ? (
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="sm"
              iconEnd={<ArrowRight aria-hidden />}
              onClick={() => onResume?.(item)}
              className={cn(
                "min-w-0 md:shrink-0",
                canDelete ? "flex-1 md:flex-none" : "w-full md:w-auto",
              )}
            >
              {resumeLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
