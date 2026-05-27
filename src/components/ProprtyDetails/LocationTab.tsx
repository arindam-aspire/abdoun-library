"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import type { LocationTabProps } from "./types";
import {
  formatPropertyLocation,
  getPropertyMapEmbedUrl,
  getPropertyMapsOpenUrl,
} from "./utils";

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="text-[11px] font-semibold tracking-[0.12em] text-text uppercase">
      {children}
    </h4>
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
        <div className="mt-4 border-b border-secondary/10" aria-hidden />

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-w-0">
            {mapEmbedUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-secondary/10">
                {mapsOpenUrl ? (
                  <a
                    href={mapsOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-lg border border-secondary/15 bg-surface px-3 py-1.5 text-sm font-medium text-secondary shadow-sm transition-colors hover:bg-page"
                  >
                    <ExternalLink className="size-4 shrink-0" aria-hidden />
                    Open in Maps
                  </a>
                ) : null}

                <iframe
                  title={`Map for ${locationLine}`}
                  src={mapEmbedUrl}
                  className="aspect-[4/3] w-full border-0 sm:aspect-[16/11]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-secondary/20 bg-page-ghost px-6 text-center sm:aspect-[16/11]">
                <p className="text-sm text-muted">
                  Map preview is not available for this listing.
                </p>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-6">
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
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {lifestyleDescription}
                </p>
              </div>
            ) : null}

            {highlights.length === 0 && !lifestyleDescription ? (
              <p className="text-sm text-muted">
                Neighborhood details are not available for this listing yet.
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
}
