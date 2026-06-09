"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import { textOverlayButtonClasses } from "../../lib/typography";
import { IconButton } from "../ui/IconButton";
import {
  propertyViewIconButtonGlyphClasses,
  propertyViewIconButtonSizeClasses,
} from "../ui/responsiveSizes";
import { HeroCarouselControls } from "./HeroCarouselControls";
import type { HeroSectionLightBoxProps } from "./types";

export function HeroSectionLightBox({
  isOpen,
  onClose,
  images,
  activeIndex,
  onActiveIndexChange,
  title,
  ariaLabel = "Property image gallery",
  buttonSize = "md",
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
        suppressHydrationWarning
        type="button"
        onClick={onClose}
        className={cn(
          "absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 text-page transition-opacity hover:opacity-80 sm:top-6 sm:left-6",
          textOverlayButtonClasses,
        )}
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
              size="md"
              icon={<ChevronLeft />}
              onClick={goPrev}
              className={cn(
                "absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-page/90 sm:left-6",
                propertyViewIconButtonSizeClasses(buttonSize),
                propertyViewIconButtonGlyphClasses(buttonSize),
              )}
              aria-label="Previous image"
            />
            <IconButton
              type="button"
              color="inherit"
              variant="outline"
              isRounded
              size="md"
              icon={<ChevronRight />}
              onClick={goNext}
              className={cn(
                "absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-page/90 sm:right-6",
                propertyViewIconButtonSizeClasses(buttonSize),
                propertyViewIconButtonGlyphClasses(buttonSize),
              )}
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
          buttonSize={buttonSize}
        />
      </div>
    </div>,
    document.body,
  );
}
