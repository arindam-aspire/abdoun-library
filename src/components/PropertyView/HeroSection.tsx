"use client";

import { ChevronLeft, ChevronRight, Heart, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import propertyFallbackImage from "@/assets/property-fallback-image.svg";
import { cn } from "../../lib/cn";
import { Card } from "../ui";
import { Badge } from "../ui/Badge";
import { IconButton } from "../ui/IconButton";
import { HeroCarouselControls } from "./HeroCarouselControls";
import { HeroSectionLightBox } from "./HeroSectionLightBox";
import {
  buildHeroGallery,
  getHeroImageSources,
  getVideoEmbedUrl,
  type HeroGalleryItem,
} from "./heroGallery";
import type { HeroSectionProps } from "./types";

const TRANSITION_MS = 260;
const AUTOPLAY_MS = 5000;
const heroCarouselButtonClasses =
  "pointer-events-auto bg-page/90 shadow-sm backdrop-blur-sm data-hover:bg-page";

const fallbackImageClasses =
  "lg:scale-175 md:scale-150 scale-125 bg-black/10 object-contain p-5 dark:bg-white/40";

function listingBadgeLabel(listingType: "sale" | "rent", custom?: string) {
  if (custom) {
    return custom;
  }
  return listingType === "rent" ? "For Rent" : "For Sale";
}

function getThumbLabel(item: HeroGalleryItem, index: number): string {
  if (item.type === "video") {
    return "Show property video";
  }

  return `Show image ${index + 1}`;
}

export function HeroSection({
  images,
  videos = [],
  virtualTourUrl = null,
  title,
  location,
  listingType,
  isExclusive = false,
  exclusiveLabel,
  brokerName,
  listingBadgeLabel: listingBadgeLabelProp,
  isFavourite = false,
  isFavouriteLoading = false,
  onFavourite,
  className,
}: HeroSectionProps) {
  const gallery = useMemo(
    () => buildHeroGallery(images, videos, virtualTourUrl),
    [images, videos, virtualTourUrl],
  );
  const lightboxImages = useMemo(() => getHeroImageSources(gallery), [gallery]);
  const isFallbackGallery = images.length === 0;

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

  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const hasCarousel = gallery.length > 1;
  const showLgThumbnailScroll = gallery.length > 3;
  const lgSideThumbnailClass =
    "lg:h-[calc((min(420px,70vh)-3rem)/3)] lg:min-h-[88px] lg:w-full lg:shrink-0 lg:flex-none";

  const activeItem = gallery[activeIndex];
  const isActiveVideo = activeItem?.type === "video";
  const activeVideoEmbedUrl =
    isActiveVideo && activeItem.type === "video"
      ? getVideoEmbedUrl(activeItem.url)
      : null;

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
    if (activeIndex >= gallery.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, gallery.length]);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    strip?.scrollTo({ left: 0, top: 0, behavior: "auto" });
  }, [gallery.length]);

  useEffect(() => {
    if (isPaused || isLightboxOpen || !hasCarousel || isActiveVideo) {
      return;
    }

    const intervalId = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(intervalId);
  }, [goNext, hasCarousel, isActiveVideo, isLightboxOpen, isPaused]);

  const openLightbox = useCallback(() => {
    if (isFallbackGallery || isActiveVideo) {
      return;
    }
    setIsLightboxOpen(true);
  }, [isActiveVideo, isFallbackGallery]);

  const renderMainMedia = () => {
    if (!activeItem) {
      return null;
    }

    if (activeItem.type === "video") {
      if (activeVideoEmbedUrl) {
        return (
          <iframe
            title={`Property video for ${title}`}
            src={activeVideoEmbedUrl}
            className="absolute inset-0 z-10 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        );
      }

      return (
        <a
          href={activeItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label={`Watch property video for ${title}`}
        >
          <img
            src={activeItem.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-black/50 text-page backdrop-blur-sm sm:size-20">
            <Play className="size-8 fill-current sm:size-10" aria-hidden />
          </span>
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={openLightbox}
        className={cn(
          "absolute inset-0 z-10 border-0 bg-transparent p-0",
          isFallbackGallery ? "cursor-default" : "cursor-zoom-in",
        )}
        aria-label={
          isFallbackGallery
            ? title
            : `View full-size images for ${title}`
        }
      >
        <img
          src={activeItem.src}
          alt={title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-all duration-[260ms]",
            isTransitioning && "opacity-90 blur-[1px]",
            isFallbackGallery &&
              activeItem.src === propertyFallbackImage &&
              fallbackImageClasses,
          )}
        />
      </button>
    );
  };

  return (
    <>
      <section className={cn("w-full", className)}>
        <Card className="overflow-hidden p-0 lg:overflow-visible lg:bg-transparent lg:shadow-none">
          <div className="flex flex-col gap-2 md:gap-4 lg:flex-row lg:items-stretch lg:gap-6 lg:overflow-visible">
            <div className="relative min-h-[280px] flex-1 overflow-hidden sm:min-h-[360px] md:min-h-[400px] lg:min-h-[420px] lg:rounded-2xl">
              {renderMainMedia()}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

              <div className="absolute top-3 left-3 z-30 sm:top-4 sm:left-4">
                <Badge
                  variant="warning"
                  appearance="solid"
                  className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wide"
                >
                  {badgeLabel}
                </Badge>
              </div>

              {onFavourite ? (
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
                    onFavourite();
                  }}
                  className="absolute top-3 right-4 z-30 bg-page/90 shadow-sm backdrop-blur-sm sm:top-4"
                  aria-label={
                    isFavourite
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                  aria-pressed={isFavourite}
                />
              ) : null}

              {hasCarousel ? (
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
                      "absolute top-1/2 left-2 -translate-y-1/2 sm:left-3",
                      heroCarouselButtonClasses,
                    )}
                    aria-label="Previous slide"
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
                      "absolute top-1/2 right-2 -translate-y-1/2 sm:right-3",
                      heroCarouselButtonClasses,
                    )}
                    aria-label="Next slide"
                  />
                </div>
              ) : null}

              <div className="pointer-events-none absolute right-3 bottom-3 left-3 z-20 flex flex-col gap-2 pb-1 sm:right-4 sm:bottom-4 sm:left-4 sm:flex-row sm:items-end sm:justify-between md:gap-4 lg:gap-6">
                <div className="min-w-0 max-w-2xl flex-1 text-page">
                  {isExclusive ? (
                    <p className="text-[11px] font-bold tracking-[0.14em] text-accent uppercase">
                      {exclusiveText}
                    </p>
                  ) : null}
                  <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-1 text-sm text-page/90 sm:text-base">
                    {location}
                  </p>
                </div>

                {hasCarousel ? (
                  <HeroCarouselControls
                    total={gallery.length}
                    activeIndex={activeIndex}
                    onSelect={goToSlide}
                    onPrev={goPrev}
                    onNext={goNext}
                    isPaused={isPaused || isActiveVideo}
                    onPauseToggle={() => setIsPaused((prev) => !prev)}
                    className="pointer-events-auto w-full max-w-full shrink-0 self-stretch sm:w-auto sm:self-end"
                  />
                ) : null}
              </div>
            </div>

            <div
              ref={thumbnailStripRef}
              className={cn(
                "flex max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1 md:gap-4 lg:gap-6",
                "[-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary/30",
                "md:max-h-none md:overflow-visible",
                "lg:w-[min(22%,220px)] lg:shrink-0 lg:snap-none lg:flex-col lg:pb-0",
                showLgThumbnailScroll
                  ? "lg:min-h-[min(420px,70vh)] lg:max-h-[min(420px,70vh)] lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-y-contain lg:px-0.5 lg:py-1 lg:[&::-webkit-scrollbar]:h-auto lg:[&::-webkit-scrollbar]:w-1.5"
                  : "lg:min-h-[min(420px,70vh)] lg:max-h-none lg:overflow-visible",
              )}
              aria-label="Property gallery thumbnails"
            >
              {gallery.map((item, index) => {
                const isActive = index === activeIndex;
                const thumbSrc =
                  item.type === "video" ? item.poster : item.src;
                const isFallbackThumb =
                  isFallbackGallery &&
                  item.type === "image" &&
                  item.src === propertyFallbackImage;

                return (
                  <button
                    key={`${item.type}-${thumbSrc}-${index}`}
                    type="button"
                    data-thumb-index={index}
                    onClick={() => hasCarousel && goToSlide(index)}
                    disabled={!hasCarousel}
                    className={cn(
                      "group relative shrink-0 grow-0 snap-start rounded-2xl p-0.5",
                      "aspect-square size-[4.5rem]",
                      "lg:aspect-auto lg:size-auto",
                      lgSideThumbnailClass,
                      isActive
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-page"
                        : "opacity-90 hover:opacity-100",
                      !hasCarousel && "cursor-default",
                    )}
                    aria-label={getThumbLabel(item, index)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="relative block size-full overflow-hidden rounded-[0.875rem]">
                      <img
                        src={thumbSrc}
                        alt=""
                        className={cn(
                          "absolute inset-0 h-full w-full object-cover transition-transform duration-300",
                          hasCarousel &&
                            item.type === "image" &&
                            "lg:group-hover:scale-125",
                          isFallbackThumb && fallbackImageClasses,
                        )}
                      />
                      {item.type === "video" ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <Play
                            className="size-5 fill-page text-page sm:size-6"
                            aria-hidden
                          />
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </section>

      {!isFallbackGallery && lightboxImages.length > 0 ? (
        <HeroSectionLightBox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={lightboxImages}
          activeIndex={
            activeItem?.type === "image"
              ? lightboxImages.indexOf(activeItem.src)
              : 0
          }
          onActiveIndexChange={(index) => {
            const imageSrc = lightboxImages[index];
            const galleryIndex = gallery.findIndex(
              (item) => item.type === "image" && item.src === imageSrc,
            );
            if (galleryIndex >= 0) {
              setActiveIndex(galleryIndex);
            }
          }}
          title={title}
        />
      ) : null}
    </>
  );
}
