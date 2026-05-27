"use client";

import {
  BedDouble,
  BookOpen,
  Building2,
  Car,
  Droplets,
  MapPin,
  Shield,
  Sparkles,
  type LucideIcon,
  UtensilsCrossed,
  Wind,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import type { FeatureTabProps } from "./types";

type AmenityIconRule = {
  icon: LucideIcon;
  keywords: string[];
};

const amenityIconRules: AmenityIconRule[] = [
  { icon: Droplets, keywords: ["pool", "plunge", "water"] },
  { icon: UtensilsCrossed, keywords: ["kitchen", "dining", "lounge", "chef"] },
  { icon: Wind, keywords: ["window", "panoramic", "view"] },
  { icon: Sparkles, keywords: ["smart", "climate", "lighting"] },
  { icon: BedDouble, keywords: ["bed", "bedroom", "suite", "wardrobe"] },
  { icon: BookOpen, keywords: ["study", "library", "book"] },
  {
    icon: Building2,
    keywords: ["maid", "entrance", "fitness", "studio", "lobby"],
  },
  { icon: Car, keywords: ["parking", "garage", "bay"] },
  { icon: Shield, keywords: ["security", "concierge", "guard"] },
  { icon: MapPin, keywords: ["school", "embassy", "proximity", "location"] },
];

function getAmenityIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase();

  for (const rule of amenityIconRules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.icon;
    }
  }

  return Sparkles;
}

function FeatureItem({ label }: { label: string }) {
  const Icon = getAmenityIcon(label);

  return (
    <li className="flex items-center gap-4">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
        <Icon className="size-5 text-primary" aria-hidden />
      </span>
      <span className="text-sm font-medium text-text/80">{label}</span>
    </li>
  );
}

export function FeatureTab({
  propertyDetails,
  className,
}: FeatureTabProps) {
  const amenities = propertyDetails.features.amenities ?? [];

  return (
    <section className={cn("flex flex-col", className)} aria-label="Features">
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
          Features
        </h3>
        <div className="mt-4 border-b border-secondary/10" aria-hidden />

        {amenities.length > 0 ? (
          <ul className="mt-5 grid grid-cols-1 gap-y-4 gap-x-12 md:grid-cols-2">
            {amenities.map((amenity) => (
              <FeatureItem key={amenity} label={amenity} />
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-muted">
            No amenities listed for this property.
          </p>
        )}
      </Card>
    </section>
  );
}
