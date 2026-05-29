import type { PropertyListing, PropertyListings } from "./types";
import { ListCard } from "../PropertyListCard/ListCard";
import { ListCardSkeleton } from "../PropertyListCard/ListCardSkeleton";

interface CardListViewProps {
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

export function CardListView({
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
}: CardListViewProps) {
  const skeletonCount = Math.max(1, loadingCount ?? 4);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ListCardSkeleton
            key={`list-skeleton-${index}`}
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
    <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
      {items.map((item) => (
        <ListCard
          key={item.id}
          layoutVariant="list"
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
