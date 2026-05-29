"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import type { LocationTabProps } from "./types";
import {
  formatPropertyLocation,
  getPropertyMapEmbedUrl,
  getPropertyMapsOpenUrl,
} from "./utils";

/** Fixed height below lg; on lg+ stretches to match the neighborhood column. */
const mapPreviewHeightClass =
  "h-52 w-full sm:h-56 lg:h-full lg:min-h-60";

const EMPTY_MAP_TITLE = "Map unavailable";
const EMPTY_MAP_DESCRIPTION =
  "A map preview is not available for this listing yet.";

const EMPTY_NEIGHBORHOOD_TITLE = "No neighborhood details";
const EMPTY_NEIGHBORHOOD_DESCRIPTION =
  "Local highlights and lifestyle information haven't been added for this property yet.";

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="text-[11px] font-semibold tracking-[0.12em] text-text uppercase">
      {children}
    </h4>
  );
}

function GhostMapBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-md border border-secondary/15 bg-card-background shadow-sm",
        className,
      )}
    />
  );
}

function GhostHighlightLine({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-2 rounded-full bg-secondary/15", className)}
    />
  );
}

function MapUnavailableEmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-secondary/20 bg-page px-6 py-8 text-center sm:px-8",
        mapPreviewHeightClass,
      )}
    >
      <div className="relative mb-5 flex h-16 w-full max-w-[11rem] items-center justify-center sm:max-w-[13rem]">
        <div
          className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-1.5 p-1"
          aria-hidden
        >
          <GhostMapBlock className="col-span-2 row-span-2 opacity-40" />
          <GhostMapBlock className="opacity-25" />
          <GhostMapBlock className="opacity-30" />
        </div>

        <span className="relative inline-flex size-12 items-center justify-center rounded-xl bg-surface text-secondary shadow-sm ring-1 ring-secondary/10 sm:size-14 sm:rounded-2xl">
          <MapPin className="size-6 sm:size-7" aria-hidden />
        </span>
      </div>

      <h4 className="text-base font-semibold text-text sm:text-lg">
        {EMPTY_MAP_TITLE}
      </h4>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        {EMPTY_MAP_DESCRIPTION}
      </p>
    </div>
  );
}

function NeighborhoodEmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-52 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-8 text-center sm:min-h-56 sm:px-6 sm:py-10 lg:min-h-0 lg:h-full"
    >
      <div className="relative mx-auto mb-5 flex h-20 w-full max-w-[12rem] items-center justify-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-2 px-1"
          aria-hidden
        >
          <div className="flex items-center gap-2 opacity-50">
            <span className="size-1.5 shrink-0 rounded-full bg-primary/30" />
            <GhostHighlightLine className="flex-1" />
          </div>
          <div className="flex items-center gap-2 opacity-35">
            <span className="size-1.5 shrink-0 rounded-full bg-primary/25" />
            <GhostHighlightLine className="w-4/5" />
          </div>
          <div className="flex items-center gap-2 opacity-20">
            <span className="size-1.5 shrink-0 rounded-full bg-primary/20" />
            <GhostHighlightLine className="w-3/5" />
          </div>
        </div>

        <span className="relative inline-flex size-12 items-center justify-center rounded-xl bg-surface text-secondary shadow-sm ring-1 ring-secondary/10 sm:size-14 sm:rounded-2xl">
          <MapPin className="size-6 sm:size-7" aria-hidden />
        </span>
      </div>

      <h4 className="text-base font-semibold text-text sm:text-lg">
        {EMPTY_NEIGHBORHOOD_TITLE}
      </h4>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        {EMPTY_NEIGHBORHOOD_DESCRIPTION}
      </p>
    </div>
  );
}

export function LocationTab({
  propertyDetails,
  locale = "en",
  className,
}: LocationTabProps) {
  const { location_detail: locationDetail } = propertyDetails;
  const locationLine = formatPropertyLocation(propertyDetails, locale);
  const highlights = locationDetail.local_highlights ?? [];
  const lifestyleDescription = locationDetail.lifestyle_description?.trim();
  const mapEmbedUrl = getPropertyMapEmbedUrl(propertyDetails);
  const mapsOpenUrl = getPropertyMapsOpenUrl(propertyDetails);

  return (
    <section className={cn("flex flex-col", className)} aria-label="Location">
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
          Neighborhood
        </h3>
        <div className="mt-5 grid grid-cols-1 items-start gap-2 md:gap-4 lg:grid-cols-[3fr_2fr] lg:items-stretch lg:gap-6">
          <div className="min-w-0 lg:h-full">
            {mapEmbedUrl ? (
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl border border-secondary/10",
                  mapPreviewHeightClass,
                )}
              >
                {mapsOpenUrl ? (
                  <a
                    href={mapsOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-lg border border-secondary/20 bg-surface px-3 py-1.5 text-sm font-medium text-secondary shadow-sm transition-colors hover:bg-page"
                  >
                    <ExternalLink className="size-4 shrink-0" aria-hidden />
                    Open in Maps
                  </a>
                ) : null}

                <iframe
                  title={`Map for ${locationLine}`}
                  src={mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <MapUnavailableEmptyState />
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-2 md:gap-4 lg:h-full lg:gap-6">
            {highlights.length > 0 ? (
              <div>
                <SectionHeading>Local highlights</SectionHeading>
                <ul className="mt-3 space-y-2.5">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 text-sm leading-relaxed text-text/80"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {lifestyleDescription ? (
              <div>
                <SectionHeading>Lifestyle</SectionHeading>
                <p className="mt-3 text-sm leading-relaxed text-text/80">
                  {lifestyleDescription}
                </p>
              </div>
            ) : null}

            {highlights.length === 0 && !lifestyleDescription ? (
              <NeighborhoodEmptyState />
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
}
