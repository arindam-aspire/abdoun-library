import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { FileText, Info, MapPin, Sparkles } from "lucide-react";
import { Tab } from "./index";

const tabsWithIcons = [
  {
    value: "overview",
    label: "Overview",
    icon: <Info />,
  },
  {
    value: "features",
    label: "Features",
    icon: <Sparkles />,
  },
  {
    value: "locations",
    label: "Locations",
    icon: <MapPin />,
  },
  {
    value: "documents",
    label: "Documents",
    icon: <FileText />,
  },
] as const;

const tabsTextOnly = [
  { value: "overview", label: "Overview" },
  { value: "features", label: "Features" },
  { value: "locations", label: "Locations" },
  { value: "documents", label: "Documents" },
] as const;

function TabDemo({
  items,
  initialValue = "overview",
}: {
  items: typeof tabsWithIcons | typeof tabsTextOnly;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="w-full max-w-2xl">
      <Tab
        items={[...items]}
        value={value}
        onChange={(next) => {
          setValue(next);
          fn()(next);
        }}
      />
      <p className="mt-4 text-sm text-muted">Active: {value}</p>
    </div>
  );
}

const meta = {
  title: "UI/Tab",
  component: Tab,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    items: [...tabsWithIcons],
    defaultValue: "overview",
    onChange: fn(),
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcons: Story = {
  render: () => <TabDemo items={tabsWithIcons} />,
};

export const TextOnly: Story = {
  render: () => <TabDemo items={tabsTextOnly} />,
};

export const FeaturesActive: Story = {
  render: () => <TabDemo items={tabsWithIcons} initialValue="features" />,
};

export const Uncontrolled: Story = {
  args: {
    items: [...tabsTextOnly],
    defaultValue: "overview",
  },
};

export const NarrowViewport: Story = {
  name: "Narrow viewport (scroll)",
  render: () => (
    <div className="w-[280px] max-w-full border border-dashed border-secondary/20 p-2">
      <TabDemo items={tabsWithIcons} />
    </div>
  ),
};
