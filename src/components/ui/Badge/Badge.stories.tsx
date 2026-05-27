import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./index";
import { BADGE_APPEARANCES, BADGE_VARIANTS } from "./types";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Badge",
  },
  argTypes: {
    variant: {
      control: "select",
      options: BADGE_VARIANTS,
    },
    appearance: {
      control: "select",
      options: BADGE_APPEARANCES,
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    appearance: "solid",
    children: "For Sale",
  },
};

export const Soft: Story = {
  args: {
    variant: "default",
    appearance: "soft",
    children: "For Sale",
  },
};

export const AllVariantsSolid: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      {BADGE_VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant} appearance="solid">
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const AllVariantsSoft: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      {BADGE_VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant} appearance="soft">
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {BADGE_APPEARANCES.map((appearance) => (
        <div key={appearance} className="flex flex-col gap-2">
          <p className="text-sm font-medium capitalize text-muted">{appearance}</p>
          <div className="flex flex-wrap gap-2">
            {BADGE_VARIANTS.map((variant) => (
              <Badge key={variant} variant={variant} appearance={appearance}>
                {variant}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const PropertyLabels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">For Sale</Badge>
      <Badge variant="secondary" appearance="soft">
        New Listing
      </Badge>
      <Badge variant="exclusive">Exclusive</Badge>
      <Badge variant="success" appearance="soft">
        Verified
      </Badge>
      <Badge variant="warning" appearance="soft">
        Price Reduced
      </Badge>
      <Badge variant="destructive">Sold</Badge>
      <Badge variant="outline" appearance="soft">
        3 bed · 2 bath
      </Badge>
    </div>
  ),
};
