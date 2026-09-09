"use client";

import { FileCheck, Mail, Maximize2, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";
import type { BadgeVariant } from "../ui/Badge/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import type { UiControlSize } from "../ui/commonTypes";
import {
  propertyViewButtonSizeClasses,
  propertyViewIconButtonGlyphClasses,
  propertyViewIconButtonSizeClasses,
} from "../ui/responsiveSizes";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import {
  PROPERTY_LISTING_STATUS_KEYS,
  createListingStatus,
  getPropertyListingStatusColorScheme,
  statusColorSchemeToBadgeVariant,
  type PropertyListingStatusKey,
} from "../PropertyCardList/listingStatus";
import {
  contactPhoneFlagUrl,
  parseContactPhone,
} from "./contactPhone";
import type {
  PropertyDetails,
  PropertyInfoProps,
  PropertyOwner,
  PropertyStatusActionCard,
} from "./types";
import { hasPropertyDocuments, resolvePropertyOwners } from "./utils";
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

function normalizeStatusValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");
}

function normalizeStatusKey(value: string): string {
  const normalized = normalizeStatusValue(value);

  if ((PROPERTY_LISTING_STATUS_KEYS as readonly string[]).includes(normalized)) {
    return normalized;
  }

  const withUnderscores = normalized.replace(/-/g, "_");

  if ((PROPERTY_LISTING_STATUS_KEYS as readonly string[]).includes(withUnderscores)) {
    return withUnderscores;
  }

  const normalizedNoPunctuation = withUnderscores.replace(/[^a-z0-9_]/g, "");
  const aliasMap: Record<string, string> = {
    pendingadminapproval: "pending_admin_approval",
    pendingadminapprovalstatus: "pending_admin_approval",
  };

  return aliasMap[normalizedNoPunctuation] ?? normalized;
}

function resolveStatusLabel(status: string): string {
  const normalized = normalizeStatusKey(status);
  const isKnown = (PROPERTY_LISTING_STATUS_KEYS as readonly string[]).includes(
    normalized,
  );

  if (isKnown) {
    return createListingStatus(
      normalized as (typeof PROPERTY_LISTING_STATUS_KEYS)[number],
    ).label;
  }

  return status
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolvePendingStatusActions(status: string): string[] {
  const normalized = normalizeStatusKey(status);

  if (normalized.includes("draft")) {
    return ["Complete required information and resubmit"];
  }

  if (
    normalized === "pending-approval" ||
    normalized === "pending_admin_approval" ||
    normalized === "submitted" ||
    normalized === "in-progress" ||
    normalized === "changes-requested"
  ) {
    return ["Review and take action"];
  }

  if (normalized === "deal-closure-requested") {
    return ["Process deal closure request"];
  }

  if (normalized === "rejected") {
    return ["Make updates and re-submit"];
  }

  return [];
}

function badgeVariantForLabel(label: string): BadgeVariant {
  const normalized = label.toLowerCase();
  if (normalized.includes("exclusive") || normalized.includes("حصري")) {
    return "exclusive";
  }
  if (normalized.includes("new") || normalized.includes("verified")) {
    return "success";
  }
  if (
    normalized.includes("featured") ||
    normalized.includes("premium") ||
    normalized.includes("rent")
  ) {
    return "warning";
  }
  if (normalized.includes("sale")) {
    return "secondary";
  }
  return "default";
}

function resolveHandoverBadgeVariant(handover: string): BadgeVariant {
  const normalizedKey = normalizeStatusKey(handover);
  if (
    (PROPERTY_LISTING_STATUS_KEYS as readonly string[]).includes(normalizedKey)
  ) {
    return statusColorSchemeToBadgeVariant(
      getPropertyListingStatusColorScheme(
        normalizedKey as PropertyListingStatusKey,
      ),
    );
  }

  return badgeVariantForLabel(handover);
}

function resolveHandoverLabel(handover: string): string {
  const normalizedKey = normalizeStatusKey(handover);
  if (
    (PROPERTY_LISTING_STATUS_KEYS as readonly string[]).includes(normalizedKey)
  ) {
    return resolveStatusLabel(handover);
  }

  return handover.trim();
}

function PhoneDisplayLine({
  phone,
  phoneCountryCode,
  className,
}: {
  phone: string;
  phoneCountryCode?: string;
  className?: string;
}) {
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) {
    return null;
  }

  const parsed = parseContactPhone(trimmedPhone, phoneCountryCode);

  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-1.5 text-text/65",
        textPersonDetailClasses,
        className,
      )}
    >
      {parsed.iso2 ? (
        <img
          src={contactPhoneFlagUrl(parsed.iso2)}
          alt=""
          className="size-4 shrink-0 rounded-sm object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <span className="truncate" title={parsed.raw}>
        {parsed.displayNumber}
      </span>
    </span>
  );
}

function HandoverBadge({ handover }: { handover: string }) {
  const label = resolveHandoverLabel(handover);

  return (
    <Badge
      variant={resolveHandoverBadgeVariant(handover)}
      appearance="soft"
      className="w-fit max-w-full self-start"
    >
      {label}
    </Badge>
  );
}

function StatusActionCard({
  statusActionCard,
  showStatusLabelFallback,
  buttonSize = "md",
}: {
  statusActionCard?: PropertyStatusActionCard;
  showStatusLabelFallback: string;
  buttonSize?: UiControlSize;
}) {
  const statusLabel = statusActionCard?.statusLabel ?? showStatusLabelFallback;
  const pendingActions = statusActionCard?.pendingActions ?? [];
  const actions = statusActionCard?.actions ?? [];

  return (
    <section className="rounded-lg border border-secondary/20 bg-page p-3 sm:p-4">
      <p className={cn("text-xs uppercase tracking-wide text-muted", textBodySmClasses)}>
        Property Status
      </p>
      <p className={cn("mt-1.5 text-sm font-medium text-text", textMetaMediumClasses)}>
        {statusLabel}
      </p>

      <p className={cn("mt-3 text-xs uppercase tracking-wide text-muted", textBodySmClasses)}>
        Pending Actions
      </p>
      {actions.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {actions.map((action) => {
            const color =
              action.tone === "danger"
                ? "danger"
                : action.tone === "success"
                  ? "success"
                  : action.tone === "primary"
                    ? "primary"
                    : "inherit";
            const variant = action.tone === "default" || !action.tone ? "outline" : "solid";

            return (
              <Button
                key={action.id}
                type="button"
                color={color}
                variant={variant}
                size="md"
                fullWidth
                disabled={action.disabled}
                isLoading={action.isLoading}
                loadingLabel={action.loadingLabel}
                onClick={action.onClick}
                className={propertyViewButtonSizeClasses(buttonSize)}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : pendingActions.length > 0 ? (
        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-text">
          {pendingActions.map((action) => (
            <li key={action} className="leading-snug">
              {action}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-muted">No pending actions</p>
      )}
    </section>
  );
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
  phoneCountryCode,
  className,
}: {
  name: string;
  phone: string;
  phoneCountryCode?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-0.5 rounded-md bg-page p-2 text-text/85",
        textOwnerChipClasses,
        className,
      )}
    >
      <span className="truncate font-medium text-secondary/90">{name}</span>
      <PhoneDisplayLine phone={phone} phoneCountryCode={phoneCountryCode} />
    </div>
  );
}

function AgentDetailsRow({
  agent,
}: {
  agent: NonNullable<PropertyDetails["agent"]>;
}) {
  const hasPhone = Boolean(agent.phone.trim());

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md bg-page p-2">
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
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-secondary", textPersonNameClasses)}>
          {agent.name}
        </p>
        {hasPhone ? (
          <PhoneDisplayLine
            phone={agent.phone}
            phoneCountryCode={agent.phone_country_code}
          />
        ) : null}
      </div>
    </div>
  );
}

function ContactActions({
  buttonSize = "md",
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  buttonSize?: UiControlSize;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-row items-stretch justify-end gap-2 md:gap-4">
      <Button
        type="button"
        color="primary"
        variant="solid"
        size="md"
        onClick={onEmail}
        className={cn(
          propertyViewButtonSizeClasses(buttonSize),
          "min-w-0 flex-1",
        )}
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
        className={cn(
          propertyViewButtonSizeClasses(buttonSize),
          "min-w-0 flex-1",
        )}
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
        className={cn(
          propertyViewIconButtonSizeClasses(buttonSize),
          propertyViewIconButtonGlyphClasses(buttonSize),
          "shrink-0",
        )}
        icon={<WhatsAppIcon />}
        aria-label="WhatsApp"
      />
    </div>
  );
}

function ListingAgentSection({
  agent,
  buttonSize = "md",
  onEmail,
  onPhone,
  onWhatsApp,
}: {
  agent: NonNullable<PropertyDetails["agent"]>;
  buttonSize?: UiControlSize;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
}) {
  return (
    <section className="flex w-full min-w-0 flex-col gap-4">
      <h3 className={cn("text-muted", textEyebrowClasses)}>
        Listing agent
      </h3>

      <AgentDetailsRow agent={agent} />

      <ContactActions
        buttonSize={buttonSize}
        onEmail={onEmail}
        onPhone={onPhone}
        onWhatsApp={onWhatsApp}
      />
    </section>
  );
}

function OwnerSection({
  owners,
  showAgentAbove,
}: {
  owners: PropertyOwner[];
  showAgentAbove?: boolean;
}) {
  const isSingleOwner = owners.length === 1;
  const singleOwner = owners[0];

  return (
    <section className="flex w-full min-w-0 flex-col gap-4">
      <h3 className={cn("text-muted", textEyebrowClasses)}>
        Owner details
      </h3>

      {isSingleOwner && singleOwner ? (
        <OwnerDetailsRow
          name={singleOwner.name}
          phone={singleOwner.phone}
          phoneCountryCode={singleOwner.phone_country_code}
          className={showAgentAbove ? "sm:pt-4 md:pt-2" : undefined}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {owners.map((owner, index) => (
            <OwnerDetailsRow
              key={owner.id}
              name={owner.name}
              phone={owner.phone}
              phoneCountryCode={owner.phone_country_code}
              className={
                index === 0 && showAgentAbove ? "sm:pt-4 md:pt-2" : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function PropertyInfo({
  propertyDetails,
  className,
  showAgent = true,
  showOwner = true,
  showStatusActionCard = true,
  showPropertyMetrics = true,
  buttonSize = "md",
  statusActionCard,
  onEmail,
  onPhone,
  onWhatsApp,
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
  const { agent } = propertyDetails;
  const visibleOwners = resolvePropertyOwners(propertyDetails);
  const displayAgentSection = showAgent && agent != null;
  const displayOwnerSection = showOwner && visibleOwners.length > 0;
  const hasContactColumn = displayAgentSection || displayOwnerSection;
  const handoverLabel = propertyDetails.handover?.trim() ?? "";
  const statusLabel = resolveStatusLabel(propertyDetails.status || "Draft");
  const fallbackPendingActions = resolvePendingStatusActions(
    propertyDetails.status || "Draft",
  );

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
            {handoverLabel ? <HandoverBadge handover={handoverLabel} /> : null}
          </section>

          {showStatusActionCard ? (
            <StatusActionCard
              statusActionCard={
                statusActionCard
                  ? {
                      ...statusActionCard,
                      pendingActions:
                        statusActionCard.pendingActions?.length
                          ? statusActionCard.pendingActions
                          : fallbackPendingActions,
                      statusLabel: statusActionCard.statusLabel || statusLabel,
                    }
                  : {
                      statusLabel,
                      pendingActions: fallbackPendingActions,
                    }
              }
              showStatusLabelFallback={statusLabel}
              buttonSize={buttonSize}
            />
          ) : null}

          {showPropertyMetrics ? (
            <PropertyMetrics
              averagePerUnit={averagePerUnit}
              areaUnitLabel={areaUnitLabel}
              documentStatus={documentStatus}
            />
          ) : null}
        </div>

        {hasContactColumn ? (
          <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4">
            {displayAgentSection && agent ? (
              <ListingAgentSection
                agent={agent}
                buttonSize={buttonSize}
                onEmail={onEmail}
                onPhone={onPhone}
                onWhatsApp={onWhatsApp}
              />
            ) : null}

            {displayOwnerSection ? (
              <OwnerSection
                owners={visibleOwners}
                showAgentAbove={Boolean(displayAgentSection && agent)}
              />
            ) : null}
          </div>
        ) : null}
      </Card>
    </aside>
  );
}
