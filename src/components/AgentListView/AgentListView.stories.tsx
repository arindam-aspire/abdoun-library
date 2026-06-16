import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useMemo, useState } from "react";
import type { SortConfig } from "../ui/Table";
import { AgentListView } from "./index";
import { buildAgentTableColumns } from "./agentTableColumns";
import { agentListStoryAgents } from "./agentListStoryData";
import { demoAgentStatusRowActions } from "./agentWorkflowActionsStoryConfig";
import type { AgentListViewProps } from "./types";
import type { Agent } from "./types";

const onPageChange = fn();
const onPageSizeChange = fn();

const defaultPagination: NonNullable<AgentListViewProps<Agent>["pagination"]> = {
  total: agentListStoryAgents.length,
  page: 1,
  pageSize: 6,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  pageOptions: [6, 10, 25],
  onPageChange,
  onPageSizeChange,
};

function AgentListViewDemo(
  props: Omit<
    AgentListViewProps<Agent>,
    "sortConfig" | "onSort" | "data" | "columns" | "getRowId"
  > & {
    data?: Agent[];
    initialSort?: SortConfig;
    columns?: AgentListViewProps<Agent>["columns"];
  },
) {
  const {
    initialSort = [],
    data = agentListStoryAgents,
    pagination: paginationProp,
    columns: columnsProp,
    rowActions = demoAgentStatusRowActions,
    ...rest
  } = props;
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const [page, setPage] = useState(paginationProp?.page ?? 1);
  const [pageSize, setPageSize] = useState(paginationProp?.pageSize ?? 6);

  const columns = useMemo(
    () =>
      columnsProp ??
      buildAgentTableColumns({
        rowActions,
      }),
    [columnsProp, rowActions],
  );

  const pagination = paginationProp
    ? {
        ...paginationProp,
        page,
        pageSize,
        onPageChange: (nextPage: number) => {
          setPage(nextPage);
          paginationProp.onPageChange?.(nextPage);
          onPageChange(nextPage);
        },
        onPageSizeChange: (nextPageSize: number) => {
          setPageSize(nextPageSize);
          setPage(1);
          paginationProp.onPageSizeChange?.(nextPageSize);
          onPageSizeChange(nextPageSize);
        },
      }
    : undefined;

  return (
    <AgentListView
      data={data}
      columns={columns}
      getRowId={(agent) => agent.id}
      getRowLabel={(agent) => agent.name}
      sortConfig={sortConfig}
      onSort={setSortConfig}
      rowActions={rowActions}
      pagination={pagination}
      {...rest}
    />
  );
}

const meta = {
  title: "Components/AgentListView",
  component: AgentListView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Responsive agent directory with a sortable table on `md` and `lg`, and a grid card layout below `md`.",
          "",
          "**Columns (table)**",
          "- **Name** — pinned left while scrolling",
          "- **Contacts** — email and phone stacked",
          "- **City**",
          "- **Status**",
          "- **Activity Date**",
          "- **Actions** — pinned right; status-based menu from `rowActions`",
          "",
          "**Mobile (`< md`)**",
          "- Status badge top-right; name is plain text (not a link)",
          "- Tappable contacts, then inline action buttons (no footer border)",
          "- Use `buildAgentStatusRowActions()` for Active / Inactive / Pending action sets",
          "",
          "Pass custom `columns` and `rowActions` to override the default agent layout.",
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
  render: (args) => <AgentListViewDemo {...args} />,
  argTypes: {
    columns: { control: false },
    rowActions: { control: false },
    sortConfig: { control: false },
    onSort: { control: false },
    getRowId: { control: false },
    getRowLabel: { control: false },
    renderGridCard: { control: false },
    mobileRowActions: { control: false },
    onColumnWidthsChange: { action: "columnWidthsChange" },
    onRowClick: { control: false },
  },
  args: {
    listTitle: "Agents",
    buttonSize: "md",
    data: agentListStoryAgents,
    rowActions: demoAgentStatusRowActions,
    pagination: defaultPagination,
  },
} satisfies Meta<typeof AgentListView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: [],
  },
};

export const Empty: Story = {
  args: {
    data: [],
    pagination: {
      ...defaultPagination,
      total: 0,
    },
  },
};

export const MobileGrid: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Mobile cards show status top-right and status-based action buttons below contacts (Active: Deactivate, Grant Admin, Remove; Inactive: Activate, Remove; Pending: Approve, Decline, Remove).",
      },
    },
  },
};
