"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { textPageTitleClasses } from "../../lib/typography";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { GridCard } from "../PropertyListCard/GridCard";
import { GridCardSkeleton } from "../PropertyListCard/GridCardSkeleton";
import { SimilarPropertiesEmpty } from "./SimilarPropertiesEmpty";
import type { SimilarPropertiesProps } from "./types";

const CARD_SLIDE_CLASS =
  "w-[min(100%,17.25rem)] shrink-0 snap-start sm:w-[18.25rem] md:w-[19rem] lg:w-[19.5rem]";

const SCROLL_TRACK_CLASS = cn(
  "flex gap-2 overflow-x-auto overscroll-x-contain scroll-smooth pb-1",
  "snap-x snap-mandatory",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  "md:gap-4 lg:gap-6",
);

const SCROLL_EDGE_THRESHOLD_PX = 8;

/** Hidden below `md`; swipe on mobile/tablet. Wrapper avoids Button `inline-flex` overriding `hidden`. */
const CAROUSEL_NAV_WRAP_CLASS =
  "absolute top-1/2 z-50 hidden -translate-y-1/2 md:flex md:items-center md:justify-center";

const CAROUSEL_NAV_BUTTON_CLASS = cn(
  "bg-page shadow-md backdrop-blur-sm",
  "border border-secondary/15",
);

function SimilarPropertiesSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`similar-property-skeleton-${index}`} className={CARD_SLIDE_CLASS}>
          <GridCardSkeleton canViewOwners={false} canViewAgents={false} />
        </div>
      ))}
    </>
  );
}

export function SimilarProperties({
  title = "Similar Properties",
  viewMoreLabel = "View More",
  onViewMore,
  data,
  isLoading = false,
  skeletonCount = 4,
  noSimilarProperties,
  canViewBadges = true,
  applicationKey,
  className,
  onClick,
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
  onClickFavourite,
}: SimilarPropertiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollAffordance = useCallback(() => {
    const track = scrollRef.current;
    if (!track) {
      return;
    }

    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const hasOverflow = maxScrollLeft > SCROLL_EDGE_THRESHOLD_PX;

    if (!hasOverflow) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const atStart = track.scrollLeft <= SCROLL_EDGE_THRESHOLD_PX;
    const atEnd = track.scrollLeft >= maxScrollLeft - SCROLL_EDGE_THRESHOLD_PX;

    setCanScrollPrev(!atStart);
    setCanScrollNext(!atEnd);
  }, []);

  useLayoutEffect(() => {
    updateScrollAffordance();
    const frame = requestAnimationFrame(updateScrollAffordance);
    return () => cancelAnimationFrame(frame);
  }, [data.length, isLoading, skeletonCount, updateScrollAffordance]);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track) {
      return;
    }

    track.addEventListener("scroll", updateScrollAffordance, { passive: true });
    track.addEventListener("scrollend", updateScrollAffordance);

    const observer = new ResizeObserver(updateScrollAffordance);
    observer.observe(track);

    for (const slide of track.querySelectorAll("[data-similar-slide]")) {
      observer.observe(slide);
    }

    return () => {
      track.removeEventListener("scroll", updateScrollAffordance);
      track.removeEventListener("scrollend", updateScrollAffordance);
      observer.disconnect();
    };
  }, [data.length, isLoading, skeletonCount, updateScrollAffordance]);

  const scrollByDirection = (direction: -1 | 1) => {
    const track = scrollRef.current;
    if (!track) {
      return;
    }

    const firstSlide = track.querySelector<HTMLElement>("[data-similar-slide]");
    const gap =
      Number.parseFloat(getComputedStyle(track).gap.split(" ")[0] ?? "") || 16;
    const slideWidth = firstSlide?.offsetWidth ?? track.clientWidth * 0.85;
    const delta = (slideWidth + gap) * direction;

    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  const isEmpty = !isLoading && data.length === 0;
  const showViewMore = Boolean(onViewMore) && !isEmpty;
  const showPrev = canScrollPrev && !isLoading;
  const showNext = canScrollNext && !isLoading;

  return (
    <section
      className={cn("w-full min-w-0", className)}
      aria-label={title}
    >
      <div className="flex min-w-0 flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <h2
          className={cn(
            "min-w-0 font-bold text-secondary",
            textPageTitleClasses,
          )}
        >
          {title}
        </h2>
        {showViewMore ? (
          <>
            <button
              type="button"
              onClick={onViewMore}
              className={cn(
                "shrink-0 text-xs font-normal text-secondary underline underline-offset-2",
                "transition-colors hover:text-secondary-dark",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                "md:hidden",
              )}
            >
              {viewMoreLabel}
            </button>
            <div className="hidden shrink-0 md:block">
              <Button
                type="button"
                color="secondary"
                variant="solid"
                size="md"
                onClick={onViewMore}
              >
                {viewMoreLabel}
              </Button>
            </div>
          </>
        ) : null}
      </div>

      <div className="relative isolate mt-4 md:mt-6">
        {isEmpty ? (
          <SimilarPropertiesEmpty {...noSimilarProperties} />
        ) : (
          <>
            <div
              ref={scrollRef}
              className={cn(
                SCROLL_TRACK_CLASS,
                "relative z-0",
                showPrev && "md:scroll-ps-14",
                showNext && "md:scroll-pe-14",
              )}
            >
              {isLoading ? (
                <SimilarPropertiesSkeleton count={skeletonCount} />
              ) : (
                data.map((property) => (
                  <div
                    key={property.id}
                    data-similar-slide
                    className={CARD_SLIDE_CLASS}
                  >
                    <GridCard
                      layoutVariant="grid"
                      propertyDetails={property}
                      canViewOwners={false}
                      canViewAgents={false}
                      canViewBadges={canViewBadges}
                      applicationKey={applicationKey}
                      isFavouriteLoading={property.is_favourite_loading}
                      onClick={onClick}
                      onClickEmail={onClickEmail}
                      onClickCall={onClickCall}
                      onClickWhatsApp={onClickWhatsApp}
                      onClickFavourite={onClickFavourite}
                    />
                  </div>
                ))
              )}
            </div>

            {showPrev ? (
              <div className={cn(CAROUSEL_NAV_WRAP_CLASS, "left-0 md:left-2")}>
                <IconButton
                  type="button"
                  color="inherit"
                  variant="outline"
                  size="md"
                  isRounded
                  icon={<ChevronLeft aria-hidden />}
                  onClick={() => scrollByDirection(-1)}
                  className={CAROUSEL_NAV_BUTTON_CLASS}
                  aria-label="Scroll to previous properties"
                />
              </div>
            ) : null}

            {showNext ? (
              <div className={cn(CAROUSEL_NAV_WRAP_CLASS, "right-0 md:right-2")}>
                <IconButton
                  type="button"
                  color="inherit"
                  variant="outline"
                  size="md"
                  isRounded
                  icon={<ChevronRight aria-hidden />}
                  onClick={() => scrollByDirection(1)}
                  className={CAROUSEL_NAV_BUTTON_CLASS}
                  aria-label="Scroll to next properties"
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export type {
  ApplicationKey,
  PropertyListing,
  SimilarPropertiesProps,
} from "./types";
