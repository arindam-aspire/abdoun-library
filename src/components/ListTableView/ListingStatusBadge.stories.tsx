import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  PROPERTY_LISTING_STATUS_KEYS,
  createListingStatus,
} from "../PropertyCardList/listingStatus";
import { ListingStatusBadge } from "./ListingStatusBadge";

const meta = {
  title: "ListTableView/ListingStatusBadge",
  component: ListingStatusBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ListingStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = {
  args: {
    status: createListingStatus("draft"),
  },
};

export const InProgress: Story = {
  args: {
    status: createListingStatus("in_progress"),
  },
};

export const PendingApproval: Story = {
  args: {
    status: createListingStatus("pending_approval"),
  },
};

export const ChangesRequested: Story = {
  args: {
    status: createListingStatus("changes_requested"),
  },
};

export const Approved: Story = {
  args: {
    status: createListingStatus("approved"),
  },
};

export const Rejected: Story = {
  args: {
    status: createListingStatus("rejected"),
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      {PROPERTY_LISTING_STATUS_KEYS.map((key) => (
        <ListingStatusBadge key={key} status={createListingStatus(key)} />
      ))}
    </div>
  ),
};
