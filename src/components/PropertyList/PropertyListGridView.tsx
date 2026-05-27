"use client";

import { PropertyGridCard, PropertyListCard } from "../PropertyCard";
import type { PropertyListGridViewProps } from "./types";

export function PropertyListGridView({
  layoutVariant,
  data,
  isAuthenticated,
  showOwners,
  showAgents,
  showBadges,
  onEmail,
  onCall,
  onWhatsApp,
  onFavourite,
  onDetailsClick,
}: PropertyListGridViewProps) {
  const cardProps = {
    isAuthenticated,
    showOwners,
    showAgents,
    showBadges,
    onEmail,
    onCall,
    onWhatsApp,
    onFavourite,
    onDetailsClick,
  };

  if (layoutVariant === "list") {
    return (
      <div className="flex flex-col gap-4">
        {data.map((propertyDetails) => (
          <PropertyListCard
            key={propertyDetails.propertyId}
            propertyDetails={propertyDetails}
            {...cardProps}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((propertyDetails) => (
        <PropertyGridCard
          key={propertyDetails.propertyId}
          propertyDetails={propertyDetails}
          {...cardProps}
        />
      ))}
    </div>
  );
}
