"use client";

import { useEffect, useMemo, useState } from "react";
import { Tab } from "../ui/Tab";
import { mapPropertyViewTabOptions } from "./propertyTabDefaults";
import { DocumentsTab } from "./DocumentsTab";
import { DocumentsTabSkeleton } from "./DocumentsTabSkeleton";
import { FeatureTab } from "./FeatureTab";
import { FeatureTabSkeleton } from "./FeatureTabSkeleton";
import { LocationTab } from "./LocationTab";
import { LocationTabSkeleton } from "./LocationTabSkeleton";
import { OverviewTab } from "./OverviewTab";
import { OverviewTabSkeleton } from "./OverviewTabSkeleton";
import { PropertyDetailsTabBarSkeleton } from "./PropertyDetailsTabBarSkeleton";
import { PropertyInfo } from "./PropertyInfo";
import { PropertyInfoSkeleton } from "./PropertyInfoSkeleton";
import type { PropertyDetailsTabsProps } from "./types";

function renderTabSkeleton(activeTab: string) {
  switch (activeTab) {
    case "features":
      return <FeatureTabSkeleton />;
    case "locations":
      return <LocationTabSkeleton />;
    case "documents":
      return <DocumentsTabSkeleton />;
    case "overview":
    default:
      return <OverviewTabSkeleton />;
  }
}

function renderTabPanel({
  activeTab,
  propertyDetails,
  applicationKey,
  locale,
  features,
}: {
  activeTab: string;
  propertyDetails: NonNullable<PropertyDetailsTabsProps["propertyDetails"]>;
  applicationKey: PropertyDetailsTabsProps["applicationKey"];
  locale: PropertyDetailsTabsProps["locale"];
  features: PropertyDetailsTabsProps["features"];
}) {
  switch (activeTab) {
    case "overview":
      return (
        <OverviewTab
          propertyDetails={propertyDetails}
          applicationKey={applicationKey}
          locale={locale}
        />
      );
    case "features":
      return (
        <FeatureTab
          propertyDetails={propertyDetails}
          features={features ?? []}
        />
      );
    case "locations":
      return (
        <LocationTab propertyDetails={propertyDetails} locale={locale} />
      );
    case "documents":
      return <DocumentsTab propertyDetails={propertyDetails} />;
    default:
      return null;
  }
}

export function PropertyDetailsTabs({
  tabOptions = [],
  activeTab: activeTabProp,
  onTabChange,
  className,
  propertyDetails,
  applicationKey = "abdoun_web",
  locale = "en",
  features = [],
  isLoading = false,
  showAgent = true,
  showOwner = true,
  ownerSkeletonCount = 1,
  showStatusActionCard = true,
  showPropertyMetrics = true,
  onAgentEmail,
  onAgentPhone,
  onAgentWhatsApp,
  onOwnerEmail,
  onOwnerPhone,
  onOwnerWhatsApp,
  statusActionCard,
  buttonSize = "md",
}: PropertyDetailsTabsProps) {
  const options = useMemo(
    () => mapPropertyViewTabOptions(tabOptions),
    [tabOptions],
  );

  const [uncontrolledTab, setUncontrolledTab] = useState(
    () => options[0]?.value ?? "",
  );

  const isControlled = activeTabProp !== undefined;
  const activeTab = isControlled ? activeTabProp : uncontrolledTab;

  const handleTabChange = (value: string) => {
    if (!isControlled) {
      setUncontrolledTab(value);
    }
    onTabChange?.(value);
  };

  useEffect(() => {
    const isActiveTabVisible = options.some((tab) => tab.value === activeTab);
    if (isActiveTabVisible || options.length === 0) {
      return;
    }

    const fallbackTab = options[0]?.value ?? "";
    if (!isControlled) {
      setUncontrolledTab(fallbackTab);
    }
    if (fallbackTab) {
      onTabChange?.(fallbackTab);
    }
  }, [activeTab, isControlled, onTabChange, options]);

  if (options.length === 0) {
    return null;
  }

  const showPanel = isLoading || Boolean(propertyDetails);

  return (
    <>
      {isLoading ? (
        <PropertyDetailsTabBarSkeleton
          count={options.length}
          className={className}
        />
      ) : (
        <Tab
          className={className}
          items={options}
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Property details sections"
        />
      )}

      <div className="grid grid-cols-1 gap-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
        {showPanel ? (
          <div role="tabpanel" className="min-w-0 lg:col-span-2">
            {isLoading || !propertyDetails
              ? renderTabSkeleton(activeTab)
              : renderTabPanel({
                  activeTab,
                  propertyDetails,
                  applicationKey,
                  locale,
                  features,
                })}
          </div>
        ) : null}

        {isLoading || !propertyDetails ? (
          <PropertyInfoSkeleton
            showAgent={showAgent}
            showOwner={showOwner}
            ownerCount={ownerSkeletonCount}
            showPropertyMetrics={showPropertyMetrics}
          />
        ) : (
          <PropertyInfo
            propertyDetails={propertyDetails}
            applicationKey={applicationKey}
            showAgent={showAgent}
            showOwner={showOwner}
            showStatusActionCard={showStatusActionCard}
            showPropertyMetrics={showPropertyMetrics}
            statusActionCard={statusActionCard}
            onEmail={onAgentEmail}
            onPhone={onAgentPhone}
            onWhatsApp={onAgentWhatsApp}
            onOwnerEmail={onOwnerEmail}
            onOwnerPhone={onOwnerPhone}
            onOwnerWhatsApp={onOwnerWhatsApp}
            buttonSize={buttonSize}
          />
        )}
      </div>
    </>
  );
}
