import { cn } from "../../lib/cn";
import { ListToolbar } from "./ListToolbar";
import { CardGridView } from "./CardGridView";
import { CardListView } from "./CardListView";
import { NoDataFound } from "./NoDataFound";
import { PropertyPaginition } from "@/components/PropertyCardList/PropertyPaginition";
import type { PropertyCardListProps } from "./types";

export function PropertyCardList({
  isLoading = false,
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
  pagination,
  className,
}: PropertyCardListProps) {
  const layoutVariant = toolbar.layoutVariant;
  const loadingCount = pagination?.pagination.pageSize ?? data.meta?.pageSize;
  const items = data.items ?? [];
  const showNoData = !isLoading && items.length === 0;

  return (
    <section
      className={cn("space-y-2 md:space-y-4 lg:space-y-6", className)}
    >
      <ListToolbar isLoading={isLoading} {...toolbar} />
      {showNoData ? (
        <NoDataFound {...noDataFound} />
      ) : layoutVariant === "list" ? (
        <CardListView
          isLoading={isLoading}
          data={data}
          loadingCount={loadingCount}
          canViewOwners={canViewOwners}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          onClick={onClick}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
          onClickFavourite={onClickFavourite}
        />
      ) : (
        <CardGridView
          isLoading={isLoading}
          data={data}
          loadingCount={loadingCount}
          canViewOwners={canViewOwners}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          onClick={onClick}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
          onClickFavourite={onClickFavourite}
        />
      )}
      {pagination && !showNoData ? (
        <PropertyPaginition {...pagination} isLoading={isLoading} />
      ) : null}
    </section>
  );
}

export { PropertyCardListSkeleton } from "./PropertyCardListSkeleton";
export type { PropertyCardListSkeletonProps } from "./PropertyCardListSkeleton";
export type {
  ApplicationKey,
  CardLayoutVariant,
  NoDataFoundProps,
  PaginationMeta,
  PropertyCardListProps,
  PropertyCardListSortOptions,
  PropertyCardListToolbarProps,
  PropertyListing,
  PropertyListings,
  PropertyPaginitionProps,
} from "./types";
