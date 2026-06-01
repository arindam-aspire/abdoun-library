"use client";

import { Layers, Sparkles, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import { mapPropertyFeatures } from "./featureUtils";
import type {
  FeatureTabProps,
  PropertyFeatureType,
} from "./types";
import type { MatchedPropertyFeature } from "./featureUtils";
import {
  textBodySmClasses,
  textEmptyHeadingClasses,
  textFeatureItemClasses,
  textSectionTitleClasses,
} from "../../lib/typography";

const EMPTY_FEATURES_TITLE = "No amenities listed";
const EMPTY_FEATURES_DESCRIPTION =
  "Features and amenities for this property haven't been added yet. Contact the agent if you'd like more details.";

const featureTypeIcons: Record<PropertyFeatureType, LucideIcon> = {
  FEATURE: Layers,
  AMENITIES: Sparkles,
};

function GhostFeatureIcon({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "size-10 rounded-lg border border-secondary/15 bg-card-background shadow-sm",
        className,
      )}
    />
  );
}

function FeaturesEmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-5 overflow-hidden rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-10 text-center sm:px-8 sm:py-12"
    >
      <div className="relative mx-auto mb-6 flex h-20 w-full max-w-[14rem] items-center justify-center">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3"
          aria-hidden
        >
          <GhostFeatureIcon className="-translate-x-2 -rotate-6 opacity-50" />
          <GhostFeatureIcon className="opacity-30" />
          <GhostFeatureIcon className="translate-x-2 rotate-6 opacity-50" />
        </div>

        <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-surface text-secondary shadow-md ring-1 ring-secondary/10">
          <Sparkles className="size-7" aria-hidden />
        </span>
      </div>

      <h4 className={cn(textEmptyHeadingClasses, "text-text")}>
        {EMPTY_FEATURES_TITLE}
      </h4>
      <p className={cn("mx-auto mt-2 max-w-md text-muted", textBodySmClasses)}>
        {EMPTY_FEATURES_DESCRIPTION}
      </p>
    </div>
  );
}

function FeatureItem({ name, feature_group }: MatchedPropertyFeature) {
  const Icon = featureTypeIcons[feature_group];

  return (
    <li className="flex items-center gap-4">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className={cn(textFeatureItemClasses, "text-text/80")}>{name}</span>
    </li>
  );
}

export function FeatureTab({
  propertyDetails,
  features,
  className,
}: FeatureTabProps) {
  const matchedFeatures = useMemo(
    () => mapPropertyFeatures(propertyDetails.features_list, features),
    [features, propertyDetails.features_list],
  );

  return (
    <section
      className={cn("flex flex-col", className)}
      aria-label="Features and amenities"
    >
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <h3 className={cn(textSectionTitleClasses, "text-secondary")}>
          Features & Amenities
        </h3>

        {matchedFeatures.length > 0 ? (
          <ul className="mt-5 grid grid-cols-1 gap-y-4 gap-x-12 md:grid-cols-2">
            {matchedFeatures.map((feature) => (
              <FeatureItem
                key={`${feature.id}-${feature.feature_group}`}
                {...feature}
              />
            ))}
          </ul>
        ) : (
          <FeaturesEmptyState />
        )}
      </Card>
    </section>
  );
}
