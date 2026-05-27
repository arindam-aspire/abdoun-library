"use client";

import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { WhatsAppIcon } from "../PropertyCard/WhatsAppIcon";
import type { ApplicationKey, PriceAgentSectionProps, PropertyDetails } from "./types";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getListingPrice(propertyDetails: PropertyDetails): {
  amount: number | null;
  currency: string | null;
} {
  if (propertyDetails.pricing.price_on_request) {
    return { amount: null, currency: propertyDetails.pricing.currency };
  }

  if (propertyDetails.listing_type === "rent") {
    return {
      amount: propertyDetails.rent_price_amount ?? propertyDetails.pricing.selling_price,
      currency:
        propertyDetails.rent_price_currency ??
        propertyDetails.pricing.currency,
    };
  }

  return {
    amount:
      propertyDetails.selling_price_amount ??
      propertyDetails.pricing.selling_price,
    currency:
      propertyDetails.selling_price_currency ??
      propertyDetails.pricing.currency,
  };
}

function formatPriceLabel(currency: string | null): string {
  const code = currency?.toUpperCase() ?? "JOD";
  const shortCode = code === "JOD" ? "JD" : code;
  return `PRICE (${shortCode})`;
}

function formatPriceDisplay(
  amount: number | null,
  currency: string | null,
  priceOnRequest: boolean,
): string {
  if (priceOnRequest || amount == null) {
    return "Price on request";
  }

  const code = currency?.toUpperCase() ?? "JOD";
  return `${amount.toLocaleString()} ${code}`;
}

function getAveragePricePerUnit(propertyDetails: PropertyDetails): string | null {
  const { amount } = getListingPrice(propertyDetails);
  const area =
    propertyDetails.details.built_up_area ?? propertyDetails.built_up_area;

  if (amount == null || area == null || area <= 0) {
    return null;
  }

  const currency = getListingPrice(propertyDetails).currency?.toUpperCase() ?? "JOD";
  const average = Math.round(amount / area);
  return `${average.toLocaleString()} ${currency}`;
}

function getDocumentVerificationStatus(propertyDetails: PropertyDetails): {
  label: string;
  isReady: boolean;
} {
  const hasDocuments =
    (propertyDetails.media.documents?.length ?? 0) > 0 ||
    (propertyDetails.media.floor_plan_images?.length ?? 0) > 0;

  if (hasDocuments) {
    return { label: "Ready", isReady: true };
  }

  return { label: "Pending", isReady: false };
}

function defaultAgentSpecialty(propertyDetails: PropertyDetails): string {
  const region = propertyDetails.location_detail.region;
  const category = propertyDetails.category;

  if (region && category) {
    return `${category} specialist - ${region}`;
  }

  return region ?? category ?? "Property specialist";
}

function getContactAvatarClassName(applicationKey?: ApplicationKey): string {
  const base =
    "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-page";

  if (applicationKey === "abdoun_web") {
    return cn(base, "from-secondary to-secondary-dark");
  }

  return cn(base, "from-primary to-primary-dark");
}

function StatRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </p>
      <div className={cn("mt-1 text-sm font-bold text-text", valueClassName)}>
        {value}
      </div>
    </div>
  );
}

function ContactPersonSection({
  title,
  name,
  subtitle,
  photo,
  applicationKey,
  onEmail,
  onPhone,
  onWhatsApp,
  footerNote,
}: {
  title: string;
  name: string;
  subtitle?: string;
  photo?: string | null;
  applicationKey?: ApplicationKey;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
  footerNote?: string;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-secondary/10 pt-6">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        {title}
      </h3>

      <div className="flex items-center gap-3">
        {photo ? (
          <img
            src={photo}
            alt=""
            className="size-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className={getContactAvatarClassName(applicationKey)}>
            {getInitials(name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-secondary">{name}</p>
          {subtitle ? (
            <p className="truncate text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          onClick={onEmail}
          className="min-h-[42px] min-w-0 flex-1 gap-2 px-4"
          iconStart={<Mail className="size-4 shrink-0" aria-hidden />}
        >
          <span className="truncate">Email</span>
        </Button>
        <Button
          type="button"
          color="inherit"
          variant="outline"
          size="md"
          onClick={onPhone}
          className="min-h-[42px] min-w-0 flex-1 gap-2 px-4"
          iconStart={<Phone className="size-4 shrink-0" aria-hidden />}
        >
          <span className="truncate">Call</span>
        </Button>
        <IconButton
          type="button"
          color="inherit"
          variant="outline"
          size="md"
          onClick={onWhatsApp}
          className="size-[42px] shrink-0"
          icon={<WhatsAppIcon className="size-5" />}
          aria-label="WhatsApp"
        />
      </div>

      {footerNote ? (
        <p className="text-sm leading-relaxed text-muted">{footerNote}</p>
      ) : null}
    </section>
  );
}

export function PriceAgentSection({
  propertyDetails,
  applicationKey,
  className,
  showAgent = true,
  showOwner = true,
  agentSpecialty,
  ownerCompanyLabel,
  serviceChargeNote = "Service charge on request. Flexible viewing times.",
  viewingAvailabilityNote = "Available for immediate viewing",
  conciergeNote = "Our concierge team confirms viewing slots within 2 hours and shares all details via WhatsApp and email.",
  onEmail,
  onPhone,
  onWhatsApp,
  onOwnerEmail,
  onOwnerPhone,
  onOwnerWhatsApp,
}: PriceAgentSectionProps) {
  const { amount, currency } = getListingPrice(propertyDetails);
  const priceDisplay = formatPriceDisplay(
    amount,
    currency,
    propertyDetails.pricing.price_on_request,
  );
  const averagePerUnit = getAveragePricePerUnit(propertyDetails);
  const documentStatus = getDocumentVerificationStatus(propertyDetails);
  const { agent, owner } = propertyDetails;
  const specialty = agentSpecialty ?? defaultAgentSpecialty(propertyDetails);
  const ownerSubtitle = ownerCompanyLabel;
  const showOwnerDetails = showOwner && !owner.is_private;

  return (
    <aside
      className={cn("lg:sticky lg:top-6 lg:self-start", className)}
      aria-label="Price, listing agent, and owner details"
    >
      <Card className="flex flex-col gap-6 p-5 sm:p-6">
        <section className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
            {formatPriceLabel(currency)}
          </p>
          <p className="text-3xl font-bold text-secondary">{priceDisplay}</p>
          {serviceChargeNote ? (
            <p className="text-sm leading-relaxed text-text/80">{serviceChargeNote}</p>
          ) : null}
          {viewingAvailabilityNote ? (
            <p className="flex items-center gap-2 text-sm font-medium text-secondary">
              <span
                className="size-2 shrink-0 rounded-full bg-secondary"
                aria-hidden
              />
              {viewingAvailabilityNote}
            </p>
          ) : null}
        </section>

        <section className="flex gap-6 sm:gap-10">
          <StatRow label="Avg. per m2" value={averagePerUnit ?? "—"} />
          <StatRow
            label="Document verification"
            value={
              <span className="inline-flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    documentStatus.isReady ? "bg-success" : "bg-tertiary",
                  )}
                  aria-hidden
                />
                {documentStatus.label}
              </span>
            }
            valueClassName={
              documentStatus.isReady ? "text-success" : "text-tertiary-dark"
            }
          />
        </section>

        {showAgent ? (
          <ContactPersonSection
            title="Listing agent"
            name={agent.name}
            subtitle={specialty}
            photo={agent.photo}
            applicationKey={applicationKey}
            onEmail={onEmail}
            onPhone={onPhone}
            onWhatsApp={onWhatsApp}
            footerNote={conciergeNote}
          />
        ) : null}

        {showOwnerDetails ? (
          <ContactPersonSection
            title="Owner details"
            name={owner.name}
            subtitle={ownerSubtitle}
            applicationKey={applicationKey}
            onEmail={onOwnerEmail}
            onPhone={onOwnerPhone}
            onWhatsApp={onOwnerWhatsApp}
          />
        ) : null}
      </Card>
    </aside>
  );
}
