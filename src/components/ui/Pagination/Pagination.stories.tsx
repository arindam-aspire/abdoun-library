import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { Pagination, TablePagination } from "./index";

function PaginationDemo({
  initialPage = 1,
  initialPageSize = 4,
  totalItems = 18,
}: {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  return (
    <Pagination
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={(page) => {
        setCurrentPage(page);
        fn()(page);
      }}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
        fn()(size);
      }}
    />
  );
}

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full bg-page p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    currentPage: 1,
    totalItems: 18,
    pageSize: 4,
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PaginationDemo />,
};

export const MiddlePage: Story = {
  render: () => <PaginationDemo initialPage={3} />,
};

export const LastPage: Story = {
  render: () => <PaginationDemo initialPage={5} />,
};

function TablePaginationDemo({
  initialPage = 1,
  initialPageSize = 5,
  totalItems = 13,
}: {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  return (
    <div className="overflow-hidden rounded-xl border border-secondary/15 bg-surface">
      <div className="px-4 py-6 text-sm text-muted">Table body…</div>
      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 25]}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        className="border-t border-secondary/15"
      />
    </div>
  );
}

export const TableVariant: Story = {
  render: () => <TablePaginationDemo />,
};

export const TableVariantMiddlePage: Story = {
  render: () => <TablePaginationDemo initialPage={2} />,
};

export const WithoutPageSizeSelector: Story = {
  render: () => (
    <Pagination
      currentPage={1}
      totalItems={18}
      pageSize={4}
      showPageSizeSelector={false}
      onPageChange={fn()}
    />
  ),
};

export const EmptyResults: Story = {
  render: () => (
    <Pagination
      currentPage={1}
      totalItems={0}
      pageSize={4}
      onPageChange={fn()}
      onPageSizeChange={fn()}
    />
  ),
};

/** Below `md`: page 4 → `1, …, 3, 4, 5, …, 147` */
export const CompactPageFour: Story = {
  render: () => (
    <PaginationDemo initialPage={4} initialPageSize={1} totalItems={147} />
  ),
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/** Below `md`: page 5 → `1, …, 4, 5, 6, …, 147` */
export const ManyPagesMiddle: Story = {
  render: () => (
    <PaginationDemo initialPage={5} initialPageSize={1} totalItems={147} />
  ),
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/** 147 pages — page 40 → `1, …, 39, 40, 41, …, 147` */
export const ManyPagesMidRange: Story = {
  render: () => (
    <PaginationDemo initialPage={40} initialPageSize={1} totalItems={147} />
  ),
};

export const ManyPagesNearEnd: Story = {
  render: () => (
    <PaginationDemo initialPage={146} initialPageSize={1} totalItems={147} />
  ),
};
