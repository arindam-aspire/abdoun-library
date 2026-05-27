"use client";

import { ChevronLeft, ChevronRight, Heart, Loader2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";
import type { BadgeVariant } from "../ui/Badge/types";
import { IconButton } from "../ui/IconButton";
import { ImageLightBox } from "../ui/ImageLightBox";
import type {
  PropertyCardBadge,
  PropertyCardImageGalleryProps,
  PropertyListItem,
} from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
const TRANSITION_MS = 260;

export function getVisibleDotIndices(total: number, active: number): number[] {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i);
  }
  if (active <= 0) return [0, 1, 2];
  if (active >= total - 1) return [total - 3, total - 2, total - 1];
  return [active - 1, active, active + 1];
}

function badgeVariantForLabel(label: string): BadgeVariant {
  const normalized = label.toLowerCase();
  if (normalized.includes("exclusive") || normalized.includes("حصري")) {
    return "exclusive";
  }
  if (normalized.includes("new") || normalized.includes("verified")) {
    return "success";
  }
  if (
    normalized.includes("featured") ||
    normalized.includes("premium") ||
    normalized.includes("rent")
  ) {
    return "warning";
  }
  if (normalized.includes("sale")) {
    return "secondary";
  }
  return "default";
}

function mapStringBadges(labels: string[] | undefined): PropertyCardBadge[] {
  if (!labels?.length) return [];
  return labels.map((label) => ({
    label,
    variant: badgeVariantForLabel(label),
  }));
}

function resolveBadges(details: PropertyListItem): PropertyCardBadge[] {
  const mapped = mapStringBadges(details.badges);
  if (
    details.isExclusive &&
    !mapped.some((badge) => badge.variant === "exclusive")
  ) {
    return [{ label: "Exclusive", variant: "exclusive" }, ...mapped];
  }
  return mapped;
}

const carouselButtonClasses =
  "bg-page/90 shadow-sm backdrop-blur-sm data-hover:bg-page";

const carouselDotClasses =
  "size-1.5 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

export function PropertyCardImageGallery({
  propertyDetails,
  isAuthenticated = false,
  showAgents = true,
  showBadges = true,
  onFavourite,
  onDetailsClick,
  isFavouriteLoading = false,
  showImageNavigation,
  imageOverlayContent,
  imageSizes = "(max-width: 768px) 100vw, 50vw",
  className,
  imageLinkClassName,
  enableImageLightbox = true,
}: PropertyCardImageGalleryProps) {
  const { propertyId, title, images, brokerName, isFavourite = false } =
    propertyDetails;

  const badges = useMemo(
    () => resolveBadges(propertyDetails),
    [propertyDetails],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const gallery = useMemo(
    () => (images.length > 0 ? images : [FALLBACK_IMAGE]),
    [images],
  );

  const carouselEnabled = showImageNavigation ?? gallery.length > 1;
  const visibleDots = getVisibleDotIndices(gallery.length, activeIndex);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
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

  const handleFavourite = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isFavouriteLoading) return;
      onFavourite?.(propertyId);
    },
    [isFavouriteLoading, onFavourite, propertyId],
  );

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const handleDetailsClick = useCallback(() => {
    onDetailsClick?.(propertyId);
  }, [onDetailsClick, propertyId]);

  const useLightboxForImage = enableImageLightbox;

  const imageClasses = cn(
    "absolute inset-0 h-full w-full object-cover transition-all duration-[260ms]",
    isTransitioning && "opacity-85 blur-[1px]",
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {useLightboxForImage ? (
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className={cn(
            "absolute inset-0 z-10 cursor-zoom-in border-0 bg-transparent p-0",
            imageLinkClassName,
          )}
          aria-label={`View full-size image for ${title}`}
        >
          <img
            src={gallery[activeIndex] ?? FALLBACK_IMAGE}
            alt={title}
            sizes={imageSizes}
            loading={activeIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            className={imageClasses}
          />
        </button>
      ) : (
        <>
          <img
            src={gallery[activeIndex] ?? FALLBACK_IMAGE}
            alt={title}
            sizes={imageSizes}
            loading={activeIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            className={imageClasses}
          />
          {onDetailsClick ? (
            <button
              type="button"
              onClick={handleDetailsClick}
              className={cn(
                "absolute inset-0 z-10 cursor-pointer border-0 bg-transparent p-0",
                imageLinkClassName,
              )}
              aria-label={`View details for ${title}`}
            />
          ) : null}
        </>
      )}

      {imageOverlayContent}

      {showBadges && badges.length > 0 ? (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant}
                appearance={badge.appearance ?? "solid"}
                className={badge.className}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {isAuthenticated ? (
        <button
          type="button"
          onClick={handleFavourite}
          disabled={isFavouriteLoading}
          aria-label={
            isFavouriteLoading
              ? "Updating favourites"
              : isFavourite
                ? "Remove from favourites"
                : "Add to favourites"
          }
          aria-pressed={isFavourite}
          className="absolute top-3 right-3 z-30 inline-flex size-11 items-center justify-center rounded-full bg-page/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFavouriteLoading ? (
            <Loader2 className="size-4 animate-spin text-secondary" aria-hidden />
          ) : (
            <Heart
              className={cn(
                "size-4",
                isFavourite ? "fill-red-500 text-red-500" : "text-secondary",
              )}
              aria-hidden
            />
          )}
        </button>
      ) : null}

      <div
        className={cn(
          "absolute bottom-3 left-3 right-3 z-20 flex items-end gap-2",
          showAgents ? "justify-between" : "justify-end",
        )}
      >
        {showAgents && brokerName ? (
          <span className="max-w-[65%] truncate rounded-full bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {brokerName}
          </span>
        ) : null}

        {carouselEnabled && gallery.length > 1 ? (
          <div
            className="flex flex-row items-center gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm"
            role="tablist"
            aria-label="Image pagination"
          >
            {visibleDots.map((dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                role="tab"
                aria-label={`Go to image ${dotIndex + 1}`}
                aria-current={dotIndex === activeIndex ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (useLightboxForImage) {
                    openLightbox(dotIndex);
                  } else {
                    goToSlide(dotIndex);
                  }
                }}
                className={cn(
                  carouselDotClasses,
                  dotIndex === activeIndex
                    ? "scale-125 bg-white"
                    : "bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {carouselEnabled && gallery.length > 1 ? (
        <>
          <IconButton
            type="button"
            color="inherit"
            variant="outline"
            isRounded
            icon={<ChevronLeft className="size-4" />}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goPrev();
            }}
            className={cn(
              "absolute top-1/2 left-3 z-30 -translate-y-1/2",
              carouselButtonClasses,
            )}
            aria-label="Previous image"
          />
          <IconButton
            type="button"
            color="inherit"
            variant="outline"
            isRounded
            icon={<ChevronRight className="size-4" />}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goNext();
            }}
            className={cn(
              "absolute top-1/2 right-3 z-30 -translate-y-1/2",
              carouselButtonClasses,
            )}
            aria-label="Next image"
          />
        </>
      ) : null}

      {useLightboxForImage ? (
        <ImageLightBox
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          images={gallery}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          alt={title}
          ariaLabel="Property image viewer"
        />
      ) : null}
    </div>
  );
}

export type {
  PropertyCardBadge,
  PropertyCardImageGalleryProps,
  PropertyListItem,
} from "./types";
