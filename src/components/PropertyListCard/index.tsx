"use client";

import type { PropertyListCardProps } from "./types";
import { GridCard } from "./GridCard";
import { ListCard } from "./ListCard";

export function PropertyListCard(props: PropertyListCardProps) {
  if (props.layoutVariant === "list") {
    return <ListCard {...props} />;
  }

  return <GridCard {...props} />;
}
