"use client";

import { Bath, Bed, MapPin, Maximize2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback } from "react";
import { cn } from "../../lib/cn";
import { PropertyCardImageGallery } from "../PropertyCardImageGallery";
import { Card } from "../ui/Card";
import { PropertyCardContactActions } from "./PropertyCardContactActions";
import { PropertyCardOwners } from "./PropertyCardOwners";
import type { PropertyCardDetails, PropertyCardProps } from "./types";
import { usePropertyCardContact } from "./usePropertyCardContact";

type SpecItem = {
  key: string;
  icon: LucideIcon;
  label: string;
};

function buildAreaLabel(details: PropertyCardDetails): string | undefined {
  if (details.area != null && details.area > 0) {
    return `${details.area.toLocaleString()} sqft`;
  }
  return details.areaName || undefined;
}

function buildSpecItems(details: PropertyCardDetails): SpecItem[] {
  const items: SpecItem[] = [];
  const { bedrooms, bathrooms } = details;
  const areaLabel = buildAreaLabel(details);

  if (bedrooms != null) {
    items.push({
      key: "beds",
      icon: Bed,
      label: bedrooms === 1 ? "1 Bed" : `${bedrooms} Beds`,
    });
  }
  if (bathrooms != null) {
    items.push({
      key: "baths",
      icon: Bath,
      label: bathrooms === 1 ? "1 Bathroom" : `${bathrooms} Bathrooms`,
    });
  }
  if (areaLabel) {
    items.push({ key: "area", icon: Maximize2, label: areaLabel });
  }

  return items;
}

export function PropertyListCard({
  propertyDetails,
  isAuthenticated = false,
  showOwners = false,
  showAgents = true,
  showBadges = false,
  onEmail,
  onCall,
  onWhatsApp,
  onFavourite,
  onDetailsClick,
}: PropertyCardProps) {
  const {
    propertyId,
    title,
    price,
    location,
    highlights,
    owners,
  } = propertyDetails;

  const specItems = buildSpecItems(propertyDetails);
  const showSummaryFallback =
    specItems.length === 0 && highlights != null && highlights !== "";

  const handleDetailsClick = useCallback(() => {
    onDetailsClick?.(propertyId);
  }, [onDetailsClick, propertyId]);

  const handleContact = usePropertyCardContact({
    propertyId,
    isAuthenticated,
    onEmail,
    onCall,
    onWhatsApp,
  });

  return (
    <Card
      role="article"
      className="flex flex-col overflow-hidden duration-300 hover:shadow-md sm:flex-row sm:items-stretch"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[min(320px,34%)] sm:min-h-[220px]">
        <PropertyCardImageGallery
          propertyDetails={propertyDetails}
          showBadges={showBadges}
          showAgents={showAgents}
          isAuthenticated={isAuthenticated}
          onFavourite={onFavourite}
          onDetailsClick={onDetailsClick}
          imageSizes="(max-width: 640px) 100vw, 320px"
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <button
          type="button"
          onClick={handleDetailsClick}
          className="rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <h3 className="text-lg font-bold leading-snug text-secondary md:text-xl">
            {title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text/60">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </p>
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          {specItems.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {specItems.map(({ key, icon: Icon, label }) => (
                <li
                  key={key}
                  className="flex items-center gap-2 text-sm text-text/60"
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          ) : showSummaryFallback ? (
            <p className="text-sm text-text/60">{highlights}</p>
          ) : null}

          <p
            className={cn(
              "text-lg font-bold text-secondary md:text-xl",
              (specItems.length > 0 || showSummaryFallback) && "ms-auto",
            )}
          >
            {price}
          </p>
        </div>

        {showOwners && owners && owners.length > 0 ? (
          <PropertyCardOwners owners={owners} />
        ) : null}

        <PropertyCardContactActions
          layout="list"
          onEmail={() => handleContact("email")}
          onCall={() => handleContact("call")}
          onWhatsApp={() => handleContact("whatsapp")}
        />
      </div>
    </Card>
  );
}
