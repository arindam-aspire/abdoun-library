"use client";

import {
  Bath,
  BedDouble,
  Home,
  Maximize2,
  Play,
} from "lucide-react";
import type { ReactNode } from "react";
import propertyFallbackImage from "@/assets/property-fallback-image.svg";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import type { ApplicationKey, OverviewTabProps, PropertyDetails } from "./types";
import {
  formatListingTypeLabel,
  formatSpecValue,
  getLocalizedNullableText,
  getLocalizedText,
  parsePropertyMoreFeatures,
  resolvePropertyImageUrls,
} from "./utils";

type HighlightItem = {
  label: string;
  value: string;
  icon: ReactNode;
};

type InfoCardItem = {
  label: string;
  value: string;
  description: string;
};

function HighlightStat({ label, value, icon }: HighlightItem) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-page px-4 py-4">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-page text-muted">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-lg font-bold text-secondary">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value, description }: InfoCardItem) {
  return (
    <Card className="flex flex-col gap-2 border border-secondary/10 p-5 shadow-none">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
      <p className="text-lg font-bold text-secondary">{value}</p>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </Card>
  );
}

function getHighlightItems(propertyDetails: PropertyDetails): HighlightItem[] {
  const areaUnit = propertyDetails.details.area_unit ?? undefined;
  const bedrooms = formatSpecValue(
    propertyDetails.details.bedrooms ?? propertyDetails.bedrooms,
  );
  const bathrooms = formatSpecValue(
    propertyDetails.details.bathrooms ?? propertyDetails.bathrooms,
  );
  const builtUpArea = formatSpecValue(
    propertyDetails.details.built_up_area ?? propertyDetails.built_up_area,
    areaUnit ?? undefined,
  );
  const propertyType = propertyDetails.property_type || "—";

  return [
    {
      label: "Bedrooms",
      value: bedrooms || "—",
      icon: <BedDouble className="size-4" aria-hidden />,
    },
    {
      label: "Bathrooms",
      value: bathrooms || "—",
      icon: <Bath className="size-4" aria-hidden />,
    },
    {
      label: "Built-in area",
      value: builtUpArea || "—",
      icon: <Maximize2 className="size-4" aria-hidden />,
    },
    {
      label: "Property type",
      value: propertyType,
      icon: <Home className="size-4" aria-hidden />,
    },
  ];
}

function getAbdounInfoCards(propertyDetails: PropertyDetails): InfoCardItem[] {
  const { pricing } = propertyDetails;
  const currency = pricing.currency?.toUpperCase() ?? "JOD";

  const paymentValue = pricing.price_on_request
    ? "On request"
    : pricing.payment_method ?? "On request";

  const priceTermsValue = pricing.is_negotiable ? "Negotiable" : "As listed";

  return [
    {
      label: "Payment",
      value: paymentValue,
      description: "Contact the agent for payment options.",
    },
    {
      label: "Price terms",
      value: priceTermsValue,
      description: `Currency: ${currency}`,
    },
    {
      label: "Listing",
      value: formatListingTypeLabel(propertyDetails.listing_type),
      description: `Status: ${propertyDetails.status}`,
    },
  ];
}

function getMlsInfoCards(propertyDetails: PropertyDetails): InfoCardItem[] {
  const moreFeatures = parsePropertyMoreFeatures(propertyDetails.more_features);
  const { pricing } = propertyDetails;
  const region = propertyDetails.location_detail.region ?? "the area";

  const paymentPlan =
    moreFeatures.payment_plan ??
    (pricing.installment_available && pricing.payment_method
      ? pricing.payment_method
      : null) ??
    "On request";

  const serviceCharge = moreFeatures.service_charge ?? "On request";
  const rentalYield = moreFeatures.expected_rental_yield ?? "—";

  return [
    {
      label: "Payment plan",
      value: paymentPlan,
      description:
        moreFeatures.payment_plan_note ??
        "Flexible handover terms available on request.",
    },
    {
      label: "Service charge",
      value: serviceCharge,
      description:
        moreFeatures.service_charge_note ??
        "Estimated based on current building management rates.",
    },
    {
      label: "Expected rental yield",
      value: rentalYield,
      description:
        moreFeatures.rental_yield_note ??
        `Indicative range based on comparable properties in ${region}.`,
    },
  ];
}

function getOverviewAccentClass(applicationKey?: ApplicationKey): string {
  if (applicationKey === "abdoun_web") {
    return "bg-secondary";
  }

  return "bg-primary";
}

function getVideoUrl(propertyDetails: PropertyDetails): string | null {
  const video = propertyDetails.media.videos[0]?.trim();
  return video || null;
}

function getVirtualTourUrl(propertyDetails: PropertyDetails): string | null {
  const url = propertyDetails.media.virtual_tour_url?.trim();
  return url || null;
}

function MatterportWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-bold tracking-tight text-hero-on-image",
        className,
      )}
    >
      <span
        className="inline-flex size-6 items-center justify-center rounded-md bg-hero-on-image/15"
        aria-hidden
      >
        <span className="size-3 rounded-sm bg-hero-on-image" />
      </span>
      Matterport
    </span>
  );
}

function VirtualTourSection({
  virtualTourUrl,
  previewImage,
  title,
}: {
  virtualTourUrl: string;
  previewImage: string;
  title: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
        Virtual tour
      </h3>
      <Card className="mt-3 border border-secondary/10 p-5 shadow-none sm:p-6">
        <a
          href={virtualTourUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
          aria-label={`Open virtual tour for ${title}`}
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
            <img
              src={previewImage}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/50"
              aria-hidden
            />
            <p className="absolute inset-x-4 top-5 text-center text-base font-semibold text-hero-on-image sm:top-6 sm:text-lg">
              {title}
            </p>
            <span className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-hero-on-image text-text shadow-md transition-transform group-hover:scale-105 sm:size-16">
              <Play className="size-6 fill-current sm:size-7" aria-hidden />
            </span>
            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 sm:bottom-5">
              <span className="text-[10px] font-medium tracking-[0.14em] text-hero-on-image/90 uppercase">
                Powered by
              </span>
              <MatterportWordmark />
            </div>
          </div>
        </a>

        <p className="mt-4 text-sm text-muted">
          If the virtual tour does not load,{" "}
          <a
            href={virtualTourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-secondary transition-colors hover:text-secondary-dark"
          >
            open it in a new tab.
          </a>
        </p>
      </Card>
    </div>
  );
}

function splitDescriptionParagraphs(description: string): string[] {
  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function OverviewTab({
  propertyDetails,
  applicationKey = "abdoun_web",
  locale = "en",
  className,
}: OverviewTabProps) {
  const highlights = getHighlightItems(propertyDetails);
  const infoCards =
    applicationKey === "mls_web"
      ? getMlsInfoCards(propertyDetails)
      : getAbdounInfoCards(propertyDetails);

  const description = getLocalizedNullableText(
    propertyDetails.description,
    locale,
  );
  const paragraphs = description
    ? splitDescriptionParagraphs(description)
    : [];
  const videoUrl = getVideoUrl(propertyDetails);
  const virtualTourUrl = getVirtualTourUrl(propertyDetails);
  const virtualTourPreviewImage =
    resolvePropertyImageUrls(propertyDetails.media)[0] ??
    propertyDetails.media.thumbnail ??
    propertyFallbackImage;
  const propertyTitle = getLocalizedText(propertyDetails.title, locale);
  const emptyDescriptionCopy =
    "No description has been provided for this listing yet.";

  return (
    <section
      className={cn("flex flex-col gap-2 md:gap-4 lg:gap-6", className)}
      aria-label="Overview"
    >
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
            Key highlights
          </h3>
          <p className="text-sm text-muted">
            A quick snapshot of what makes this home special.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
          {highlights.map((item) => (
            <HighlightStat key={item.label} {...item} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4 lg:gap-6">
        {infoCards.map((item) => (
          <InfoCard key={item.label} {...item} />
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
          Overview
        </h3>
        <Card className="mt-3 border border-secondary/10 p-5 shadow-none sm:p-6">
          <div className="flex gap-4">
            <span
              className={cn(
                "w-1 shrink-0 self-stretch rounded-full",
                getOverviewAccentClass(applicationKey),
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-4">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p
                    key={`overview-paragraph-${index}`}
                    className="text-sm leading-relaxed text-text/80"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-relaxed text-muted">
                  {emptyDescriptionCopy}
                </p>
              )}

              {applicationKey === "mls_web" && videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-text transition-colors hover:text-secondary"
                >
                  <Play className="size-4 fill-current" aria-hidden />
                  Watch property video on YouTube
                </a>
              ) : null}
            </div>
          </div>
        </Card>
      </div>

      {virtualTourUrl ? (
        <VirtualTourSection
          virtualTourUrl={virtualTourUrl}
          previewImage={virtualTourPreviewImage}
          title={propertyTitle}
        />
      ) : null}
    </section>
  );
}
