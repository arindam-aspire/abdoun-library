import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useMemo, useState } from "react";
import { Badge } from "../Badge";
import {
  Table,
  TableBodySkeleton,
  sortRowsByConfig,
  type SortConfig,
  type TableColumn,
} from "./index";

type DemoRow = {
  id: string;
  reference: string;
  title: string;
  location: string;
  price: number;
  status: string;
  updatedAt: string;
};

const demoRows: DemoRow[] = [
  {
    id: "1",
    reference: "REF-301",
    title: "Modern Villa with Garden",
    location: "Abdoun, Amman",
    price: 450000,
    status: "Available",
    updatedAt: "2026-03-01",
  },
  {
    id: "2",
    reference: "REF-302",
    title: "Luxury Apartment",
    location: "Abdoun, Amman",
    price: 320000,
    status: "Available",
    updatedAt: "2026-02-18",
  },
  {
    id: "3",
    reference: "REF-303",
    title: "Family Home with Terrace",
    location: "Khalda, Amman",
    price: 280000,
    status: "Reserved",
    updatedAt: "2026-01-22",
  },
  {
    id: "4",
    reference: "REF-304",
    title: "Penthouse with Views",
    location: "Abdoun, Amman",
    price: 620000,
    status: "Available",
    updatedAt: "2026-03-10",
  },
];

const columns: TableColumn<DemoRow>[] = [
  {
    id: "reference",
    header: "Reference",
    align: "start",
    sortable: true,
    getSortValue: (row) => row.reference,
    render: (row) => (
      <span className="font-medium text-secondary">{row.reference}</span>
    ),
  },
  {
    id: "title",
    header: "Property",
    align: "start",
    sortable: true,
    getSortValue: (row) => row.title,
    render: (row) => row.title,
  },
  {
    id: "location",
    header: "Location",
    align: "start",
    sortable: true,
    getSortValue: (row) => row.location,
    render: (row) => row.location,
  },
  {
    id: "price",
    header: "Price (JOD)",
    align: "end",
    sortable: true,
    cellClassName: "font-medium text-secondary tabular-nums",
    getSortValue: (row) => row.price,
    render: (row) => row.price.toLocaleString(),
  },
  {
    id: "status",
    header: "Status",
    align: "center",
    sortable: true,
    getSortValue: (row) => row.status,
    render: (row) => (
      <div className="flex justify-center">
        <Badge
          variant={row.status === "Reserved" ? "warning" : "success"}
          appearance="soft"
        >
          {row.status}
        </Badge>
      </div>
    ),
  },
  {
    id: "updatedAt",
    header: "Updated",
    align: "center",
    sortable: true,
    getSortValue: (row) => row.updatedAt,
    render: (row) => row.updatedAt,
  },
];

function TableDemo({
  initialSort = [] as SortConfig,
  loading = false,
  error = null as string | null,
  data = demoRows,
  pinnedColumns,
}: {
  initialSort?: SortConfig;
  loading?: boolean;
  error?: string | null;
  data?: DemoRow[];
  pinnedColumns?: { left?: string[]; right?: string[] };
}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const sorted = useMemo(
    () =>
      sortRowsByConfig(data, sortConfig, (row, columnId) => {
        const col = columns.find((c) => c.id === columnId);
        return col?.getSortValue?.(row);
      }),
    [data, sortConfig],
  );

  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Table
      columns={columns}
      data={pageRows}
      getRowId={(row) => row.id}
      sortConfig={sortConfig}
      onSort={setSortConfig}
      loading={loading}
      skeleton={<TableBodySkeleton rows={3} columns={columns.length} />}
      error={error}
      emptyMessage="No rows to display."
      pagination={{
        showWhen: !loading && !error && data.length > 0,
        currentPage: page,
        totalItems: data.length,
        pageSize,
        pageSizeOptions: [3, 5, 10],
        onPageChange: setPage,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setPage(1);
        },
      }}
      pinnedColumns={pinnedColumns}
    />
  );
}

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TableDemo />,
};

export const WithInitialSort: Story = {
  render: () => (
    <TableDemo initialSort={[{ id: "price", direction: "desc" }]} />
  ),
};

export const Loading: Story = {
  render: () => <TableDemo loading />,
};

export const Error: Story = {
  render: () => (
    <TableDemo error="Unable to reach the listings service (503)." />
  ),
};

export const Empty: Story = {
  render: () => <TableDemo data={[]} />,
};

export const Interactive: Story = {
  render: () => <TableDemo />,
  parameters: {
    docs: {
      description: {
        story: "Click headers to sort. Shift+click to add multi-column sort rules.",
      },
    },
  },
};

export const MobileTransposedView: Story = {
  render: () => <TableDemo />,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Below `sm`: field headers are pinned on the left; each record becomes a scrollable column. Pinned columns apply from `sm` up only.",
      },
    },
  },
};

export const WithPinnedColumns: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-xl bg-page p-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <TableDemo
      pinnedColumns={{
        left: ["reference", "title"],
        right: ["updatedAt"],
      }}
    />
  ),
};
