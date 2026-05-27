"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { Tab } from "../ui/Tab";
import { DocumentsTab } from "./DocumentsTab";
import { FeatureTab } from "./FeatureTab";
import { HeroSection } from "./HeroSection";
import { LocationTab } from "./LocationTab";
import { OverviewTab } from "./OverviewTab";
import { PriceAgentSection } from "./PriceAgentSection";
import {
  DEFAULT_PROPERTY_DETAILS_TAB_OPTIONS,
  getPropertyDetailsTabOptions,
} from "./propertyDetailsTabs";
import { PropertyDetailsSkleton } from "./PropertyDetailsSkleton";
import type { PropertyDetailsProps, PropertyDetailsTabValue } from "./types";
import {
  formatPropertyLocation,
  getLocalizedText,
} from "./utils";

export {
  DEFAULT_PROPERTY_DETAILS_TAB_OPTIONS,
  getPropertyDetailsTabOptions,
  canViewRestrictedPropertyDetailsTabs,
} from "./propertyDetailsTabs";

export function PropertyDetails({
  applicationKey,
  propertyDetails,
  isLoading = false,
  className,
  locale = "en",
  isAuthenticated = false,
  isFavourite = false,
  isFavouriteLoading = false,
  role,
  tabOptions: tabOptionsProp,
  activeTab: activeTabProp,
  defaultTab,
  onTabChange,
  onFavourite,
  onEmail,
  onPhone,
  onWhatsApp,
  onOwnerEmail,
  onOwnerPhone,
  onOwnerWhatsApp,
  showAgents = true,
  showOwners = true,
  ownerCompanyLabel,
}: PropertyDetailsProps) {
  const tabOptions = useMemo(
    () => tabOptionsProp ?? getPropertyDetailsTabOptions(role),
    [role, tabOptionsProp],
  );

  const [uncontrolledTab, setUncontrolledTab] = useState<PropertyDetailsTabValue>(
    () =>
      (defaultTab as PropertyDetailsTabValue | undefined) ??
      tabOptions[0]?.value ??
      "overview",
  );

  const isControlled = activeTabProp !== undefined;
  const activeTab = (isControlled
    ? activeTabProp
    : uncontrolledTab) as PropertyDetailsTabValue;

  const handleTabChange = (value: string) => {
    const nextTab = value as PropertyDetailsTabValue;
    if (!isControlled) {
      setUncontrolledTab(nextTab);
    }
    onTabChange?.(nextTab);
  };

  useEffect(() => {
    const isActiveTabVisible = tabOptions.some((tab) => tab.value === activeTab);
    if (isActiveTabVisible || tabOptions.length === 0) {
      return;
    }

    const fallbackTab = tabOptions[0]?.value ?? "overview";
    if (!isControlled) {
      setUncontrolledTab(fallbackTab);
    }
    onTabChange?.(fallbackTab);
  }, [activeTab, isControlled, onTabChange, tabOptions]);

  if (isLoading) {
    return <PropertyDetailsSkleton className={className} />;
  }

  const title = getLocalizedText(propertyDetails.title, locale);
  const location = formatPropertyLocation(propertyDetails, locale);
  const images =
    propertyDetails.media.images.length > 0
      ? propertyDetails.media.images
      : propertyDetails.media.thumbnail
        ? [propertyDetails.media.thumbnail]
        : [];

  return (
    <article className={cn("flex w-full flex-col gap-8", className)}>
      <HeroSection
        images={images}
        title={title}
        location={location}
        listingType={propertyDetails.listing_type}
        isExclusive={propertyDetails.is_exclusive}
        brokerName={propertyDetails.agent.name}
        isAuthenticated={isAuthenticated}
        isFavourite={isFavourite}
        isFavouriteLoading={isFavouriteLoading}
        onFavourite={
          onFavourite ? () => onFavourite(propertyDetails.id) : undefined
        }
      />

      {tabOptions.length > 0 ? (
        <>
          <Tab
            items={tabOptions}
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Property details sections"
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div role="tabpanel" className="min-w-0 lg:col-span-2">
              {activeTab === "overview" ? (
                <OverviewTab
                  propertyDetails={propertyDetails}
                  applicationKey={applicationKey}
                  locale={locale}
                />
              ) : null}
              {activeTab === "features" ? (
                <FeatureTab propertyDetails={propertyDetails} />
              ) : null}
              {activeTab === "locations" ? (
                <LocationTab
                  propertyDetails={propertyDetails}
                  locale={locale}
                />
              ) : null}
              {activeTab === "documents" ? (
                <DocumentsTab propertyDetails={propertyDetails} />
              ) : null}
            </div>

            <PriceAgentSection
              propertyDetails={propertyDetails}
              applicationKey={applicationKey}
              showAgent={showAgents}
              showOwner={showOwners}
              ownerCompanyLabel={ownerCompanyLabel}
              onEmail={onEmail ? () => onEmail(propertyDetails.id) : undefined}
              onPhone={onPhone ? () => onPhone(propertyDetails.id) : undefined}
              onWhatsApp={
                onWhatsApp ? () => onWhatsApp(propertyDetails.id) : undefined
              }
              onOwnerEmail={
                onOwnerEmail
                  ? () => onOwnerEmail(propertyDetails.id, propertyDetails.owner.id)
                  : undefined
              }
              onOwnerPhone={
                onOwnerPhone
                  ? () => onOwnerPhone(propertyDetails.id, propertyDetails.owner.id)
                  : undefined
              }
              onOwnerWhatsApp={
                onOwnerWhatsApp
                  ? () => onOwnerWhatsApp(propertyDetails.id, propertyDetails.owner.id)
                  : undefined
              }
            />
          </div>
        </>
      ) : null}
    </article>
  );
}

export { PropertyDetailsSkleton } from "./PropertyDetailsSkleton";
export type { PropertyDetailsSkletonProps } from "./PropertyDetailsSkleton";
export type {
  ApplicationKey,
  DocumentsTabProps,
  FeatureTabProps,
  Locale,
  LocationTabProps,
  OverviewTabProps,
  PriceAgentSectionProps,
  PropertyDetails as PropertyDetailsModel,
  PropertyDetailsProps,
  PropertyDetailsRole,
  PropertyDetailsTabOption,
  PropertyDetailsTabValue,
} from "./types";
