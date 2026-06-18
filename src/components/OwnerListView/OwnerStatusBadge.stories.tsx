import type { Meta, StoryObj } from "@storybook/react-vite";
import type { OwnerStatusKey } from "./types";
import { OwnerStatusBadge } from "./OwnerStatusBadge";

const statuses: { key: OwnerStatusKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

const meta = {
  title: "Components/OwnerListView/OwnerStatusBadge",
  component: OwnerStatusBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-page p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OwnerStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map((status) => (
        <OwnerStatusBadge key={status.key} status={status} />
      ))}
    </div>
  ),
};

export const Suspended: Story = {
  args: {
    status: { key: "suspended", label: "Suspended" },
  },
};
