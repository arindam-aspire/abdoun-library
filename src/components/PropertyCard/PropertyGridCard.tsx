"use client";

import { MapPin } from "lucide-react";
import { useCallback } from "react";
import { PropertyCardImageGallery } from "../PropertyCardImageGallery";
import { Card } from "../ui/Card";
import { PropertyCardContactActions } from "./PropertyCardContactActions";
import { PropertyCardOwners } from "./PropertyCardOwners";
import type { PropertyCardDetails, PropertyCardProps } from "./types";
import { usePropertyCardContact } from "./usePropertyCardContact";

function buildSubtitle(details: PropertyCardDetails): string {
  if (details.highlights) return details.highlights;

  const areaPart =
    details.area != null && details.area > 0
      ? `${details.area.toLocaleString()} sqft`
      : details.areaName || undefined;
  const typePart = details.propertyType || undefined;

  return [areaPart, typePart].filter(Boolean).join(" · ") || details.title;
}

export function PropertyGridCard({
  propertyDetails,
  isAuthenticated = false,
  showOwners = false,
  showAgents = true,
  showBadges = true,
  onEmail,
  onCall,
  onWhatsApp,
  onFavourite,
  onDetailsClick,
}: PropertyCardProps) {
  const { propertyId, price, location, owners } = propertyDetails;
  const subtitle = buildSubtitle(propertyDetails);

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
      className="flex h-full flex-col overflow-hidden duration-300 hover:shadow-md"
    >
      <PropertyCardImageGallery
        propertyDetails={propertyDetails}
        showBadges={showBadges}
        showAgents={showAgents}
        isAuthenticated={isAuthenticated}
        onFavourite={onFavourite}
        onDetailsClick={onDetailsClick}
        imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="relative h-0 overflow-hidden rounded-t-xl pb-[67%]"
      />

      <div className="flex flex-1 flex-col p-4">
        <button
          type="button"
          onClick={handleDetailsClick}
          className="flex flex-1 flex-col rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <p className="text-lg font-bold leading-tight text-secondary md:text-xl">
            {price}
          </p>
          <p className="mt-1 text-sm leading-tight text-text/75 md:text-base">
            {subtitle}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text/75 md:text-sm">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{location}</span>
          </p>
        </button>

        {showOwners && owners && owners.length > 0 ? (
          <PropertyCardOwners owners={owners} />
        ) : null}

        <PropertyCardContactActions
          layout="grid"
          onEmail={() => handleContact("email")}
          onCall={() => handleContact("call")}
          onWhatsApp={() => handleContact("whatsapp")}
        />
      </div>
    </Card>
  );
}
