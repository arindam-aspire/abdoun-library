import { GridCardSkeleton } from "./GridCardSkeleton";
import { ListCardSkeleton } from "./ListCardSkeleton";
import type { PropertyListCardSkeletonProps } from "./types";

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
