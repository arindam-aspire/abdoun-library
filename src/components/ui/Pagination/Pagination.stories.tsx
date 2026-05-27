import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useState } from "react";
import { Pagination } from "./index";

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
      <div className="mx-auto w-full max-w-5xl bg-page p-4">
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
