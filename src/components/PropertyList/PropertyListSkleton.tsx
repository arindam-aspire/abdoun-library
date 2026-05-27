import { cn } from "../../lib/cn";
import { PropertyListGridViewSkleton } from "./PropertyListGridViewSkleton";
import { PropertyListPaginationSkleton } from "./PropertyListPaginationSkleton";
import { PropertyListToolbarSkleton } from "./PropertyListToolbarSkleton";
import type { PropertyListView } from "./types";

export type PropertyListSkletonProps = {
  layoutVariant?: PropertyListView;
  className?: string;
};

export function PropertyListSkleton({
  layoutVariant = "grid",
  className,
}: PropertyListSkletonProps) {
  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-busy="true"
      aria-label="Loading properties"
    >
      <PropertyListToolbarSkleton />
      <PropertyListGridViewSkleton layoutVariant={layoutVariant} />
      <PropertyListPaginationSkleton />
    </section>
  );
}
