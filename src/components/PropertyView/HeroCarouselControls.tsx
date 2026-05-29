"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "../../lib/cn";
import type { HeroCarouselControlsProps } from "./types";

const controlButtonClasses =
  "inline-flex size-8 items-center justify-center rounded-full bg-secondary-light/25 text-page transition-colors hover:bg-secondary-light/40";

/** Beyond this count, dots are hidden; use the numeric counter and prev/next instead. */
const MAX_PROGRESS_DOTS = 5;

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
  if (total <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-full min-w-0 items-center justify-between gap-2 rounded-full bg-secondary px-3 py-2 text-page shadow-lg sm:min-w-[17.5rem] sm:gap-4 sm:px-4 sm:py-2.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {total > 1 && total <= MAX_PROGRESS_DOTS ? (
          <div
            className="flex shrink-0 items-center gap-1.5"
            role="tablist"
            aria-label="Image progress"
          >
            {Array.from({ length: total }).map((_, index) => (
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
                  "h-1.5 w-7 rounded-full transition-colors",
                  index === activeIndex
                    ? "bg-accent"
                    : "bg-page/30 hover:bg-page/45",
                )}
              />
            ))}
          </div>
        ) : null}

        <span className="text-sm font-bold italic tabular-nums">
          {activeIndex + 1} / {total}
        </span>
      </div>

      {total > 1 ? (
        <div className="flex items-center gap-1.5">
          {onPauseToggle ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPauseToggle();
              }}
              className={controlButtonClasses}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="size-3.5 fill-current" aria-hidden />
              ) : (
                <Pause className="size-3.5" aria-hidden />
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className={controlButtonClasses}
            aria-label="Previous image"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className={controlButtonClasses}
            aria-label="Next image"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
