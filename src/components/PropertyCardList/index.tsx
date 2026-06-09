import { cn } from "../../lib/cn";
import { ListToolbar } from "./ListToolbar";
import { CardGridView } from "./CardGridView";
import { CardListView } from "./CardListView";
import { NoDataFound } from "./NoDataFound";
import { PropertyPaginition } from "./PropertyPaginition";
import { PropertyCardListSkeleton } from "./PropertyCardListSkeleton";
import type { PropertyCardListProps } from "./types";

export function PropertyCardList({
  isLoading = false,
  layoutVariant = "grid",
  listTitle = "Properties",
  data,
  toolbar,
  noDataFound,
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
  pagination,
  className,
}: PropertyCardListProps) {
  const loadingCount = pagination?.pageSize ?? (layoutVariant === "list" ? 4 : 6);

  const showToolbar = toolbar != null;

  if (isLoading) {
    return (
      <PropertyCardListSkeleton
        layoutVariant={layoutVariant}
        loadingCount={loadingCount}
        canViewOwners={canViewOwners}
        canViewAgents={canViewAgents}
        showToolbar={showToolbar}
        showPagination={Boolean(pagination)}
        className={className}
      />
    );
  }

  const showNoData = data.length === 0;
  const totalCount = pagination?.total ?? (showNoData ? 0 : data.length);

  return (
    <section
      className={cn("space-y-2 md:space-y-4 lg:space-y-6", className)}
    >
      {showToolbar ? (
        <ListToolbar
          layoutVariant={layoutVariant}
          title={listTitle}
          totalCount={totalCount}
          buttonSize={buttonSize}
          {...toolbar}
        />
      ) : null}
      {showNoData ? (
        <NoDataFound {...noDataFound} />
      ) : layoutVariant === "list" ? (
        <CardListView
          data={data}
          canViewOwners={canViewOwners}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          onClick={onClick}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
          onClickFavourite={onClickFavourite}
          canViewDelete={canViewDelete}
          onClickDelete={onClickDelete}
          buttonSize={buttonSize}
        />
      ) : (
        <CardGridView
          data={data}
          canViewOwners={canViewOwners}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          onClick={onClick}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
          onClickFavourite={onClickFavourite}
          canViewDelete={canViewDelete}
          onClickDelete={onClickDelete}
          buttonSize={buttonSize}
        />
      )}
      {pagination && !showNoData ? (
        <PropertyPaginition {...pagination} buttonSize={buttonSize} />
      ) : null}
    </section>
  );
}
