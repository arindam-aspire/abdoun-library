import type { CardLayoutVariant } from "../PropertyCardList/types";
import { GridCardSkeleton } from "./GridCardSkeleton";
import type { GridCardSkeletonProps } from "./GridCardSkeleton";
import { ListCardSkeleton } from "./ListCardSkeleton";
import type { ListCardSkeletonProps } from "./ListCardSkeleton";

export type PropertyListCardSkeletonProps = GridCardSkeletonProps &
  ListCardSkeletonProps & {
    layoutVariant: CardLayoutVariant;
  };

export function PropertyListCardSkeleton({
  layoutVariant,
  canViewOwners = true,
  canViewAgents = true,
}: PropertyListCardSkeletonProps) {
  if (layoutVariant === "list") {
    return (
      <ListCardSkeleton
        canViewOwners={canViewOwners}
        canViewAgents={canViewAgents}
      />
    );
  }

  return (
    <GridCardSkeleton
      canViewOwners={canViewOwners}
      canViewAgents={canViewAgents}
    />
  );
}
