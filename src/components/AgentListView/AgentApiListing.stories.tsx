import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useMemo, useState } from "react";
import type { SortConfig } from "../ui/Table";
import { AgentListView } from "./index";
import { mapAgentApiListingsToAgents } from "./agentApiListing";
import type { AgentApiListing } from "./agentApiListing";
import { agentApiListTableJson } from "./agentApiListStoryData";
import { demoAgentWorkflowActionHandlers } from "./agentWorkflowActionsStoryConfig";

const onPageChange = fn();
const onPageSizeChange = fn();

const exampleAgentApiJson: AgentApiListing[] = agentApiListTableJson;

const exampleAgentApiJsonSnippet = JSON.stringify(exampleAgentApiJson[0], null, 2);

type AgentApiListDemoProps = {
  apiData?: AgentApiListing[];
  initialSort?: SortConfig;
};

function AgentApiListDemo({
  apiData = exampleAgentApiJson,
  initialSort,
}: AgentApiListDemoProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort ?? []);
  const agents = useMemo(() => mapAgentApiListingsToAgents(apiData), [apiData]);

  return (
    <AgentListView
      data={agents}
      getRowId={(agent) => agent.id}
      getRowLabel={(agent) => agent.name}
      sortConfig={sortConfig}
      onSort={setSortConfig}
      workflowActions={demoAgentWorkflowActionHandlers}
      listTitle="Agents"
      pagination={{
        total: agents.length,
        page: 1,
        pageSize: 6,
        pageOptions: [6, 10, 25],
        onPageChange,
        onPageSizeChange,
      }}
    />
  );
}

const meta = {
  title: "AgentListView/Agent API",
  component: AgentApiListDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Use `mapAgentApiListingsToAgents()` to convert agent list API JSON into `Agent[]` for `AgentListView`.",
          "",
          "**Field mapping**",
          "- `fullName` → **Name**",
          "- `email` / `phone` → **Contacts**",
          "- `serviceArea` → **City**",
          "- `status` → badge (`ACTIVE`, `INACTIVE`, `PENDING_APPROVAL`, `SUSPENDED`, `DECLINED`, `INVITED`, …)",
          "- `reviewedAt` → **Activity Date**",
          "",
          "**Row actions** — pass handlers via `workflowActions` (status picks which buttons show)",
          "",
          "**Example API JSON**",
          "```json",
          exampleAgentApiJsonSnippet,
          "```",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl bg-page p-4 sm:p-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    apiData: { control: false },
    initialSort: { control: false },
  },
} satisfies Meta<typeof AgentApiListDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SortedByActivityDate: Story = {
  args: {
    initialSort: [{ id: "activityDate", direction: "desc" }],
  },
};

export const MobileGrid: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
