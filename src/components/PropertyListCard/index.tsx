"use client";

import type { PropertyListCardProps } from "./types";
import { GridCard } from "./GridCard";
import { GridCardSkeleton } from "./GridCardSkeleton";
import { ListCard } from "./ListCard";
import { ListCardSkeleton } from "./ListCardSkeleton";

export function PropertyListCard(props: PropertyListCardProps) {
  if (props.layoutVariant === "list") {
    return <ListCard {...props} />;
  }

  return <GridCard {...props} />;
}

export { GridCardSkeleton, ListCardSkeleton };