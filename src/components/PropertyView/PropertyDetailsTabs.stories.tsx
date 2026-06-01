import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PropertyDetailsTabs } from "./PropertyDetailsTabs";
import {
  propertyViewStoryFeatures,
  propertyViewStoryProperty,
  propertyViewStoryTabOptions,
} from "./propertyViewStoryData";

function PropertyDetailsTabsDemo({
  initialTab = "overview",
}: {
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <PropertyDetailsTabs
      tabOptions={propertyViewStoryTabOptions}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      propertyDetails={propertyViewStoryProperty}
      features={propertyViewStoryFeatures}
      showAgent
      showOwner
    />
  );
}

const meta = {
  title: "Components/PropertyView/PropertyDetailsTabs",
  component: PropertyDetailsTabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl bg-page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PropertyDetailsTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PropertyDetailsTabsDemo />,
};

export const FeaturesTab: Story = {
  render: () => <PropertyDetailsTabsDemo initialTab="features" />,
};

/** Icons are filled in automatically for standard tab values. */
export const DefaultIcons: Story = {
  name: "Default icons (no icon prop)",
  render: () => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
      <PropertyDetailsTabs
        tabOptions={propertyViewStoryTabOptions.map(({ label, value }) => ({
          label,
          value,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        propertyDetails={propertyViewStoryProperty}
        features={propertyViewStoryFeatures}
        showAgent
        showOwner
      />
    );
  },
};

export const Loading: Story = {
  args: {
    tabOptions: propertyViewStoryTabOptions,
    activeTab: "overview",
    isLoading: true,
    showAgent: true,
    showOwner: true,
  },
};
