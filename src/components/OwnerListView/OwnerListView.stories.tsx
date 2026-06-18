import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import type { SortConfig } from "../ui/Table";
import { OwnerListView } from "./index";
import { ownerListStoryOwners } from "./ownerListStoryData";
import { demoOwnerWorkflowActionHandlers } from "./ownerWorkflowActionsStoryConfig";
import type { OwnerListViewProps } from "./types";
import type { Owner } from "./types";

const onPageChange = fn();
const onPageSizeChange = fn();

const defaultPagination: NonNullable<OwnerListViewProps<Owner>["pagination"]> = {
  total: ownerListStoryOwners.length,
  page: 1,
  pageSize: 5,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
  pageOptions: [5, 10, 25],
  onPageChange,
  onPageSizeChange,
};

function OwnerListViewDemo(
  props: Omit<
    OwnerListViewProps<Owner>,
    "sortConfig" | "onSort" | "data" | "getRowId"
  > & {
    data?: Owner[];
    initialSort?: SortConfig;
  },
) {
  const {
    initialSort = [],
    data = ownerListStoryOwners,
    pagination: paginationProp,
    workflowActions = demoOwnerWorkflowActionHandlers,
    ...rest
  } = props;
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const [page, setPage] = useState(paginationProp?.page ?? 1);
  const [pageSize, setPageSize] = useState(paginationProp?.pageSize ?? 5);

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
    <OwnerListView
      data={data}
      getRowId={(owner) => owner.id}
      sortConfig={sortConfig}
      onSort={setSortConfig}
      workflowActions={workflowActions}
      pagination={pagination}
      {...rest}
    />
  );
}

const meta = {
  title: "Components/OwnerListView",
  component: OwnerListView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Responsive owner directory with a sortable table on `md` and `lg`, and a grid card layout below `md`.",
          "",
          "**Columns (table)**",
          "- **Name** — pinned left while scrolling",
          "- **Contacts** — email and optional phone",
          "- **Property Owned**",
          "- **Joined at**",
          "- **Status**",
          "- **Actions** — pinned right; View, Suspend / Activate, Delete",
          "",
          "**Mobile (`< md`)**",
          "- Status badge top-right; name is plain text",
          "- Property count and joined date, then optional contacts",
          "- Inline action buttons below contacts",
          "",
          "Pass `workflowActions` with `view`, `activate`, `suspend`, and `delete` handlers.",
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
  render: (args) => <OwnerListViewDemo {...args} />,
  argTypes: {
    columns: { control: false },
    workflowActions: { control: false },
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
    listTitle: "Owners",
    buttonSize: "md",
    data: ownerListStoryOwners,
    workflowActions: demoOwnerWorkflowActionHandlers,
    pagination: defaultPagination,
  },
} satisfies Meta<typeof OwnerListView>;

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
          "Mobile cards show status top-right and owner actions: View, Suspend (active), Activate (suspended), Delete.",
      },
    },
  },
};
