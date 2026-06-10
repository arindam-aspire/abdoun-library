import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ExternalLink, Mail, Phone, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SortConfig } from "../ui/Table";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { ListTableView } from "./index";
import { listTableStoryListings } from "./listTableStoryData";
import type { ListTableViewProps } from "./types";
import { demoWorkflowActions } from "./workflowActionsStoryConfig";

const sharedHandlers: Pick<
  ListTableViewProps,
  "onClick" | "onClickEmail" | "onClickCall" | "onClickWhatsApp"
> = {
  onClick: fn(),
  onClickEmail: fn(),
  onClickCall: fn(),
  onClickWhatsApp: fn(),
};

function ListTableViewDemo(
  props: Omit<ListTableViewProps, "sortConfig" | "onSort" | "data"> & {
    data?: ListTableViewProps["data"];
    initialSort?: SortConfig;
  },
) {
  const {
    initialSort = [],
    data = listTableStoryListings,
    pagination: paginationProp,
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
          fn()(nextPage);
        },
        onPageSizeChange: (nextPageSize: number) => {
          setPageSize(nextPageSize);
          setPage(1);
          paginationProp.onPageSizeChange?.(nextPageSize);
          fn()(nextPageSize);
        },
      }
    : undefined;

  return (
    <ListTableView
      data={data}
      sortConfig={sortConfig}
      onSort={setSortConfig}
      pagination={pagination}
      {...rest}
    />
  );
}

const meta = {
  title: "Components/ListTableView",
  component: ListTableView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-7xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    listTitle: "Properties",
    data: listTableStoryListings,
    pagination: {
      total: listTableStoryListings.length,
      page: 1,
      pageSize: 5,
      pageOptions: [5, 10, 25],
    },
    workflowActions: demoWorkflowActions,
    onClick: fn(),
    onColumnWidthsChange: fn(),
  },
} satisfies Meta<typeof ListTableView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ListTableViewDemo {...args} />,
};

export const SortedByPrice: Story = {
  render: (args) => (
    <ListTableViewDemo
      {...args}
      initialSort={[{ id: "price", direction: "desc" }]}
    />
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: [],
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const Empty: Story = {
  args: {
    data: [],
    pagination: { total: 0, page: 1, pageSize: 10 },
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const EmptyWithActions: Story = {
  args: {
    data: [],
    noDataFound: {
      title: "No listings match your filters",
      description: "Reset filters or broaden your search to see more properties.",
    },
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const PaginationLoading: Story = {
  args: {
    pagination: {
      total: listTableStoryListings.length,
      page: 1,
      pageSize: 10,
      isLoading: true,
    },
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const WithWorkflowActions: Story = {
  args: {
    workflowActions: demoWorkflowActions,
    onClick: fn(),
    onClickEmail: undefined,
    onClickCall: undefined,
    onClickWhatsApp: undefined,
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const WithRowActionsMenu: Story = {
  args: {
    rowActions: undefined,
    workflowActions: undefined,
    canViewDelete: true,
    onClickDelete: fn(),
    onClickEmail: fn(),
    onClickCall: fn(),
    onClickWhatsApp: fn(),
    data: listTableStoryListings.map((item, index) =>
      index === 1 ? { ...item, is_delete_loading: true } : item,
    ),
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const MobileTransposedView: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Below `sm`: field labels stay pinned on the left; swipe horizontally through listing columns.",
      },
    },
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const WithPinnedColumns: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    pinnedColumns: {
      left: ["reference", "property"],
      right: ["action"],
    },
    canViewDelete: true,
    onClickDelete: fn(),
    onColumnWidthsChange: fn(),
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const ResizableWithPinnedColumns: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    resizableColumns: true,
    pinnedColumns: {
      left: ["reference", "property"],
      right: ["action"],
    },
    canViewDelete: true,
    onClickDelete: fn(),
    onColumnWidthsChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Resizable columns with left/right pinning. Scroll horizontally and drag header edges to resize.",
      },
    },
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const ResizableColumns: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-4xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    resizableColumns: true,
    canViewDelete: true,
    onClickDelete: fn(),
    onColumnWidthsChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Drag the right edge of each header to resize columns on desktop. The actions column stays fixed width.",
      },
    },
  },
  render: (args) => <ListTableViewDemo {...args} />,
};

export const WithCustomRowActions: Story = {
  args: {
    onClickEmail: undefined,
    onClickCall: undefined,
    onClickWhatsApp: undefined,
    rowActions: (listing) => [
      {
        id: "view",
        label: "View property",
        icon: <ExternalLink className="size-4 shrink-0" aria-hidden />,
        onClick: fn(),
      },
      {
        id: "email",
        label: "Email",
        icon: <Mail className="size-4 shrink-0" aria-hidden />,
        onClick: fn(),
      },
      {
        id: "call",
        label: "Call",
        icon: <Phone className="size-4 shrink-0" aria-hidden />,
        onClick: fn(),
        hidden: !listing.agent,
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: <WhatsAppIcon className="size-4 shrink-0" />,
        onClick: fn(),
      },
      {
        id: "share",
        label: "Share",
        icon: <Share2 className="size-4 shrink-0" aria-hidden />,
        onClick: fn(),
      },
      {
        id: "delete",
        label: "Remove listing",
        loadingLabel: "Removing…",
        icon: <Trash2 className="size-4 shrink-0" aria-hidden />,
        tone: "danger",
        onClick: fn(),
        loading: (row) => Boolean(row.is_delete_loading),
        hidden: listing.is_exclusive,
      },
    ],
    data: listTableStoryListings.map((item, index) =>
      index === 1 ? { ...item, is_delete_loading: true } : item,
    ),
  },
  render: (args) => <ListTableViewDemo {...args} />,
};
