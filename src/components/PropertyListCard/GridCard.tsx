import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import type { PropertyListCardProps } from "./types";
import { Card } from "../ui";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { ImageGallary } from "./ImageGallary";
import { LocationLightBox } from "../ui/LocationLightBox";

function formatPrice(price: string): string {
  const normalized = price.trim();
  const match = normalized.match(/^([A-Za-z]{3})\s+(.+)$/);
  if (!match) return normalized;

  const [, currency, amount] = match;
  return `${amount} ${currency}`;
}

function getAgentInitials(name?: string | null): string {
  if (!name) return "A";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  if (words.length === 1) return words[0]!.charAt(0).toUpperCase();
  return `${words[0]!.charAt(0)}${words[1]!.charAt(0)}`.toUpperCase();
}

export function GridCard({
  layoutVariant,
  propertyDetails,
  canViewAgents,
  canViewBadges,
  canViewOwners,
  applicationKey,
  isFavouriteLoading,
  onClickFavourite,
  onClick,
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
}: PropertyListCardProps) {
  const [isLocationLightBoxOpen, setIsLocationLightBoxOpen] = useState(false);
  const formattedPrice = formatPrice(propertyDetails.price);
  const areaValue = Number(propertyDetails.area);
  const formattedArea =
    propertyDetails.area != null && Number.isFinite(areaValue)
      ? `${areaValue.toLocaleString()} sqft`
      : undefined;

  const { latitude, longitude, map_embed_url: mapEmbedUrlFromApi } =
    propertyDetails.location_detail;
  const hasLocationMapData =
    latitude != null && longitude != null && Boolean(mapEmbedUrlFromApi);

  const locationLabel = [propertyDetails.areaName, propertyDetails.city]
    .filter(Boolean)
    .join(", ");
  const agent = propertyDetails.agent;
  const hasAgentDetails = Boolean(canViewAgents && agent?.name);
  const owners = canViewOwners ? propertyDetails.owners ?? [] : [];

  return (
    <Card
      onClick={() => onClick?.(propertyDetails)}
      role="article"
      className="flex h-full flex-col overflow-hidden duration-300 hover:shadow-md"
    >
      <ImageGallary
        propertyDetails={propertyDetails}
        layoutVariant={layoutVariant}
        canViewAgents={canViewAgents}
        canViewBadges={canViewBadges}
        onClickFavourite={onClickFavourite}
        isFavouriteLoading={isFavouriteLoading}
        applicationKey={applicationKey}
      />
      <div className="flex flex-col p-4">
        <p className="text-lg font-bold leading-tight text-secondary md:text-xl">
          {formattedPrice}
        </p>
        <div className="mt-1 flex items-center gap-1 text-sm leading-tight text-text/75 md:text-base">
          {formattedArea ? <span>{formattedArea}</span> : null}
          {formattedArea && propertyDetails.propertyType ? <span>•</span> : null}
          {propertyDetails.propertyType ? (
            <span>{propertyDetails.propertyType}</span>
          ) : null}
        </div>
        {hasLocationMapData ? (
          <button
            type="button"
            onClick={() => setIsLocationLightBoxOpen(true)}
            className="mt-1 inline-flex items-center gap-1.5 text-left text-sm leading-tight text-inherit transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 md:text-base"
            aria-label={`Open map for ${locationLabel}`}
          >
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate hover:underline hover:underline-offset-1">
              {locationLabel}
            </span>
          </button>
        ) : (
          <div className="mt-1 flex items-center gap-1.5 text-sm leading-tight text-text md:text-base">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{locationLabel}</span>
          </div>
        )}

        {hasAgentDetails ? (
          <div className="mt-2 flex items-center gap-3 rounded-md bg-page p-2">
            {agent?.photo ? (
              <img
                src={agent.photo}
                alt={agent.name}
                className="size-10 shrink-0 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary">
                {getAgentInitials(agent?.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-secondary">
                {agent?.name}
              </p>
              <p className="truncate text-sm leading-tight text-text/65">
                {agent?.phone || agent?.email || "No contact info"}
              </p>
            </div>
          </div>
        ) : null}

        {owners.length > 0 ? (
          <div className="mt-2 grid grid-cols-1 gap-1.5">
            {owners.map((owner) => (
              <div
                key={owner.owner_id}
                className="flex flex-col rounded-md bg-page p-2 text-sm leading-tight text-text/85"
              >
                <span className="font-medium text-secondary/90">
                  {owner.full_name || "Owner"}
                </span>
                <span className="text-text/65">{owner.email || "No email"}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex w-full justify-end gap-2 md:gap-4 lg:hidden">
          <IconButton
            color="primary"
            variant="solid"
            size="md"
            onClick={() => onClickEmail?.(propertyDetails)}
            className="w-11"
            icon={<Mail className="size-4 shrink-0" aria-hidden />}
            aria-label="Email"
          />
          <IconButton
            color="inherit"
            variant="outline"
            size="md"
            onClick={() => onClickCall?.(propertyDetails)}
            className="w-11"
            icon={<Phone className="size-4 shrink-0" aria-hidden />}
            aria-label="Call"
          />
          <IconButton
            color="inherit"
            variant="outline"
            size="md"
            onClick={() => onClickWhatsApp?.(propertyDetails)}
            className="w-11"
            icon={<WhatsAppIcon className="size-5" />}
            aria-label="WhatsApp"
          />
        </div>
        <div className="mt-4 hidden w-full flex-col gap-2 lg:flex lg:flex-row lg:gap-4">
          <Button
            color="primary"
            variant="solid"
            size="md"
            onClick={() => onClickEmail?.(propertyDetails)}
            className="min-w-0 shrink-0 flex-1 gap-2 px-4 py-2 text-sm"
            iconStart={<Mail className="size-4 shrink-0" aria-hidden />}
          >
            <span className="truncate">Email</span>
          </Button>
          <Button
            color="inherit"
            variant="outline"
            size="md"
            onClick={() => onClickCall?.(propertyDetails)}
            className="min-w-0 shrink-0 flex-1 gap-2 px-4 py-2 text-sm"
            iconStart={<Phone className="size-4 shrink-0" aria-hidden />}
          >
            <span className="truncate">Call</span>
          </Button>
          <IconButton
            color="inherit"
            variant="outline"
            size="md"
            onClick={() => onClickWhatsApp?.(propertyDetails)}
            className="w-11"
            icon={<WhatsAppIcon className="size-5" />}
            aria-label="WhatsApp"
          />
        </div>
      </div>

      <LocationLightBox
        isOpen={isLocationLightBoxOpen}
        onClose={() => setIsLocationLightBoxOpen(false)}
        latitude={latitude}
        longitude={longitude}
        mapEmbedUrl={mapEmbedUrlFromApi}
        locationLabel={locationLabel}
        ariaLabel="Property location map viewer"
      />
    </Card>
  );
}
