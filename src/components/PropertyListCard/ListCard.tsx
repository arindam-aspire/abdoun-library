import { useState } from "react";
import { Bath, Bed, Mail, MapPin, Maximize2, Phone } from "lucide-react";
import { Card } from "../ui";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { LocationLightBox } from "../ui/LocationLightBox";
import type { PropertyListCardProps } from "./types";
import { ImageGallary } from "./ImageGallary";

function resolveTitle(title: PropertyListCardProps["propertyDetails"]["title"]): string {
  return title.en || title.ar || title.esp || title.fr || "";
}

function formatArea(area: string | null): string | undefined {
  if (!area) return undefined;
  const areaValue = Number(area);
  if (!Number.isFinite(areaValue)) return undefined;
  return `${areaValue.toLocaleString()} sqft`;
}

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

export function ListCard({
  layoutVariant,
  propertyDetails,
  canViewAgents,
  canViewBadges,
  canViewOwners,
  applicationKey,
  isFavouriteLoading: isFavouriteLoadingProp,
  onClickFavourite,
  onClick,
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
}: PropertyListCardProps) {
  const isFavouriteLoading =
    isFavouriteLoadingProp ?? propertyDetails.is_favourite_loading;
  const [isLocationLightBoxOpen, setIsLocationLightBoxOpen] = useState(false);
  const title = resolveTitle(propertyDetails.title);
  const { latitude, longitude, map_embed_url: mapEmbedUrlFromApi } =
    propertyDetails.location_detail;
  const hasLocationMapData =
    latitude != null && longitude != null && Boolean(mapEmbedUrlFromApi);
  const locationLabel = [propertyDetails.areaName, propertyDetails.city]
    .filter(Boolean)
    .join(", ");
  const highlights = propertyDetails.highlights?.trim();
  const formattedArea = formatArea(propertyDetails.area);
  const formattedPrice = formatPrice(propertyDetails.price);
  const agent = canViewAgents ? propertyDetails.agent : undefined;
  const hasAgentDetails = Boolean(agent?.name);
  const owners = canViewOwners ? propertyDetails.owners ?? [] : [];

  return (
    <Card
      onClick={() => onClick?.(propertyDetails)}
      role="article"
      className="flex flex-col overflow-hidden duration-300 hover:shadow-md sm:flex-row sm:items-stretch"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[min(320px,34%)] sm:min-h-[220px]">
        <ImageGallary
          propertyDetails={propertyDetails}
          layoutVariant={layoutVariant}
          canViewAgents={canViewAgents}
          canViewBadges={canViewBadges}
          applicationKey={applicationKey}
          isFavouriteLoading={isFavouriteLoading}
          onClickFavourite={onClickFavourite}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <h3 className="text-lg font-bold leading-snug text-secondary md:text-xl">
          {title}
        </h3>
        <div className="mt-1 md:hidden lg:block">
          <div className="min-w-0">
            {highlights ? (
              <p className="text-sm leading-relaxed text-text/70">{highlights}</p>
            ) : null}
            {hasLocationMapData ? (
              <button
                type="button"
                onClick={() => setIsLocationLightBoxOpen(true)}
                className="mt-1.5 inline-flex items-center gap-1.5 text-left text-sm leading-tight text-inherit transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
                aria-label={`Open map for ${locationLabel}`}
              >
                <MapPin className="size-4 shrink-0" aria-hidden />
                <span className="truncate hover:underline hover:underline-offset-1">
                  {locationLabel}
                </span>
              </button>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5 text-sm leading-tight text-text/60">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{locationLabel}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-1 hidden min-w-0 md:flex md:items-end md:justify-between md:gap-6 lg:hidden">
          <div className="min-w-0">
            {highlights ? (
              <p className="text-sm leading-relaxed text-text/70">{highlights}</p>
            ) : null}
            {hasLocationMapData ? (
              <button
                type="button"
                onClick={() => setIsLocationLightBoxOpen(true)}
                className="mt-1.5 inline-flex items-center gap-1.5 text-left text-sm leading-tight text-inherit transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
                aria-label={`Open map for ${locationLabel}`}
              >
                <MapPin className="size-4 shrink-0" aria-hidden />
                <span className="truncate hover:underline hover:underline-offset-1">
                  {locationLabel}
                </span>
              </button>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5 text-sm leading-tight text-text/60">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{locationLabel}</span>
              </div>
            )}
          </div>
          <p className="text-lg font-bold text-secondary md:shrink-0 md:text-xl">
            {formattedPrice}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
            {propertyDetails.beds != null ? (
              <li className="flex items-center gap-2 text-sm text-text/60">
                <Bed className="size-4 shrink-0" aria-hidden />
                <span>
                  {propertyDetails.beds} {propertyDetails.beds === 1 ? "Bed" : "Beds"}
                </span>
              </li>
            ) : null}
            {propertyDetails.baths != null ? (
              <li className="flex items-center gap-2 text-sm text-text/60">
                <Bath className="size-4 shrink-0" aria-hidden />
                <span>
                  {propertyDetails.baths}{" "}
                  {propertyDetails.baths === 1 ? "Bathroom" : "Bathrooms"}
                </span>
              </li>
            ) : null}
            {formattedArea ? (
              <li className="flex items-center gap-2 text-sm text-text/60">
                <Maximize2 className="size-4 shrink-0" aria-hidden />
                <span>{formattedArea}</span>
              </li>
            ) : null}
          </ul>
          <p className="w-full text-lg font-bold text-secondary sm:ms-auto sm:w-auto md:hidden lg:block md:text-xl">
            {formattedPrice}
          </p>
        </div>

        <div className="mt-auto pt-4">
          {canViewOwners && owners.length > 0 ? (
            <div className="mb-4">
              <h4 className="mb-1.5 text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                Owners
              </h4>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t-0 pt-0 md:border-t md:border-secondary/15 md:pt-5 sm:flex-row sm:items-center">
            {hasAgentDetails ? (
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-page p-2 md:max-w-[70%] lg:max-w-none lg:flex-none">
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

            <div className="flex w-full shrink-0 justify-end gap-2 sm:ms-auto sm:w-auto md:gap-4 lg:hidden">
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
            <div className="hidden w-full shrink-0 flex-col justify-end gap-2 sm:ms-auto lg:flex lg:w-auto lg:flex-row lg:gap-4">
              <Button
                color="primary"
                variant="solid"
                size="md"
                onClick={() => onClickEmail?.(propertyDetails)}
                className="w-full min-w-[7.5rem] gap-2 px-4 py-2 text-sm sm:w-auto"
                iconStart={<Mail className="size-4 shrink-0" aria-hidden />}
              >
                <span>Email</span>
              </Button>
              <Button
                color="inherit"
                variant="outline"
                size="md"
                onClick={() => onClickCall?.(propertyDetails)}
                className="w-full min-w-[7.5rem] gap-2 px-4 py-2 text-sm sm:w-auto"
                iconStart={<Phone className="size-4 shrink-0" aria-hidden />}
              >
                <span>Call</span>
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
