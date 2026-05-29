"use client";

import { FileCheck, Mail, Maximize2, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import type { PropertyDetails, PropertyInfoProps } from "./types";
import { hasPropertyDocuments } from "./utils";

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

function getAveragePricePerUnit(propertyDetails: PropertyDetails): string | null {
  const { amount } = getListingPrice(propertyDetails);
  const area =
    propertyDetails.details.built_up_area ?? propertyDetails.built_up_area;

  if (amount == null || area == null || area <= 0) {
    return null;
  }

  const currency =
    getListingPrice(propertyDetails).currency?.toUpperCase() ?? "JOD";
  const average = Math.round(amount / area);
  return `${average.toLocaleString()} ${currency}`;
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
  documentStatus,
}: {
  averagePerUnit: string | null;
  documentStatus: { label: string; isReady: boolean };
}) {
  return (
    <section
      className="grid grid-cols-2 divide-x divide-secondary/10 rounded-xl bg-page-ghost px-3 py-3.5 sm:px-4 sm:py-4"
      aria-label="Property metrics"
    >
      <div className="min-w-0 pr-3 sm:pr-4">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <Maximize2 className="size-3.5 shrink-0 text-secondary" aria-hidden />
          <span className="truncate">Avg. per m²</span>
        </p>
        <p
          className={cn(
            "mt-1.5 truncate text-base font-bold leading-tight",
            averagePerUnit ? "text-secondary" : "text-muted",
          )}
          title={averagePerUnit ?? undefined}
        >
          {averagePerUnit ?? "—"}
        </p>
      </div>

      <div className="min-w-0 pl-3 sm:pl-4">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <FileCheck className="size-3.5 shrink-0 text-secondary" aria-hidden />
          <span className="truncate">Documents</span>
        </p>
        <p
          className={cn(
            "mt-1.5 flex min-w-0 items-center gap-1.5 text-base font-bold leading-tight",
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
  email,
  className,
}: {
  name: string;
  email?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md bg-page p-2 text-sm leading-tight text-text/85",
        className,
      )}
    >
      <span className="font-medium text-secondary/90">{name}</span>
      <span className="text-text/65">{email || "No email"}</span>
    </div>
  );
}

function AgentDetailsRow({
  name,
  photo,
  phone,
  email,
}: {
  name: string;
  photo?: string | null;
  phone?: string;
  email?: string;
}) {
  const contactLine = phone || email || "No contact info";

  return (
    <div className="flex items-center gap-3 rounded-md bg-page p-2">
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="size-10 shrink-0 rounded-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary">
          {getAgentInitials(name)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight text-secondary">
          {name}
        </p>
        <p className="truncate text-sm leading-tight text-text/65">
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
  const iconButtonClassName = "size-[42px] shrink-0";

  return (
    <>
      <div className="flex justify-end gap-2 lg:hidden">
        <IconButton
          type="button"
          color="primary"
          variant="solid"
          size="md"
          onClick={onEmail}
          className={iconButtonClassName}
          icon={<Mail className="size-4 shrink-0" aria-hidden />}
          aria-label="Email"
        />
        <IconButton
          type="button"
          color="inherit"
          variant="outline"
          size="md"
          onClick={onPhone}
          className={iconButtonClassName}
          icon={<Phone className="size-4 shrink-0" aria-hidden />}
          aria-label="Call"
        />
        <IconButton
          type="button"
          color="inherit"
          variant="outline"
          size="md"
          onClick={onWhatsApp}
          className={iconButtonClassName}
          icon={<WhatsAppIcon className="size-5" />}
          aria-label="WhatsApp"
        />
      </div>

      <div className="hidden gap-2 lg:flex">
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
          className={iconButtonClassName}
          icon={<WhatsAppIcon className="size-5" />}
          aria-label="WhatsApp"
        />
      </div>
    </>
  );
}

function ListingAgentSection({
  agent,
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  agent: PropertyDetails["agent"];
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        Listing agent
      </h3>

      <AgentDetailsRow
        name={agent.name}
        photo={agent.photo}
        phone={agent.phone}
        email={agent.email}
      />

      <ContactActions
        onEmail={onEmail}
        onPhone={onPhone}
        onWhatsApp={onWhatsApp}
      />

      <p className="text-sm leading-relaxed text-muted">{CONCIERGE_NOTE}</p>
    </section>
  );
}

function OwnerSection({
  name,
  email,
  showAgentAbove,
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  name: string;
  email?: string;
  showAgentAbove?: boolean;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        Owner details
      </h3>

      <OwnerDetailsRow
        name={name}
        email={email}
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
  applicationKey,
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
  const averagePerUnit = getAveragePricePerUnit(propertyDetails);
  const documentStatus = getDocumentVerificationStatus(propertyDetails);
  const { agent, owner } = propertyDetails;
  const displayAgentSection = showAgent;
  const displayOwnerSection = showOwner && !owner.is_private;
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
            <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
              {formatPriceLabel(currency)}
            </p>
            <p className="text-xl font-bold text-secondary md:text-2xl lg:text-3xl">
              {priceDisplay}
            </p>
            <p className="text-sm leading-relaxed text-text/80">
              {SERVICE_CHARGE_NOTE}
            </p>
            <p className="flex items-center gap-2 text-sm font-medium text-secondary">
              <span
                className="size-2 shrink-0 rounded-full bg-secondary"
                aria-hidden
              />
              {VIEWING_AVAILABILITY_NOTE}
            </p>
          </section>

          <PropertyMetrics
            averagePerUnit={averagePerUnit}
            documentStatus={documentStatus}
          />
        </div>

        {hasContactColumn ? (
          <div className="flex min-w-0 flex-col gap-2 md:gap-4">
            {displayAgentSection ? (
              <ListingAgentSection
                agent={agent}
                onEmail={onEmail}
                onPhone={onPhone}
                onWhatsApp={onWhatsApp}
              />
            ) : null}

            {displayOwnerSection ? (
              <OwnerSection
                name={owner.name}
                email={owner.email}
                showAgentAbove={displayAgentSection}
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
