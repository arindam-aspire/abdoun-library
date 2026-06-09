"use client";

import { ChevronLeft, ChevronRight, Heart, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  hasListingMediaImages,
  PROPERTY_FALLBACK_IMAGE,
} from "../../lib/propertyFallbackImage";
import {
  resolveListingFullImageUrls,
  resolveListingMediaImages,
} from "../../lib/resolveListingImageUrls";
import { preloadImage } from "../../lib/resolvePropertyMediaImages";
import type { PropertyListing } from "../PropertyCardList/types";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";
import type { BadgeAppearance, BadgeVariant } from "../ui/Badge/types";
import { IconButton } from "../ui/IconButton";
import { ImageLightBox } from "../ui/ImageLightBox";
import { stopCardClickPropagation } from "./cardClickHandlers";
import type { ImageGallaryProps } from "./types";
import { textBadgeClasses } from "../../lib/typography";
import type { UiControlSize } from "../ui/commonTypes";
import {
  cardListIconButtonGlyphClasses,
  cardListIconButtonSizeClasses,
} from "../ui/responsiveSizes";

const TRANSITION_MS = 260;

const fallbackImageClasses =
  "object-contain bg-black/15 p-6 opacity-70 dark:bg-white/40";

type GalleryBadge = {
  label: string;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  className?: string;
};

function getVisibleDotIndices(total: number, active: number): number[] {
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

function mapStringBadges(labels: string[] | undefined): GalleryBadge[] {
  if (!labels?.length) return [];
  return labels.map((label) => ({
    label,
    variant: badgeVariantForLabel(label),
  }));
}

function resolveTitle(title: PropertyListing["title"]): string {
  return title.en || title.ar || title.esp || title.fr || "";
}

function resolveBadges(propertyDetails: PropertyListing): GalleryBadge[] {
  const mapped = mapStringBadges(propertyDetails.badges);
  if (
    propertyDetails.is_exclusive &&
    !mapped.some((badge) => badge.variant === "exclusive")
  ) {
    return [{ label: "Exclusive", variant: "exclusive" }, ...mapped];
  }
  return mapped;
}

const floatingControlClasses =
  "border-white/25 bg-white/30 text-white shadow-sm backdrop-blur-sm transition-colors data-hover:border-white/35 data-hover:bg-white/40 dark:border-white/10 dark:bg-black/30 dark:text-white dark:data-hover:border-white/15 dark:data-hover:bg-black/40";

function galleryIconButtonClasses(buttonSize: UiControlSize) {
  return cn(
    floatingControlClasses,
    cardListIconButtonSizeClasses(buttonSize),
    cardListIconButtonGlyphClasses(buttonSize),
  );
}

const carouselDotClasses =
  "size-1.5 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

const layoutConfig = {
  grid: {
    imageSizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    className: "relative h-0 overflow-hidden rounded-t-xl pb-[67%]",
  },
  list: {
    imageSizes: "(max-width: 640px) 100vw, 320px",
    className: "absolute inset-0 h-full w-full",
  },
} as const;

export function ImageGallary({
  propertyDetails,
  canViewAgents = true,
  canViewBadges = true,
  layoutVariant,
  applicationKey,
  onClickFavourite,
  canViewDelete = false,
  onClickDelete,
  buttonSize = "md",
  isFavouriteLoading = false,
  isDeleteLoading = false,
}: ImageGallaryProps) {
  const title = useMemo(
    () => resolveTitle(propertyDetails.title),
    [propertyDetails.title],
  );

  const mediaImages = useMemo(
    () => resolveListingMediaImages(propertyDetails.media),
    [propertyDetails.media],
  );

  const hasMedia = hasListingMediaImages(mediaImages);

  const gallery = useMemo(
    () =>
      hasMedia
        ? mediaImages.map((item) => item.displayUrl)
        : [PROPERTY_FALLBACK_IMAGE],
    [hasMedia, mediaImages],
  );

  const lightboxImages = useMemo(
    () =>
      hasMedia ? resolveListingFullImageUrls(propertyDetails.media) : [],
    [hasMedia, propertyDetails.media],
  );
  /** Bundled SVG only when the listing has no `images` or `thumbnail` URLs. */
  const isFallbackGallery = !hasMedia;

  const badges = useMemo(
    () => resolveBadges(propertyDetails),
    [propertyDetails],
  );

  const brokerName =
    propertyDetails.agency?.agency_name || propertyDetails.brokerName;
  const isFavourite = propertyDetails.is_favourite;
  const isAuthenticated = Boolean(onClickFavourite);

  const { imageSizes, className } = layoutConfig[layoutVariant];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const activeSrc = gallery[activeIndex] ?? PROPERTY_FALLBACK_IMAGE;
  const showFallbackStyles = isFallbackGallery;

  useEffect(() => {
    if (isFallbackGallery || gallery.length < 2) {
      return;
    }

    const nextIndex = (activeIndex + 1) % gallery.length;
    preloadImage(gallery[nextIndex]!);
  }, [activeIndex, gallery, isFallbackGallery]);

  const carouselEnabled = gallery.length > 1;
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
      onClickFavourite?.(propertyDetails);
    },
    [isFavouriteLoading, onClickFavourite, propertyDetails],
  );

  const handleDelete = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (isDeleteLoading) return;
      onClickDelete?.(propertyDetails);
    },
    [isDeleteLoading, onClickDelete, propertyDetails],
  );

  const showDelete = Boolean(canViewDelete && onClickDelete);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const imageClasses = cn(
    "absolute inset-0 h-full w-full object-cover transition-all duration-[260ms]",
    isTransitioning && "opacity-85 blur-[1px]",
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onClick={stopCardClickPropagation}
    >
      <button
        suppressHydrationWarning
        type="button"
        onClick={(event) => {
          stopCardClickPropagation(event);
          if (!isFallbackGallery) {
            openLightbox(activeIndex);
          }
        }}
        className={cn(
          // Keep the "click anywhere to zoom" layer below floating UI so it doesn't block them.
          "absolute inset-0 z-[5] border-0 bg-transparent p-0",
          isFallbackGallery ? "cursor-default" : "cursor-zoom-in",
        )}
        aria-label={`View full-size image for ${title}`}
      >
        <img
          src={activeSrc}
          alt={title}
          sizes={imageSizes}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className={cn(imageClasses, showFallbackStyles && fallbackImageClasses)}
        />
      </button>

      {canViewBadges && badges.length > 0 ? (
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

      {showDelete || isAuthenticated ? (
        <div className="absolute top-3 right-3 z-[6] flex items-center gap-1.5 sm:top-4 sm:right-4 sm:gap-2">
          {showDelete ? (
            <IconButton
              type="button"
              color="inherit"
              variant="outline"
              isRounded
              size="sm"
              isLoading={isDeleteLoading}
              icon={<Trash2 className="text-danger" aria-hidden />}
              onClick={handleDelete}
              className={galleryIconButtonClasses(buttonSize)}
              aria-label={
                isDeleteLoading ? "Removing listing" : "Remove listing"
              }
            />
          ) : null}
          {isAuthenticated ? (
            <IconButton
              type="button"
              color="inherit"
              variant="outline"
              isRounded
              size="sm"
              isLoading={isFavouriteLoading}
              icon={
                <Heart
                  className={cn(
                    isFavourite ? "fill-danger text-danger" : "text-inherit",
                  )}
                  aria-hidden
                />
              }
              onClick={handleFavourite}
              className={galleryIconButtonClasses(buttonSize)}
              aria-label={
                isFavouriteLoading
                  ? "Updating favourites"
                  : isFavourite
                    ? "Remove from favourites"
                    : "Add to favourites"
              }
              aria-pressed={isFavourite}
            />
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          "absolute bottom-3 left-3 right-3 z-20 flex items-end gap-2",
          canViewAgents ? "justify-between" : "justify-end",
        )}
      >
        {canViewAgents && brokerName ? (
          <span
            className={cn(
              "max-w-[65%] truncate rounded-full bg-black/20 px-2.5 py-1 font-medium text-white backdrop-blur-sm sm:px-3",
              textBadgeClasses,
            )}
          >
            {brokerName}
          </span>
        ) : null}

        {carouselEnabled ? (
          <div
            className="flex flex-row items-center gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm"
            role="tablist"
            aria-label="Image pagination"
          >
            {visibleDots.map((dotIndex) => (
              <button
                suppressHydrationWarning
                key={dotIndex}
                type="button"
                role="tab"
                aria-label={`Go to image ${dotIndex + 1}`}
                aria-current={dotIndex === activeIndex ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  openLightbox(dotIndex);
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

      {carouselEnabled ? (
        <>
          <IconButton
            type="button"
            color="inherit"
            variant="outline"
            isRounded
            size="sm"
            icon={<ChevronLeft />}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goPrev();
            }}
            className={cn(
              "absolute top-1/2 left-3 z-[6] -translate-y-1/2",
              galleryIconButtonClasses(buttonSize),
            )}
            aria-label="Previous image"
          />
          <IconButton
            type="button"
            color="inherit"
            variant="outline"
            isRounded
            size="sm"
            icon={<ChevronRight />}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              goNext();
            }}
            className={cn(
              "absolute top-1/2 right-3 z-[6] -translate-y-1/2",
              galleryIconButtonClasses(buttonSize),
            )}
            aria-label="Next image"
          />
        </>
      ) : null}

      {!isFallbackGallery && lightboxImages.length > 0 ? (
        <ImageLightBox
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          images={lightboxImages}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          alt={title}
          ariaLabel="Property image viewer"
        />
      ) : null}
    </div>
  );
}
