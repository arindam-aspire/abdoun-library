"use client";

import { useState } from "react";
import { cn } from "../../lib/cn";
import { HeroSection } from "./HeroSection";
import { PropertyDetailsTabs } from "./PropertyDetailsTabs";
import { PropertyViewLoading } from "./PropertyViewLoading";
import type { PropertyViewProps } from "./types";
import {
  formatPropertyLocation,
  getLocalizedText,
  resolvePropertyDisplayImageUrls,
  resolvePropertyFullImageUrls,
} from "./utils";

function resolveListingType(
  listingType: string,
): "sale" | "rent" {
  return listingType === "sale" ? "sale" : "rent";
}

export function PropertyView({
  isLoading = false,
  applicationKey = "abdoun_web",
  propertyDetails,
  isFavouriteLoading = false,
  onClickFavourite,
  tabs,
  features = [],
  showAgent = true,
  showOwner = true,
  onClickAgentEmail,
  onClickAgentPhone,
  onClickAgentWhatsApp,
  onClickOwnerEmail,
  onClickOwnerPhone,
  onClickOwnerWhatsApp,
  locale = "en",
  statusActionCard,
  buttonSize = "md",
  className,
}: PropertyViewProps) {
  const tabOptions = tabs?.tabOptions ?? [];
  const [uncontrolledTab, setUncontrolledTab] = useState(
    () => tabs?.activeTab ?? tabOptions[0]?.value ?? "",
  );
  const isTabControlled = tabs?.activeTab !== undefined;
  const activeTab = isTabControlled ? tabs.activeTab : uncontrolledTab;

  const handleTabChange = (value: string) => {
    if (!isTabControlled) {
      setUncontrolledTab(value);
    }
    tabs?.onTabChange?.(value);
  };

  if (isLoading || !propertyDetails) {
    return (
      <PropertyViewLoading
        className={className}
        activeTab={tabs?.activeTab ?? tabOptions[0]?.value ?? "overview"}
        tabOptions={tabOptions}
        onTabChange={handleTabChange}
        showAgent={showAgent}
        showOwner={showOwner}
      />
    );
  }

  const title = getLocalizedText(propertyDetails.title, locale);
  const location = formatPropertyLocation(propertyDetails, locale);
  const displayImages = resolvePropertyDisplayImageUrls(propertyDetails.media);
  const fullImages = resolvePropertyFullImageUrls(propertyDetails.media);

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-2 md:gap-4 lg:gap-6",
        className,
      )}
    >
      <HeroSection
        images={displayImages}
        lightboxImages={fullImages}
        videos={propertyDetails.media.videos}
        virtualTourUrl={propertyDetails.media.virtual_tour_url}
        title={title}
        location={location}
        listingType={resolveListingType(propertyDetails.listing_type)}
        isExclusive={propertyDetails.is_exclusive}
        brokerName={
          propertyDetails.agency?.agency_name ?? propertyDetails.agent?.name
        }
        isFavouriteLoading={isFavouriteLoading}
        onFavourite={
          onClickFavourite
            ? () => onClickFavourite(propertyDetails.id)
            : undefined
        }
        buttonSize={buttonSize}
      />

      {tabOptions.length > 0 ? (
        <PropertyDetailsTabs
          tabOptions={tabOptions}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          propertyDetails={propertyDetails}
          applicationKey={applicationKey}
          locale={locale}
          features={features}
          showAgent={showAgent}
          showOwner={showOwner}
          onAgentEmail={
            onClickAgentEmail
              ? () => onClickAgentEmail(propertyDetails.id)
              : undefined
          }
          onAgentPhone={
            onClickAgentPhone
              ? () => onClickAgentPhone(propertyDetails.id)
              : undefined
          }
          onAgentWhatsApp={
            onClickAgentWhatsApp
              ? () => onClickAgentWhatsApp(propertyDetails.id)
              : undefined
          }
          onOwnerEmail={
            onClickOwnerEmail
              ? () => onClickOwnerEmail(propertyDetails.id)
              : undefined
          }
          onOwnerPhone={
            onClickOwnerPhone
              ? () => onClickOwnerPhone(propertyDetails.id)
              : undefined
          }
          onOwnerWhatsApp={
            onClickOwnerWhatsApp
              ? () => onClickOwnerWhatsApp(propertyDetails.id)
              : undefined
          }
          statusActionCard={statusActionCard}
          buttonSize={buttonSize}
        />
      ) : null}
    </article>
  );
}

export { PropertyViewLoading as PropertyViewSkeleton } from "./PropertyViewLoading";
export type { PropertyViewLoadingProps as PropertyViewSkeletonProps } from "./PropertyViewLoading";
export type {
  ApplicationKey,
  Locale,
  PropertyDetails,
  PropertyFeatureDefinition,
  PropertyFeatureListItem,
  PropertyFeatureType,
  PropertyMediaItem,
  PropertyViewProps,
  PropertyViewTabOption,
  PropertyViewTabs,
} from "./types";
