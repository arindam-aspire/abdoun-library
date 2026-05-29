"use client";

import { ChevronLeft, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { LocationLightBoxProps } from "./types";

export function LocationLightBox({
  isOpen,
  onClose,
  latitude,
  longitude,
  mapEmbedUrl,
  mapsOpenUrl,
  locationLabel,
  ariaLabel = "Location map viewer",
}: LocationLightBoxProps) {
  const hasCoordinates = latitude != null && longitude != null;
  const resolvedMapEmbedUrl = hasCoordinates
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
    : (mapEmbedUrl ?? null);
  const resolvedMapsOpenUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : (mapsOpenUrl ?? null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

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

      {resolvedMapsOpenUrl ? (
        <a
          href={resolvedMapsOpenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-md border border-page/30 bg-page/95 px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-page sm:top-6 sm:right-6"
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
          Open in Maps
        </a>
      ) : null}

      <div className="flex min-h-0 flex-1 items-center justify-center p-6 pt-14 sm:p-10 sm:pt-16">
        {resolvedMapEmbedUrl ? (
          <iframe
            title={locationLabel ? `Map for ${locationLabel}` : "Property location map"}
            src={resolvedMapEmbedUrl}
            className="h-[80vh] w-full max-w-[min(94vw,72rem)] overflow-hidden rounded-xl border border-page/20 bg-page"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-[60vh] w-full max-w-[min(94vw,56rem)] items-center justify-center rounded-xl border border-dashed border-page/35 bg-page/10 px-6 text-center text-page">
            <p className="text-sm sm:text-base">
              Map preview is not available for this listing.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export type { LocationLightBoxProps } from "./types";
