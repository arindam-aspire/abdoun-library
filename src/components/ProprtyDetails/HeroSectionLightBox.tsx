"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import { IconButton } from "../ui/IconButton";
import type { HeroSectionLightBoxProps } from "./types";

type HeroCarouselControlsProps = {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isPaused?: boolean;
  onPauseToggle?: () => void;
  className?: string;
};

const controlButtonClasses =
  "inline-flex size-8 items-center justify-center rounded-full bg-secondary-light/25 text-page transition-colors hover:bg-secondary-light/40";

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
        "flex min-w-[17.5rem] items-center justify-between gap-4 rounded-full bg-secondary px-4 py-2.5 text-page shadow-lg",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {total > 1 ? (
          <div
            className="flex items-center gap-1.5"
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

export function HeroSectionLightBox({
  isOpen,
  onClose,
  images,
  activeIndex,
  onActiveIndexChange,
  title,
  ariaLabel = "Property image gallery",
}: HeroSectionLightBoxProps) {
  const total = images.length;
  const hasMultiple = total > 1;

  const goPrev = useCallback(() => {
    onActiveIndexChange((activeIndex - 1 + total) % total);
  }, [activeIndex, onActiveIndexChange, total]);

  const goNext = useCallback(() => {
    onActiveIndexChange((activeIndex + 1) % total);
  }, [activeIndex, onActiveIndexChange, total]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (!hasMultiple) {
        return;
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, hasMultiple, isOpen, onClose]);

  if (!isOpen || typeof document === "undefined" || total === 0) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 text-sm font-medium text-page transition-opacity hover:opacity-80 sm:top-6 sm:left-6"
      >
        <ChevronLeft className="size-5 shrink-0" aria-hidden />
        Back
      </button>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-6 pt-14 sm:p-10 sm:pt-16">
        <img
          src={images[activeIndex]}
          alt={title}
          className="max-h-[78vh] max-w-[min(92vw,72rem)] rounded-2xl object-contain"
        />

        {hasMultiple ? (
          <>
            <IconButton
              type="button"
              color="inherit"
              variant="outline"
              isRounded
              icon={<ChevronLeft className="size-5" />}
              onClick={goPrev}
              className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-page/90 sm:left-6"
              aria-label="Previous image"
            />
            <IconButton
              type="button"
              color="inherit"
              variant="outline"
              isRounded
              icon={<ChevronRight className="size-5" />}
              onClick={goNext}
              className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-page/90 sm:right-6"
              aria-label="Next image"
            />
          </>
        ) : null}
      </div>

      <div className="flex justify-center px-4 pb-8">
        <HeroCarouselControls
          total={total}
          activeIndex={activeIndex}
          onSelect={onActiveIndexChange}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>
    </div>,
    document.body,
  );
}
