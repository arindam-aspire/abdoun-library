"use client";

import { FileCheck, Mail, Maximize2, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import type { PropertyDetails, PropertyInfoProps } from "./types";
import { hasPropertyDocuments } from "./utils";
import {
  textAvatarInitialClasses,
  textBodySmClasses,
  textDisplayPriceClasses,
  textEyebrowClasses,
  textMetaMediumClasses,
  textOwnerChipClasses,
  textPersonDetailClasses,
  textPersonNameClasses,
  textStatValueClasses,
} from "../../lib/typography";

const SERVICE_CHARGE_NOTE =
  "Service charge on request. Flexible viewing times.";
const VIEWING_AVAILABILITY_NOTE = "Available for immediate viewing";
const CONCIERGE_NOTE =
  "Our concierge team confirms viewing slots within 2 hours and shares all details via WhatsApp and email.";

function getAgentInitials(name?: string | null): string {
  if (!name) return "A";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  if (words.length === 1) return words[0]!.charAt(0).toUpperCase();
  return `${words[0]!.charAt(0)}${words[1]!.charAt(0)}`.toUpperCase();
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
      amount:
        propertyDetails.rent_price_amount ??
        propertyDetails.pricing.selling_price,
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

function getAveragePricePerUnit(propertyDetails: PropertyDetails): {
  value: string | null;
  unitLabel: string;
} {
  const { amount, currency } = getListingPrice(propertyDetails);
  const area =
    propertyDetails.details.built_up_area ?? propertyDetails.built_up_area;
  const unitLabel = formatAreaUnitLabel(propertyDetails.details.area_unit);

  if (amount == null || area == null || area <= 0) {
    return { value: null, unitLabel };
  }

  const code = currency?.toUpperCase() ?? "JOD";
  const average = Math.round(amount / area);
  return {
    value: `${average.toLocaleString()} ${code}`,
    unitLabel,
  };
}

function formatAreaUnitLabel(areaUnit: string | null | undefined): string {
  const normalized = areaUnit?.trim().toLowerCase();
  if (normalized === "sqm" || normalized === "m2" || normalized === "m²") {
    return "m²";
  }
  if (normalized === "sqft" || normalized === "ft2" || normalized === "ft²") {
    return "ft²";
  }
  return areaUnit?.trim() || "m²";
}

function getDocumentVerificationStatus(propertyDetails: PropertyDetails): {
  label: string;
  isReady: boolean;
} {
  if (hasPropertyDocuments(propertyDetails.media)) {
    return { label: "Ready", isReady: true };
  }

  return { label: "Pending", isReady: false };
}

function PropertyMetrics({
  averagePerUnit,
  areaUnitLabel,
  documentStatus,
}: {
  averagePerUnit: string | null;
  areaUnitLabel: string;
  documentStatus: { label: string; isReady: boolean };
}) {
  return (
    <section
      className="grid grid-cols-2 divide-x divide-secondary/10 rounded-xl bg-page-ghost px-3 py-3.5 sm:px-4 sm:py-4"
      aria-label="Property metrics"
    >
      <div className="min-w-0 pr-3 sm:pr-4">
        <p className={cn("flex items-center gap-1.5", textMetaMediumClasses)}>
          <Maximize2 className="size-3.5 shrink-0 text-secondary" aria-hidden />
          <span className="truncate">Avg. per {areaUnitLabel}</span>
        </p>
        <p
          className={cn(
            "mt-1.5 truncate leading-tight",
            textStatValueClasses,
            averagePerUnit ? "text-secondary" : "text-muted",
          )}
          title={averagePerUnit ?? undefined}
        >
          {averagePerUnit ?? "—"}
        </p>
      </div>

      <div className="min-w-0 pl-3 sm:pl-4">
        <p className={cn("flex items-center gap-1.5", textMetaMediumClasses)}>
          <FileCheck className="size-3.5 shrink-0 text-secondary" aria-hidden />
          <span className="truncate">Documents</span>
        </p>
        <p
          className={cn(
            "mt-1.5 flex min-w-0 items-center gap-1.5 leading-tight",
            textStatValueClasses,
            documentStatus.isReady ? "text-success" : "text-tertiary-dark",
          )}
          title={documentStatus.label}
        >
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              documentStatus.isReady ? "bg-success" : "bg-tertiary",
            )}
            aria-hidden
          />
          <span className="truncate">{documentStatus.label}</span>
        </p>
      </div>
    </section>
  );
}

function OwnerDetailsRow({
  name,
  phone,
  email,
  className,
}: {
  name: string;
  phone: string;
  email: string;
  className?: string;
}) {
  const contactLine = phone || email || "No contact info";

  return (
    <div
      className={cn(
        "flex flex-col rounded-md bg-page p-2 text-text/85",
        textOwnerChipClasses,
        className,
      )}
    >
      <span className="font-medium text-secondary/90">{name}</span>
      <span className="text-text/65">{contactLine}</span>
    </div>
  );
}

function AgentDetailsRow({
  agent,
}: {
  agent: NonNullable<PropertyDetails["agent"]>;
}) {
  const contactLine =
    agent.phone || agent.whatsapp || agent.email || "No contact info";

  return (
    <div className="flex items-center gap-3 rounded-md bg-page p-2">
      {agent.photo ? (
        <img
          src={agent.photo}
          alt={agent.name}
          className="size-10 shrink-0 rounded-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary",
            textAvatarInitialClasses,
          )}
        >
          {getAgentInitials(agent.name)}
        </div>
      )}
      <div className="min-w-0">
        <p className={cn("truncate text-secondary", textPersonNameClasses)}>
          {agent.name}
        </p>
        <p className={cn("truncate", textPersonDetailClasses)}>
          {contactLine}
        </p>
      </div>
    </div>
  );
}

function ContactActions({
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <div className="flex w-full flex-row justify-end gap-2 md:gap-4">
      <Button
        type="button"
        color="primary"
        variant="solid"
        size="md"
        onClick={onEmail}
        className="min-w-0 flex-1"
        iconStart={<Mail aria-hidden />}
      >
        <span className="truncate">Email</span>
      </Button>
      <Button
        type="button"
        color="inherit"
        variant="outline"
        size="md"
        onClick={onPhone}
        className="min-w-0 flex-1"
        iconStart={<Phone aria-hidden />}
      >
        <span className="truncate">Call</span>
      </Button>
      <IconButton
        type="button"
        color="inherit"
        variant="outline"
        size="md"
        onClick={onWhatsApp}
        className="shrink-0"
        icon={<WhatsAppIcon />}
        aria-label="WhatsApp"
      />
    </div>
  );
}

function ListingAgentSection({
  agent,
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  agent: NonNullable<PropertyDetails["agent"]>;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className={cn("text-muted", textEyebrowClasses)}>
        Listing agent
      </h3>

      <AgentDetailsRow agent={agent} />

      <ContactActions
        onEmail={onEmail}
        onPhone={onPhone}
        onWhatsApp={onWhatsApp}
      />

      <p className={cn(textBodySmClasses, "text-muted")}>{CONCIERGE_NOTE}</p>
    </section>
  );
}

function OwnerSection({
  owner,
  showAgentAbove,
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  owner: NonNullable<PropertyDetails["owner"]>;
  showAgentAbove?: boolean;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className={cn("text-muted", textEyebrowClasses)}>
        Owner details
      </h3>

      <OwnerDetailsRow
        name={owner.name}
        phone={owner.phone}
        email={owner.email}
        className={showAgentAbove ? "sm:pt-4 md:pt-2" : undefined}
      />

      <ContactActions
        onEmail={onEmail}
        onPhone={onPhone}
        onWhatsApp={onWhatsApp}
      />
    </section>
  );
}

export function PropertyInfo({
  propertyDetails,
  className,
  showAgent = true,
  showOwner = true,
  onEmail,
  onPhone,
  onWhatsApp,
  onOwnerEmail,
  onOwnerPhone,
  onOwnerWhatsApp,
}: PropertyInfoProps) {
  const { amount, currency } = getListingPrice(propertyDetails);
  const priceDisplay = formatPriceDisplay(
    amount,
    currency,
    propertyDetails.pricing.price_on_request,
  );
  const { value: averagePerUnit, unitLabel: areaUnitLabel } =
    getAveragePricePerUnit(propertyDetails);
  const documentStatus = getDocumentVerificationStatus(propertyDetails);
  const { agent, owner } = propertyDetails;
  const displayAgentSection = showAgent && agent != null;
  const displayOwnerSection =
    showOwner && owner != null && !owner.is_private;
  const hasContactColumn = displayAgentSection || displayOwnerSection;

  return (
    <aside
      className={cn(
        "w-full min-w-0 lg:sticky lg:top-6 lg:self-start",
        className,
      )}
      aria-label="Price, listing agent, and owner details"
    >
      <Card
        className={cn(
          "flex w-full min-w-0 flex-col gap-2 p-4 sm:p-5 md:gap-4 md:p-6",
          hasContactColumn &&
            "md:grid md:grid-cols-2 md:items-start lg:flex lg:flex-col",
        )}
      >
        <div className="flex min-w-0 flex-col gap-2 md:gap-4">
          <section className="flex flex-col gap-2">
            <p className={cn("text-muted", textEyebrowClasses)}>
              {formatPriceLabel(currency)}
            </p>
            <p className={cn(textDisplayPriceClasses, "text-secondary")}>
              {priceDisplay}
            </p>
            <p className={cn(textBodySmClasses, "text-text/80")}>
              {SERVICE_CHARGE_NOTE}
            </p>
            <p
              className={cn(
                "flex items-center gap-2 text-secondary",
                textMetaMediumClasses,
              )}
            >
              <span
                className="size-2 shrink-0 rounded-full bg-secondary"
                aria-hidden
              />
              {VIEWING_AVAILABILITY_NOTE}
            </p>
          </section>

          <PropertyMetrics
            averagePerUnit={averagePerUnit}
            areaUnitLabel={areaUnitLabel}
            documentStatus={documentStatus}
          />
        </div>

        {hasContactColumn ? (
          <div className="flex min-w-0 flex-col gap-2 md:gap-4">
            {displayAgentSection && agent ? (
              <ListingAgentSection
                agent={agent}
                onEmail={onEmail}
                onPhone={onPhone}
                onWhatsApp={onWhatsApp}
              />
            ) : null}

            {displayOwnerSection && owner ? (
              <OwnerSection
                owner={owner}
                showAgentAbove={Boolean(displayAgentSection && agent)}
                onEmail={onOwnerEmail}
                onPhone={onOwnerPhone}
                onWhatsApp={onOwnerWhatsApp}
              />
            ) : null}
          </div>
        ) : null}
      </Card>
    </aside>
  );
}
