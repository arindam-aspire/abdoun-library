"use client";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";
import { IconButton } from "../ui/IconButton";
import {
  HeroCarouselControls,
  HeroSectionLightBox,
} from "./HeroSectionLightBox";
import type { HeroSectionProps } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop";
const SIDE_THUMBNAIL_COUNT = 3;
const TRANSITION_MS = 260;
const AUTOPLAY_MS = 5000;
const heroCarouselButtonClasses =
  "pointer-events-auto bg-page/90 shadow-sm backdrop-blur-sm data-hover:bg-page";

function listingBadgeLabel(listingType: "sale" | "rent", custom?: string) {
  if (custom) {
    return custom;
  }
  return listingType === "rent" ? "For Rent" : "For Sale";
}

function getSideThumbnailIndices(
  total: number,
  activeIndex: number,
  maxVisible = SIDE_THUMBNAIL_COUNT,
): number[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index);
  }

  if (activeIndex <= 0) {
    return [0, 1, 2];
  }

  if (activeIndex >= total - 1) {
    return [total - 3, total - 2, total - 1];
  }

  return [activeIndex - 1, activeIndex, activeIndex + 1];
}

export function HeroSection({
  images,
  title,
  location,
  listingType,
  isExclusive = false,
  exclusiveLabel,
  brokerName,
  listingBadgeLabel: listingBadgeLabelProp,
  isAuthenticated = false,
  isFavourite = false,
  isFavouriteLoading = false,
  onFavourite,
  className,
}: HeroSectionProps) {
  const gallery = useMemo(
    () => (images.length > 0 ? images : [FALLBACK_IMAGE]),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const badgeLabel = listingBadgeLabel(listingType, listingBadgeLabelProp);
  const exclusiveText =
    exclusiveLabel ??
    (brokerName
      ? `${brokerName.toUpperCase()} EXCLUSIVE`
      : "EXCLUSIVE LISTING");

  const sideThumbnailIndices = getSideThumbnailIndices(
    gallery.length,
    activeIndex,
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        return;
      }
      setIsTransitioning(true);
      setActiveIndex(index);
      window.setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
    },
    [activeIndex],
  );

  const goPrev = useCallback(() => {
    goToSlide((activeIndex - 1 + gallery.length) % gallery.length);
  }, [activeIndex, gallery.length, goToSlide]);

  const goNext = useCallback(() => {
    goToSlide((activeIndex + 1) % gallery.length);
  }, [activeIndex, gallery.length, goToSlide]);

  useEffect(() => {
    if (isPaused || isLightboxOpen || gallery.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(intervalId);
  }, [gallery.length, goNext, isLightboxOpen, isPaused]);

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  return (
    <>
      <section className={cn("w-full", className)}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl sm:min-h-[360px] lg:min-h-[420px]">
            <button
              type="button"
              onClick={openLightbox}
              className="absolute inset-0 z-10 cursor-zoom-in border-0 bg-transparent p-0"
              aria-label={`View full-size images for ${title}`}
            >
              <img
                src={gallery[activeIndex]}
                alt={title}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-[260ms]",
                  isTransitioning && "opacity-90 blur-[1px]",
                )}
              />
            </button>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

            <div className="absolute top-4 left-4 z-30">
              <Badge
                variant="warning"
                appearance="solid"
                className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide"
              >
                {badgeLabel}
              </Badge>
            </div>

            {isAuthenticated ? (
              <IconButton
                type="button"
                color="inherit"
                variant="outline"
                isRounded
                size="md"
                isLoading={isFavouriteLoading}
                loadingLabel="Updating favourites"
                icon={
                  <Heart
                    className={cn(
                      "size-4",
                      isFavourite
                        ? "fill-red-500 text-red-500"
                        : "text-secondary",
                    )}
                    aria-hidden
                  />
                }
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onFavourite?.();
                }}
                className="absolute top-4 right-4 z-30 bg-page/90 shadow-sm backdrop-blur-sm"
                aria-label={
                  isFavourite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
                aria-pressed={isFavourite}
              />
            ) : null}

            {gallery.length > 1 ? (
              <div className="pointer-events-none absolute inset-0 z-30">
                <IconButton
                  type="button"
                  color="inherit"
                  variant="outline"
                  isRounded
                  size="md"
                  icon={<ChevronLeft className="size-4" />}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    goPrev();
                  }}
                  className={cn(
                    "absolute top-1/2 left-3 -translate-y-1/2",
                    heroCarouselButtonClasses,
                  )}
                  aria-label="Previous image"
                />
                <IconButton
                  type="button"
                  color="inherit"
                  variant="outline"
                  isRounded
                  size="md"
                  icon={<ChevronRight className="size-4" />}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    goNext();
                  }}
                  className={cn(
                    "absolute top-1/2 right-3 -translate-y-1/2",
                    heroCarouselButtonClasses,
                  )}
                  aria-label="Next image"
                />
              </div>
            ) : null}

            <div className="absolute right-4 bottom-4 left-4 z-20 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pointer-events-none">
              <div className="max-w-2xl text-page">
                {isExclusive ? (
                  <p className="text-[11px] font-bold tracking-[0.14em] text-accent uppercase">
                    {exclusiveText}
                  </p>
                ) : null}
                <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-page/90 sm:text-base">{location}</p>
              </div>

              {gallery.length > 0 ? (
                <HeroCarouselControls
                  total={gallery.length}
                  activeIndex={activeIndex}
                  onSelect={goToSlide}
                  onPrev={goPrev}
                  onNext={goNext}
                  isPaused={isPaused}
                  onPauseToggle={() => setIsPaused((prev) => !prev)}
                  className="pointer-events-auto shrink-0 self-end"
                />
              ) : null}
            </div>
          </div>

          {sideThumbnailIndices.length > 0 ? (
            <div className="flex flex-row gap-3 lg:w-[min(22%,220px)] lg:shrink-0 lg:flex-col">
              {sideThumbnailIndices.map((index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "relative min-h-[88px] flex-1 overflow-hidden rounded-2xl lg:min-h-0 lg:flex-none lg:basis-0 lg:flex-1",
                      isActive
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-page"
                        : "opacity-90 hover:opacity-100",
                    )}
                    aria-label={`Show image ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <img
                      src={gallery[index]}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <HeroSectionLightBox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={gallery}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        title={title}
      />
    </>
  );
}
