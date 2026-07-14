import type { CardListProps } from "./types";
import { GridCard } from "../PropertyListCard/GridCard";

export function CardGridView({
  data,
  canViewOwners,
  canViewAgents,
  canViewBadges,
  onClick,
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
  onClickFavourite,
  canViewDelete,
  onClickDelete,
  buttonSize = "md",
  locale = "en",
}: CardListProps) {
  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-6">
      {data.map((item) => (
        <GridCard
          key={item.id}
          layoutVariant="grid"
          propertyDetails={item}
          canViewOwners={canViewOwners}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          isFavouriteLoading={item.is_favourite_loading}
          isDeleteLoading={item.is_delete_loading}
          onClick={onClick}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
          onClickFavourite={onClickFavourite}
          canViewDelete={canViewDelete}
          onClickDelete={onClickDelete}
          buttonSize={buttonSize}
          locale={locale}
        />
      ))}
    </div>
  );
}
