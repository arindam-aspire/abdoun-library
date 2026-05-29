import type { PropertyListing, PropertyListings } from "./types";
import { GridCard } from "../PropertyListCard/GridCard";
import { GridCardSkeleton } from "../PropertyListCard/GridCardSkeleton";

interface CardGridViewProps {
  isLoading?: boolean;
  data: PropertyListings;
  loadingCount?: number;
  canViewOwners?: boolean;
  canViewAgents?: boolean;
  canViewBadges?: boolean;
  onClick?: (propertyDetails: PropertyListing) => void;
  onClickEmail?: (propertyDetails: PropertyListing) => void;
  onClickCall?: (propertyDetails: PropertyListing) => void;
  onClickWhatsApp?: (propertyDetails: PropertyListing) => void;
  onClickFavourite?: (propertyDetails: PropertyListing) => void;
}

export function CardGridView({
  isLoading = false,
  data,
  loadingCount,
  canViewOwners,
  canViewAgents,
  canViewBadges,
  onClick,
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
  onClickFavourite,
}: CardGridViewProps) {
  const skeletonCount = Math.max(1, loadingCount ?? 6);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <GridCardSkeleton
            key={`grid-skeleton-${index}`}
            canViewOwners={canViewOwners}
            canViewAgents={canViewAgents}
          />
        ))}
      </div>
    );
  }

  const items = data.items ?? [];
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
      {items.map((item) => (
        <GridCard
          key={item.id}
          layoutVariant="grid"
          propertyDetails={item}
          canViewOwners={canViewOwners}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          onClick={onClick}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
          onClickFavourite={onClickFavourite}
        />
      ))}
    </div>
  );
}
