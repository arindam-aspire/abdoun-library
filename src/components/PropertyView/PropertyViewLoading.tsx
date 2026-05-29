"use client";

import { cn } from "../../lib/cn";
import { HeroSectionSkeleton } from "./HeroSectionSkeleton";
import { PropertyDetailsTabs } from "./PropertyDetailsTabs";
import type { PropertyViewTabOption } from "./types";

export type PropertyViewLoadingProps = {
  activeTab?: string;
  tabOptions?: PropertyViewTabOption[];
  onTabChange?: (value: string) => void;
  className?: string;
  showAgent?: boolean;
  showOwner?: boolean;
};

export function PropertyViewLoading({
  activeTab = "overview",
  tabOptions = [],
  onTabChange,
  className,
  showAgent = true,
  showOwner = true,
}: PropertyViewLoadingProps) {
  const resolvedTab = tabOptions.some((tab) => tab.value === activeTab)
    ? activeTab
    : (tabOptions[0]?.value ?? "overview");

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-2 md:gap-4 lg:gap-6",
        className,
      )}
      aria-busy="true"
      aria-label="Loading property view"
    >
      <HeroSectionSkeleton />

      <PropertyDetailsTabs
        tabOptions={tabOptions}
        activeTab={resolvedTab}
        onTabChange={onTabChange}
        isLoading
        showAgent={showAgent}
        showOwner={showOwner}
      />
    </article>
  );
}
