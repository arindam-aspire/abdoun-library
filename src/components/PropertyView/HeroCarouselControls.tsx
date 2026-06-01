"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { cn } from "../../lib/cn";
import {
  heroCarouselControlButtonSizeClasses,
  heroCarouselControlIconSizeClasses,
  heroCarouselShellSizeClasses,
} from "../ui/controlSizes";
import { textCarouselCounterClasses } from "../../lib/typography";
import type { HeroCarouselControlsProps } from "./types";

const carouselControlButtonClasses = cn(
  "inline-flex items-center justify-center rounded-full bg-secondary-light/25 text-page transition-colors hover:bg-secondary-light/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-page/50",
  heroCarouselControlButtonSizeClasses,
);

function CarouselControlIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 [&>svg]:size-full",
        heroCarouselControlIconSizeClasses,
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}

/** Show every dot when total is at or below this; otherwise use a sliding window. */
const MAX_PROGRESS_DOTS = 5;

function getVisibleProgressDotIndices(
  total: number,
  activeIndex: number,
  windowSize = MAX_PROGRESS_DOTS,
): number[] {
  if (total <= windowSize) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const half = Math.floor(windowSize / 2);
  let start = activeIndex - half;
  let end = start + windowSize - 1;

  if (start < 0) {
    end -= start;
    start = 0;
  }
  if (end >= total) {
    start -= end - (total - 1);
    end = total - 1;
  }

  start = Math.max(0, start);
  return Array.from({ length: windowSize }, (_, offset) => start + offset);
}

export function HeroCarouselControls({
  total,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  isPaused = false,
  onPauseToggle,
  className,
}: HeroCarouselControlsProps) {
  const showProgressDots = total > 1;
  const visibleDotIndices = useMemo(
    () =>
      showProgressDots
        ? getVisibleProgressDotIndices(total, activeIndex)
        : [],
    [total, activeIndex, showProgressDots],
  );

  if (total <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        heroCarouselShellSizeClasses,
        "w-full max-w-full min-w-0 bg-secondary text-page shadow-lg sm:min-w-[17.5rem]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {showProgressDots ? (
          <div
            className="flex shrink-0 items-center gap-1 sm:gap-1.5"
            role="tablist"
            aria-label="Image progress"
          >
            {visibleDotIndices.map((index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(index);
                }}
                className={cn(
                  "shrink-0 rounded-full transition-colors",
                  index === activeIndex
                    ? "h-1.5 w-7 bg-accent"
                    : "size-1.5 bg-page/30 hover:bg-page/45",
                )}
              />
            ))}
          </div>
        ) : null}

        <span
          className={cn(
            textCarouselCounterClasses,
            "shrink-0 font-bold tabular-nums not-italic",
          )}
        >
          {activeIndex + 1} / {total}
        </span>
      </div>

      {total > 1 ? (
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {onPauseToggle ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPauseToggle();
              }}
              className={carouselControlButtonClasses}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              <CarouselControlIcon>
                {isPaused ? (
                  <Play className="fill-current" />
                ) : (
                  <Pause />
                )}
              </CarouselControlIcon>
            </button>
          ) : null}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className={carouselControlButtonClasses}
            aria-label="Previous image"
          >
            <CarouselControlIcon>
              <ChevronLeft />
            </CarouselControlIcon>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className={carouselControlButtonClasses}
            aria-label="Next image"
          >
            <CarouselControlIcon>
              <ChevronRight />
            </CarouselControlIcon>
          </button>
        </div>
      ) : null}
    </div>
  );
}
