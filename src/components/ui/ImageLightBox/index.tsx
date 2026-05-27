"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "../IconButton";
import type { ImageLightBoxProps } from "./types";

export function ImageLightBox({
  isOpen,
  onClose,
  images,
  activeIndex,
  onActiveIndexChange,
  alt,
  ariaLabel = "Image viewer",
}: ImageLightBoxProps) {
  const total = images.length;
  const hasMultiple = total > 1;

  const goPrev = useCallback(() => {
    onActiveIndexChange((activeIndex - 1 + total) % total);
  }, [activeIndex, onActiveIndexChange, total]);

  const goNext = useCallback(() => {
    onActiveIndexChange((activeIndex + 1) % total);
  }, [activeIndex, onActiveIndexChange, total]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (!hasMultiple) return;
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, hasMultiple, isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const imageSrc = images[activeIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 text-sm font-medium text-page transition-opacity hover:opacity-80 sm:top-6 sm:left-6"
      >
        <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
        Back
      </button>

      <button
        type="button"
        className="flex min-h-0 flex-1 cursor-default items-center justify-center p-6 pt-14 sm:p-10 sm:pt-16"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <img
          src={imageSrc}
          alt={alt}
          onClick={(event) => event.stopPropagation()}
          className="max-h-[85vh] max-w-[min(92vw,56rem)] object-contain"
        />
      </button>

      {hasMultiple ? (
        <>
          <IconButton
            type="button"
            color="inherit"
            variant="outline"
            isRounded
            icon={<ChevronLeft className="h-5 w-5" />}
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-page/90 sm:left-6"
            aria-label="Previous image"
          />
          <IconButton
            type="button"
            color="inherit"
            variant="outline"
            isRounded
            icon={<ChevronRight className="h-5 w-5" />}
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-page/90 sm:right-6"
            aria-label="Next image"
          />
          <p className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-sm font-medium text-page tabular-nums">
            {activeIndex + 1} / {total}
          </p>
        </>
      ) : null}
    </div>,
    document.body,
  );
}

export type { ImageLightBoxProps } from "./types";
