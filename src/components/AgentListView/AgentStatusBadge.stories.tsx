import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentStatusBadge } from "./AgentStatusBadge";
import type { AgentStatusKey } from "./types";

const statuses: { key: AgentStatusKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
];

const meta = {
  title: "Components/AgentListView/AgentStatusBadge",
  component: AgentStatusBadge,
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
} satisfies Meta<typeof AgentStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map((status) => (
        <AgentStatusBadge key={status.key} status={status} />
      ))}
    </div>
  ),
};

export const Inactive: Story = {
  args: {
    status: { key: "inactive", label: "Inactive" },
  },
};
